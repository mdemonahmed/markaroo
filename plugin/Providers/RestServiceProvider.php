<?php

namespace Markaroo\Providers;

use Markaroo\Http\Auth;
use Markaroo\Http\Controllers\AttachmentsController;
use Markaroo\Http\Controllers\CountsController;
use Markaroo\Http\Controllers\FeedbackController;
use Markaroo\Http\Controllers\OnboardingController;
use Markaroo\Http\Controllers\ReplyController;
use Markaroo\Http\Controllers\ScreenshotController;
use Markaroo\Http\Controllers\SettingsController;
use Markaroo\Http\Controllers\ShareController;
use Markaroo\Http\Controllers\UsersController;
use Markaroo\WPBones\Support\ServiceProvider;

defined( 'ABSPATH' ) || exit;

class RestServiceProvider extends ServiceProvider {

	const NAMESPACE = 'markaroo/v1';

	public function register() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	public function register_routes(): void {
		$ns = self::NAMESPACE;

		// ------------------------------------------------------------------
		// Feedback list + create
		// ------------------------------------------------------------------
		register_rest_route(
			$ns,
			'/feedback',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( FeedbackController::class, 'index' ),
					'permission_callback' => fn( $r ) => Auth::can_view( $r ),
					'args'                => array(
						'page_key'    => array( 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ),
						'status'      => array( 'type' => 'string', 'enum' => array( 'open', 'resolved' ) ),
						'priority'    => array( 'type' => 'string', 'enum' => array( 'urgent', 'high', 'normal', 'low' ) ),
						'assigned_to' => array( 'type' => 'integer', 'minimum' => 0 ),
						'tag'         => array( 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ),
						'search'      => array( 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ),
						'order_by'    => array( 'type' => 'string', 'default' => 'created_at' ),
						'order'       => array( 'type' => 'string', 'enum' => array( 'ASC', 'DESC' ), 'default' => 'DESC' ),
						'per_page'    => array( 'type' => 'integer', 'default' => 20, 'minimum' => 1, 'maximum' => 100 ),
						'page'        => array( 'type' => 'integer', 'default' => 1, 'minimum' => 1 ),
					),
				),
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => array( FeedbackController::class, 'create' ),
					'permission_callback' => fn( $r ) => Auth::can_comment( $r ),
					'args'                => array(
						'page_key' => array( 'type' => 'string', 'required' => true, 'sanitize_callback' => 'sanitize_text_field' ),
						'page_url' => array( 'type' => 'string', 'required' => true ),
						'comment'  => array( 'type' => 'string', 'required' => true ),
						'x'        => array( 'type' => 'number', 'default' => 0 ),
						'y'        => array( 'type' => 'number', 'default' => 0 ),
					),
				),
			)
		);

		// ------------------------------------------------------------------
		// Feedback single: show / update / delete
		// ------------------------------------------------------------------
		register_rest_route(
			$ns,
			'/feedback/(?P<id>\d+)',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( FeedbackController::class, 'show' ),
					'permission_callback' => fn( $r ) => Auth::can_view( $r ),
				),
				array(
					'methods'             => 'PATCH',
					'callback'            => array( FeedbackController::class, 'update' ),
					'permission_callback' => fn( $r ) => Auth::can_comment( $r ),
				),
				array(
					'methods'             => \WP_REST_Server::DELETABLE,
					'callback'            => array( FeedbackController::class, 'destroy' ),
					'permission_callback' => fn( $r ) => Auth::can_comment( $r ),
				),
			)
		);

		// ------------------------------------------------------------------
		// Resolve / Unresolve
		// ------------------------------------------------------------------
		register_rest_route(
			$ns,
			'/feedback/(?P<id>\d+)/resolve',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( FeedbackController::class, 'resolve' ),
				'permission_callback' => fn( $r ) => Auth::can_manage( $r ),
			)
		);

		register_rest_route(
			$ns,
			'/feedback/(?P<id>\d+)/unresolve',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( FeedbackController::class, 'unresolve' ),
				'permission_callback' => fn( $r ) => Auth::can_manage( $r ),
			)
		);

		// ------------------------------------------------------------------
		// Screenshot upload
		// ------------------------------------------------------------------
		register_rest_route(
			$ns,
			'/feedback/(?P<id>\d+)/screenshot',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( ScreenshotController::class, 'upload' ),
				'permission_callback' => fn( $r ) => Auth::can_comment( $r ),
			)
		);

		// ------------------------------------------------------------------
		// Replies under feedback
		// ------------------------------------------------------------------
		register_rest_route(
			$ns,
			'/feedback/(?P<id>\d+)/replies',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( FeedbackController::class, 'add_reply' ),
				'permission_callback' => fn( $r ) => Auth::can_comment( $r ),
				'args'                => array(
					'comment' => array( 'type' => 'string', 'required' => true ),
				),
			)
		);

		// ------------------------------------------------------------------
		// Replies standalone: update / delete
		// ------------------------------------------------------------------
		register_rest_route(
			$ns,
			'/replies/(?P<id>\d+)',
			array(
				array(
					'methods'             => 'PATCH',
					'callback'            => array( ReplyController::class, 'update' ),
					'permission_callback' => fn( $r ) => Auth::can_comment( $r ),
					'args'                => array(
						'comment' => array( 'type' => 'string', 'required' => true ),
					),
				),
				array(
					'methods'             => \WP_REST_Server::DELETABLE,
					'callback'            => array( ReplyController::class, 'destroy' ),
					'permission_callback' => fn( $r ) => Auth::can_comment( $r ),
				),
			)
		);

		// ------------------------------------------------------------------
		// Users (assignable list + mention search)
		// ------------------------------------------------------------------
		register_rest_route(
			$ns,
			'/users',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( UsersController::class, 'index' ),
				'permission_callback' => fn( $r ) => Auth::can_manage( $r ),
				'args'                => array(
					'search' => array( 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ),
				),
			)
		);

		// ------------------------------------------------------------------
		// Counts
		// ------------------------------------------------------------------
		register_rest_route(
			$ns,
			'/counts',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( CountsController::class, 'index' ),
				'permission_callback' => fn( $r ) => Auth::can_manage( $r ),
				'args'                => array(
					'page_key' => array( 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ),
				),
			)
		);

		// ------------------------------------------------------------------
		// Settings
		// ------------------------------------------------------------------
		register_rest_route(
			$ns,
			'/settings',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( SettingsController::class, 'show' ),
					'permission_callback' => fn( $r ) => Auth::can_manage( $r ),
				),
				array(
					'methods'             => 'PATCH',
					'callback'            => array( SettingsController::class, 'update' ),
					'permission_callback' => fn( $r ) => Auth::can_manage( $r ),
				),
			)
		);

		// ------------------------------------------------------------------
		// Share links (stubs — full implementation Task 06)
		// ------------------------------------------------------------------
		register_rest_route(
			$ns,
			'/shares',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( ShareController::class, 'index' ),
					'permission_callback' => fn( $r ) => Auth::can_manage( $r ),
				),
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => array( ShareController::class, 'create' ),
					'permission_callback' => fn( $r ) => Auth::can_manage( $r ),
				),
			)
		);

		register_rest_route(
			$ns,
			'/shares/(?P<id>\d+)',
			array(
				'methods'             => \WP_REST_Server::DELETABLE,
				'callback'            => array( ShareController::class, 'destroy' ),
				'permission_callback' => fn( $r ) => Auth::can_manage( $r ),
			)
		);

		// ------------------------------------------------------------------
		// Attachments (stub — full implementation Task 15)
		// ------------------------------------------------------------------
		register_rest_route(
			$ns,
			'/attachments',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( AttachmentsController::class, 'create' ),
				'permission_callback' => fn( $r ) => Auth::can_comment( $r ),
			)
		);

		// ------------------------------------------------------------------
		// Onboarding (Task 25) — admin-only first-run setup.
		// ------------------------------------------------------------------
		$can_onboard = static fn() => current_user_can( 'manage_options' );

		register_rest_route(
			$ns,
			'/onboarding/complete',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( OnboardingController::class, 'complete' ),
				'permission_callback' => $can_onboard,
			)
		);

		register_rest_route(
			$ns,
			'/onboarding/step',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( OnboardingController::class, 'step' ),
				'permission_callback' => $can_onboard,
			)
		);

		register_rest_route(
			$ns,
			'/onboarding/state',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( OnboardingController::class, 'state' ),
				'permission_callback' => $can_onboard,
			)
		);
	}
}
