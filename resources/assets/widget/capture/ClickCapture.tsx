import { useRef } from '@wordpress/element';
import { buildClickCaptureData } from './captureUtils';
import type { CaptureData } from '../types';

interface ClickCaptureProps {
  onCapture: (data: CaptureData) => void;
}

export function ClickCapture({ onCapture }: ClickCaptureProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    // Ignore if clicked on an interactive Markaroo element that bubbled up.
    if ((e.target as Element).closest('.markaroo-capture-toolbar')) {
      return;
    }

    const data = buildClickCaptureData(e.clientX, e.clientY);

    window.dispatchEvent(new CustomEvent('markaroo:pin-placed', { detail: { captureData: data } }));

    onCapture(data);
  }

  return (
    <div
      ref={overlayRef}
      className="markaroo-capture-overlay markaroo-capture-overlay--click"
      onClick={handleClick}
      role="presentation"
    />
  );
}
