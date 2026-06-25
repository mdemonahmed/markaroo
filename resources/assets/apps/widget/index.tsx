import { render } from '@wordpress/element';
import { initRegistry } from '../../widget/registry';
import { WidgetRoot } from '../../widget/WidgetRoot';

// Initialize window.markaroo extension registry before mounting.
initRegistry();

const root = document.getElementById('markaroo-root');

if (root) {
  render(<WidgetRoot />, root);
}
