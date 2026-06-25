import { createRoot } from '@wordpress/element';
import { WelcomeApp } from './WelcomeApp';

const container = document.getElementById('markaroo-welcome-root');
if (container) {
  createRoot(container).render(<WelcomeApp />);
}
