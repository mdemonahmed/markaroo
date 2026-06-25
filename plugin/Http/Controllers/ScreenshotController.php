<?php

namespace Markaroo\Http\Controllers;

use Markaroo\Repositories\FeedbackRepository;

defined( 'ABSPATH' ) || exit;

class ScreenshotController {

	/** Allowed MIME types for screenshots. */
	const ALLOWED_MIMES = array(
		'jpg|jpeg' => 'image/jpeg',
		'png'      => 'image/png',
	);

	// POST /feedback/{id}/screenshot
	public static function upload( \WP_REST_Request $request ): \WP_REST_Response|\WP_Error {
		$feedback_id = (int) $request['id'];
		$repo        = new FeedbackRepository();
		$feedback    = $repo->find( $feedback_id );

		if ( ! $feedback ) {
			return new \WP_Error( 'markaroo_not_found', __( 'Feedback not found.', 'markaroo' ), array( 'status' => 404 ) );
		}

		$files = $request->get_file_params();
		$file  = $files['screenshot'] ?? null;

		if ( ! $file || UPLOAD_ERR_OK !== (int) ( $file['error'] ?? UPLOAD_ERR_NO_FILE ) ) {
			return new \WP_Error( 'markaroo_invalid', __( 'No screenshot provided.', 'markaroo' ), array( 'status' => 400 ) );
		}

		// Validate MIME type.
		$allowed_mimes = array_values( self::ALLOWED_MIMES );
		if ( ! in_array( $file['type'], $allowed_mimes, true ) ) {
			return new \WP_Error(
				'markaroo_invalid',
				__( 'Screenshot must be JPEG or PNG.', 'markaroo' ),
				array( 'status' => 400 )
			);
		}

		require_once ABSPATH . 'wp-admin/includes/image.php';
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/media.php';

		/**
		 * Filters the wp_handle_upload() overrides for screenshot uploads.
		 * Pro can redirect uploads to external storage or change file permissions.
		 *
		 * @param array $overrides  wp_handle_upload() overrides.
		 * @param int   $feedback_id Feedback row ID.
		 */
		$overrides = (array) apply_filters(
			'markaroo/screenshot/upload_args',
			array(
				'test_form' => false,
				'mimes'     => self::ALLOWED_MIMES,
			),
			$feedback_id
		);

		/**
		 * Fires before a screenshot is saved to the media library.
		 *
		 * @param int   $feedback_id The feedback row ID.
		 * @param array $file        The $_FILES-style file array.
		 */
		do_action( 'markaroo/screenshot/before_capture', $feedback_id, $file );

		$uploaded = wp_handle_upload( $file, $overrides );

		if ( isset( $uploaded['error'] ) ) {
			return new \WP_Error(
				'markaroo_upload_failed',
				esc_html( $uploaded['error'] ),
				array( 'status' => 500 )
			);
		}

		// Insert into the WP media library.
		$attachment_id = wp_insert_attachment(
			array(
				'post_title'     => sprintf(
					/* translators: %d = feedback item ID */
					__( 'Markaroo Screenshot #%d', 'markaroo' ),
					$feedback_id
				),
				'post_mime_type' => $uploaded['type'],
				'post_status'    => 'inherit',
				'post_content'   => '',
			),
			$uploaded['file']
		);

		if ( is_wp_error( $attachment_id ) ) {
			return new \WP_Error( 'markaroo_upload_failed', __( 'Could not save screenshot.', 'markaroo' ), array( 'status' => 500 ) );
		}

		$metadata = wp_generate_attachment_metadata( $attachment_id, $uploaded['file'] );
		wp_update_attachment_metadata( $attachment_id, $metadata );

		// Attach to feedback row.
		$repo->update(
			$feedback_id,
			array(
				'screenshot_id'   => $attachment_id,
				'screenshot_path' => $uploaded['file'],
			)
		);

		/**
		 * Fires after a screenshot is saved and linked to feedback.
		 *
		 * @param int $feedback_id   The feedback row ID.
		 * @param int $attachment_id WP media library attachment ID.
		 */
		do_action( 'markaroo/screenshot/after_capture', $feedback_id, $attachment_id );

		return rest_ensure_response(
			array(
				'screenshot_id'  => $attachment_id,
				'screenshot_url' => esc_url_raw( $uploaded['url'] ),
			)
		);
	}
}
