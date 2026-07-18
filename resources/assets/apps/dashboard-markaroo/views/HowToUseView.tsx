import { __ } from '@wordpress/i18n';

interface Section {
  title: string;
  steps: string[];
}

function sections(): Section[] {
  return [
    {
      title: __( '1. Getting started', 'markaroo' ),
      steps: [
        __(
          'Go to Settings and make sure "Allow feedback" is turned on. Choose whether the feedback button shows on the whole site or only on certain pages.',
          'markaroo'
        ),
        __(
          'Open your website. You will see a small "Feedback" button in the corner of the page.',
          'markaroo'
        ),
      ],
    },
    {
      title: __( '2. Leaving feedback (pins)', 'markaroo' ),
      steps: [
        __(
          'Click the Feedback button, then click "Pins" to start a feedback session.',
          'markaroo'
        ),
        __(
          'Click anywhere on the page to drop a pin, or click and drag to select an area.',
          'markaroo'
        ),
        __(
          'Give your feedback a short title. You can also write a longer comment, set a priority, and attach files or a screenshot.',
          'markaroo'
        ),
        __( 'Press the check button to save. Your pin now shows on the page.', 'markaroo' ),
      ],
    },
    {
      title: __( '3. Replies and mentions', 'markaroo' ),
      steps: [
        __( 'Click any pin to open it and read the conversation.', 'markaroo' ),
        __( 'Write a reply at the bottom and press Enter to send it.', 'markaroo' ),
        __(
          'Type @ in a comment to mention a teammate. Mentioned people can get an email notification.',
          'markaroo'
        ),
      ],
    },
    {
      title: __( '4. Working with tasks', 'markaroo' ),
      steps: [
        __(
          'Every piece of feedback is also a task. In this dashboard, open "All Feedback" to see them all in one list.',
          'markaroo'
        ),
        __(
          'Click any row to see the full details — screenshot, files, replies — and to change status, priority, or assignee.',
          'markaroo'
        ),
        __(
          'Use the "Board" page to move tasks between Open, In progress, Resolved, and Approved by dragging cards.',
          'markaroo'
        ),
        __(
          'When work is done, mark the feedback "Resolved". An approver can then sign it off on the "Approvals" page.',
          'markaroo'
        ),
      ],
    },
    {
      title: __( '5. Inviting clients (share links)', 'markaroo' ),
      steps: [
        __(
          'Your clients do not need a WordPress account. In Settings, find the "Guest Feedback Link" and copy it.',
          'markaroo'
        ),
        __(
          'Send the link to your client. When they open it, they can view pins and leave their own feedback.',
          'markaroo'
        ),
        __(
          'If the link ever leaks, click "Regenerate" to make a new one — the old link stops working right away.',
          'markaroo'
        ),
      ],
    },
    {
      title: __( '6. Email notifications', 'markaroo' ),
      steps: [
        __(
          'Open the "Email Notification" page to control emails. Digest mode sends a short summary every 15, 30, or 60 minutes instead of one email per event.',
          'markaroo'
        ),
        __(
          'Smart mode also sends instant emails for important things: when someone is assigned or mentioned.',
          'markaroo'
        ),
        __( 'Use "Send test email" to check that email delivery works on your site.', 'markaroo' ),
      ],
    },
  ];
}

export function HowToUseView() {
  return (
    <div className="markaroo-admin-howto">
      <h2 className="markaroo-admin__section-title">{ __( 'How to Use Markaroo', 'markaroo' ) }</h2>
      <p className="markaroo-getstarted__sub">
        { __(
          'Markaroo lets your clients and team click on any page and leave feedback exactly where the problem is. Every comment becomes a task you can track here.',
          'markaroo'
        ) }
      </p>

      { sections().map( ( s ) => (
        <div key={ s.title } className="markaroo-howto-section">
          <h3 className="markaroo-howto-section__title">{ s.title }</h3>
          <ol className="markaroo-howto-section__steps">
            { s.steps.map( ( step, i ) => (
              <li key={ i }>{ step }</li>
            ) ) }
          </ol>
        </div>
      ) ) }

      <div className="markaroo-howto-section markaroo-howto-section--footer">
        <p>
          { __( 'Still stuck? We are happy to help —', 'markaroo' ) }{ ' ' }
          <a href="#plugin-feedback">{ __( 'send us a message', 'markaroo' ) }</a>.
        </p>
      </div>
    </div>
  );
}
