import { useState, useRef } from '@wordpress/element';
import { MentionAutocomplete } from './MentionAutocomplete';
import { apiPost } from '../api';
import type { ReplyItem } from '../types';

const GUEST_NAME_KEY = 'markaroo_guest_name';

interface Props {
  feedbackId: number;
  onPosted: (reply: ReplyItem) => void;
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function ReplyComposer({ feedbackId, onPosted }: Props) {
  const config = window.markarooConfig;
  const isGuest = config?.currentUser?.id === 0;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState('');
  const [guestName, setGuestName] = useState(
    () => (typeof localStorage !== 'undefined' && localStorage.getItem(GUEST_NAME_KEY)) || ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mention detection.
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionOffset, setMentionOffset] = useState(0);

  function handleTextChange(val: string) {
    setText(val);
    const ta = textareaRef.current;
    const cursor = ta?.selectionStart ?? val.length;
    const before = val.slice(0, cursor);
    const match = before.match(/@(\w*)$/);
    if (match) {
      setMentionQuery(match[1]);
      setMentionOffset(match.index!);
    } else {
      setMentionQuery(null);
    }
  }

  function insertMention(user: { id: number; name: string }) {
    const handle = `@${user.name} `;
    const before = text.slice(0, mentionOffset);
    const after = text.slice(textareaRef.current?.selectionStart ?? text.length);
    const next = before + handle + after;
    setText(next);
    setMentionQuery(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) {
      return;
    }

    if (isGuest) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(GUEST_NAME_KEY, guestName.trim());
      }
    }

    setLoading(true);
    setError(null);

    try {
      const reply = await apiPost<ReplyItem>(`feedback/${feedbackId}/replies`, {
        reply_uuid: generateUUID(),
        comment: text.trim(),
        ...(isGuest ? { author: guestName.trim() } : {}),
      });
      setText('');
      onPosted(reply);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post reply.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="markaroo-reply-composer" onSubmit={handleSubmit}>
      {isGuest && (
        <input
          className="markaroo-reply-composer__name"
          type="text"
          placeholder="Your name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          maxLength={191}
        />
      )}

      <div className="markaroo-reply-composer__input-wrap">
        <textarea
          ref={textareaRef}
          className="markaroo-reply-composer__textarea"
          rows={2}
          placeholder="Write a reply… (@mention to notify)"
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
        />
        {mentionQuery !== null && (
          <MentionAutocomplete
            query={mentionQuery}
            onSelect={insertMention}
            onClose={() => setMentionQuery(null)}
          />
        )}
      </div>

      {error && (
        <p className="markaroo-reply-composer__error" role="alert">
          {error}
        </p>
      )}

      <button
        className="markaroo-btn markaroo-btn--primary markaroo-btn--sm"
        type="submit"
        disabled={loading || !text.trim()}
      >
        {loading ? 'Posting…' : 'Reply'}
      </button>
    </form>
  );
}
