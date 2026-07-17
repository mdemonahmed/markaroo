<?php

namespace Markaroo\Http\Controllers;

use Markaroo\Support\Capabilities;
use Markaroo\Support\Settings;

defined( 'ABSPATH' ) || exit;

class AttachmentsController {

	/** MIME types allowed for upload (merged with filter). */
	const DEFAULT_ALLOWED_MIMES = array(
		'jpg|jpeg|jpe' => 'image/jpeg',
		'png'          => 'image/png',
		'gif'          => 'image/gif',
		'webp'         => 'image/webp',
		'pdf'          => 'application/pdf',
		'doc'          => 'application/msword',
		'docx'         => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'xls'          => 'application/vnd.ms-excel',
		'xlsx'         => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		'csv'          => 'text/csv',
		'txt'          => 'text/plain',
	);

	/** Resolve effective type map via filter. */
	private static function allowed_mimes(): array {
		/**
		 * Filters the MIME types allowed for Markaroo attachment uploads.
		 * Pro can add SVG (with sanitizer hooked), audio/video, etc.
		 *
		 * @param array $mimes  Extension-keyed MIME type map.
		 */
		return (array) apply_filters( 'markaroo/attachments/allowed_types', self::DEFAULT_ALLOWED_MIMES );
	}

	/** Resolve max upload size in bytes. */
	private static function max_bytes(): int {
		$mb = (float) Settings::get( 'attachments.max_upload_mb', 10 );

		/**
		 * Filters the maximum Markaroo attachment size in bytes.
		 *
		 * @param int $bytes Default derived from settings.
		 */
		return (int) apply_filters( 'markaroo/attachments/max_size', (int) ( $mb * 1024 * 1024 ) );
	}

	// -----------------------------------------------------------------------
	// POST /attachments
	// -----------------------------------------------------------------------

	public static function create( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$files       = $request->get_file_params();
		$feedback_id = absint( $request->get_param( 'feedback_id' ) ?? 0 );

		if ( empty( $files['file'] ) || ! isset( $files['file']['tmp_name'] ) ) {
			return new \WP_Error(
				'markaroo_no_file',
				__( 'No file was uploaded.', 'markaroo' ),
				array( 'status' => 400 )
			);
		}

		$file    = $files['file'];
		$allowed = self::allowed_mimes();
		$maxsize = self::max_bytes();

		// Size check.
		if ( $file['size'] > $maxsize ) {
			return new \WP_Error(
				'markaroo_file_too_large',
				sprintf(
					/* translators: %s: human-readable size */
					__( 'File exceeds the maximum allowed size of %s.', 'markaroo' ),
					size_format( $maxsize )
				),
				array( 'status' => 400 )
			);
		}

		// MIME check using WP's built-in checker.
		$type_data = wp_check_filetype_and_ext( $file['tmp_name'], $file['name'], $allowed );

		if ( empty( $type_data['type'] ) ) {
			return new \WP_Error(
				'markaroo_invalid_type',
				__( 'File type is not allowed.', 'markaroo' ),
				array( 'status' => 400 )
			);
		}

		// Use WP upload infrastructure.
		if ( ! function_exists( 'wp_handle_upload' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}
		// wp_generate_attachment_metadata() lives in image.php; media.php pulls in
		// its deps. Guarding on wp_insert_attachment (always loaded) never fired,
		// so the metadata call fataled with a 500. Guard on the function we need.
		if ( ! function_exists( 'wp_generate_attachment_metadata' ) ) {
			require_once ABSPATH . 'wp-admin/includes/image.php';
			require_once ABSPATH . 'wp-admin/includes/media.php';
		}

		add_filter( 'upload_mimes', fn() => $allowed );

		$overrides = array(
			'test_form' => false,
			'test_type' => true,
		);

		$upload = wp_handle_upload( $file, $overrides );

		remove_all_filters( 'upload_mimes' );

		if ( isset( $upload['error'] ) ) {
			return new \WP_Error(
				'markaroo_upload_failed',
				$upload['error'],
				array( 'status' => 500 )
			);
		}

		// Insert into WP media library.
		$attachment = array(
			'post_mime_type' => sanitize_mime_type( $type_data['type'] ),
			'post_title'     => sanitize_file_name( pathinfo( $upload['file'], PATHINFO_FILENAME ) ),
			'post_content'   => '',
			'post_status'    => 'inherit',
		);

		$attachment_id = wp_insert_attachment( $attachment, $upload['file'], 0, true );

		if ( is_wp_error( $attachment_id ) ) {
			return new \WP_Error(
				'markaroo_attach_failed',
				__( 'Could not store attachment.', 'markaroo' ),
				array( 'status' => 500 )
			);
		}

		// Persist the generated metadata (image sizes etc.) — generating without
		// saving left attachments with no metadata at all.
		wp_update_attachment_metadata( $attachment_id, wp_generate_attachment_metadata( $attachment_id, $upload['file'] ) );

		// Tag the attachment so uninstall cleanup can find Markaroo uploads.
		update_post_meta( $attachment_id, '_markaroo_attachment', 1 );

		$meta = array(
			'id'         => $attachment_id,
			'url'        => esc_url( $upload['url'] ),
			'filename'   => sanitize_file_name( basename( $upload['file'] ) ),
			'mime'       => sanitize_mime_type( $type_data['type'] ),
			'size'       => (int) filesize( $upload['file'] ),
			'type_badge' => strtoupper( $type_data['ext'] ?? pathinfo( $upload['file'], PATHINFO_EXTENSION ) ),
		);

		/**
		 * Fires after an attachment is uploaded.
		 *
		 * @param array $meta        Attachment metadata returned to the client.
		 * @param int   $feedback_id The associated feedback ID (0 if not yet linked).
		 */
		do_action( 'markaroo/attachment/uploaded', $meta, $feedback_id );

		$response = rest_ensure_response( $meta );
		$response->set_status( 201 );

		return $response;
	}
}
