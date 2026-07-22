<?php
/**
 * Reusable HTML email wrapper for all Markaroo notifications.
 *
 * The per-event body HTML is rendered into $content; this shell frames it with
 * a branded header + footer. Table-based, inline CSS — email clients strip
 * <style>/external CSS.
 *
 * @var string $subject   Subject / hidden preheader fallback.
 * @var string $preheader Inbox preview text (optional).
 * @var string $content   Inner body HTML (escaped by the caller).
 * @var string $site_name Header/footer brand context.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Prefixed locals: read the caller-supplied template vars with standalone
// fallbacks. Prefixing keeps PrefixAllGlobals happy for this included file.
$markaroo_subject   = $subject ?? '';
$markaroo_preheader = $preheader ?? $markaroo_subject;
$markaroo_content   = $content ?? '';
$markaroo_site_name = $site_name ?? get_bloginfo( 'name' );
?>
<!DOCTYPE html>
<html lang="<?php echo esc_attr( get_bloginfo( 'language' ) ); ?>" xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<title><?php echo esc_html( $markaroo_subject ); ?></title>
</head>
<body style="margin:0; padding:0; background-color:#f3f4f6; -webkit-font-smoothing:antialiased; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
	<div style="display:none; max-height:0; overflow:hidden; opacity:0;"><?php echo esc_html( $markaroo_preheader ); ?></div>
	<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6; padding:24px 0;">
		<tr><td align="center">
			<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.08);">
				<tr><td style="background-color:#5b4fcf; padding:26px 40px;">
					<span style="color:#ffffff; font-size:22px; font-weight:800; letter-spacing:-0.02em;">Markaroo</span>
					<span style="display:block; margin-top:2px; color:rgba(255,255,255,0.75); font-size:13px; font-weight:500;"><?php echo esc_html( $markaroo_site_name ); ?></span>
				</td></tr>
				<tr><td style="padding:36px 40px; color:#374151; font-size:16px; line-height:1.6;">
					<?php echo $markaroo_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Caller (Mailer) escapes every value before wrapping. ?>
				</td></tr>
				<tr><td style="padding:24px 40px 32px; border-top:1px solid #e5e7eb; color:#9ca3af; font-size:13px; line-height:1.5;">
					<?php
					printf(
						/* translators: %s: site name */
						esc_html__( 'This is an automated message from %s. Please do not reply to this email.', 'markaroo' ),
						'<strong style="color:#6b7280;">' . esc_html( $markaroo_site_name ) . '</strong>'
					);
					?>
					<br />
					<?php
					printf(
						/* translators: 1: year, 2: site name */
						esc_html__( '© %1$s %2$s. Sent by Markaroo.', 'markaroo' ),
						esc_html( gmdate( 'Y' ) ),
						esc_html( $markaroo_site_name )
					);
					?>
				</td></tr>
			</table>
		</td></tr>
	</table>
</body>
</html>
