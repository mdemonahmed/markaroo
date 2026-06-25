import { createRoot } from '@wordpress/element';
import { AdminShell }  from './AdminShell';

const container = document.getElementById( 'dashboard-markaroo-root' );
if ( container ) {
	createRoot( container ).render( <AdminShell /> );
}
