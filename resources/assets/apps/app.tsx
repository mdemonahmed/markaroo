import { createRoot } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const App = () => {
  const greeting = `${ __( 'WP Bones', 'markaroo' ) } — Hello!`;

  return (
    <section>
      <h2>{ greeting }</h2>
      <p>
        { __(
          'This React bundle ships with TypeScript and WordPress i18n, auto-discovered by webpack.',
          'markaroo'
        ) }
      </p>
    </section>
  );
};

const container = document.getElementById( 'react-app' );
if ( container ) {
  createRoot( container ).render( <App /> );
}
