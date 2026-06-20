import { createRoot } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const DashboardMarkarooApp = () => {
  return (
    <section>
      <h2>{__('DashboardMarkaroo App', 'markaroo')}</h2>
      <p>
        {__(
          'Scaffolded by php bones make:app. Replace this with your component.',
          'markaroo'
        )}
      </p>
    </section>
  );
};

const container = document.getElementById('dashboard-markaroo-root');
if (container) {
  createRoot(container).render(<DashboardMarkarooApp />);
}
