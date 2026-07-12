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

		if ( (int) ( $file['size'] ?? 0 ) > self::max_bytes() ) {
			return self::too_large_error();
		}

		self::load_media_includes();

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

		$result = self::attach_file_to_feedback( $feedback_id, $uploaded['file'], $uploaded['type'], $uploaded['url'] );

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return rest_ensure_response( $result );
	}

	/**
	 * Store a base64 data URL screenshot and link it to a feedback row.
	 *
	 * Used by FeedbackController::create() so the cropped "Pinned content" image
	 * is saved in the same request the feedback is created in (no second round-trip).
	 *
	 * @param int    $feedback_id Feedback row ID.
	 * @param string $data_url    A `data:image/(jpeg|png);base64,...` string.
	 * @return array{screenshot_id:int,screenshot_url:string}|\WP_Error
	 */
	public static function store_data_url( int $feedback_id, string $data_url ) {
		if ( ! preg_match( '#^data:(image/(?:jpeg|png));base64,#', $data_url, $m ) ) {
			return new \WP_Error( 'markaroo_invalid', __( 'Screenshot must be a JPEG or PNG data URL.', 'markaroo' ), array( 'status' => 400 ) );
		}

		$mime    = $m[1];
		$encoded = substr( $data_url, strlen( $m[0] ) );

		// Reject oversized payloads BEFORE decoding: base64 is ~4/3 of the
		// binary size, so this bounds the memory the decode below can allocate.
		if ( strlen( $encoded ) * 0.75 > self::max_bytes() ) {
			return self::too_large_error();
		}

		$binary = base64_decode( $encoded, true ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_decode -- decoding our own client-generated screenshot.

		if ( false === $binary || '' === $binary ) {
			return new \WP_Error( 'markaroo_invalid', __( 'Could not decode screenshot.', 'markaroo' ), array( 'status' => 400 ) );
		}

		self::load_media_includes();

		$ext      = 'image/png' === $mime ? 'png' : 'jpg';
		$filename = sprintf( 'markaroo-%d-%s.%s', $feedback_id, wp_generate_password( 8, false ), $ext );

		/** @see upload() — same hook so Pro can intercept both paths. */
		do_action( 'markaroo/screenshot/before_capture', $feedback_id, array( 'name' => $filename, 'type' => $mime ) );

		$upload = wp_upload_bits( $filename, null, $binary );

		if ( ! empty( $upload['error'] ) ) {
			return new \WP_Error( 'markaroo_upload_failed', esc_html( $upload['error'] ), array( 'status' => 500 ) );
		}

		return self::attach_file_to_feedback( $feedback_id, $upload['file'], $mime, $upload['url'] );
	}

	/**
	 * Insert an uploaded file into the media library and link it to the feedback row.
	 *
	 * @param int    $feedback_id Feedback row ID.
	 * @param string $file_path   Absolute path to the uploaded file.
	 * @param string $mime        File MIME type.
	 * @param string $url         Public URL of the uploaded file.
	 * @return array{screenshot_id:int,screenshot_url:string}|\WP_Error
	 */
	private static function attach_file_to_feedback( int $feedback_id, string $file_path, string $mime, string $url ) {
		$attachment_id = wp_insert_attachment(
			array(
				'post_title'     => sprintf(
					/* translators: %d = feedback item ID */
					__( 'Markaroo Screenshot #%d', 'markaroo' ),
					$feedback_id
				),
				'post_mime_type' => $mime,
				'post_status'    => 'inherit',
				'post_content'   => '',
			),
			$file_path
		);

		if ( is_wp_error( $attachment_id ) ) {
			return new \WP_Error( 'markaroo_upload_failed', __( 'Could not save screenshot.', 'markaroo' ), array( 'status' => 500 ) );
		}

		$metadata = wp_generate_attachment_metadata( $attachment_id, $file_path );
		wp_update_attachment_metadata( $attachment_id, $metadata );

		// Tag the attachment so uninstall cleanup can find Markaroo uploads.
		update_post_meta( $attachment_id, '_markaroo_attachment', 1 );

		// Attach to feedback row.
		( new FeedbackRepository() )->update(
			$feedback_id,
			array(
				'screenshot_id'   => $attachment_id,
				'screenshot_path' => $file_path,
			)
		);

		/**
		 * Fires after a screenshot is saved and linked to feedback.
		 *
		 * @param int $feedback_id   The feedback row ID.
		 * @param int $attachment_id WP media library attachment ID.
		 */
		do_action( 'markaroo/screenshot/after_capture', $feedback_id, $attachment_id );

		return array(
			'screenshot_id'  => $attachment_id,
			'screenshot_url' => esc_url_raw( $url ),
		);
	}

	/**
	 * Maximum accepted screenshot size in bytes (applies to both the multipart
	 * upload and the base64 data-URL path).
	 */
	private static function max_bytes(): int {
		/**
		 * Filters the maximum accepted screenshot size in bytes.
		 *
		 * @param int $max_bytes Default 8 MB.
		 */
		return (int) apply_filters( 'markaroo/screenshot/max_bytes', 8 * MB_IN_BYTES );
	}

	private static function too_large_error(): \WP_Error {
		return new \WP_Error(
			'markaroo_too_large',
			__( 'Screenshot exceeds the maximum allowed size.', 'markaroo' ),
			array( 'status' => 413 )
		);
	}

	private static function load_media_includes(): void {
		require_once ABSPATH . 'wp-admin/includes/image.php';
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/media.php';
	}
}
