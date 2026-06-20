import { render } from '@wordpress/element';
import { WidgetRoot } from '../../widget/WidgetRoot';

const root = document.getElementById( 'markaroo-root' );

if ( root ) {
	render( <WidgetRoot />, root );
}
