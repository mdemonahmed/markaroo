import { useEffect } from '@wordpress/element';
import { useWidget, useWidgetDispatch } from './store/WidgetContext';
import type { WidgetMode } from './types';

interface ModeManagerProps {
  children: React.ReactNode;
}

export function ModeManager( { children }: ModeManagerProps ) {
  const { mode } = useWidget();
  const dispatch = useWidgetDispatch();

  useEffect( () => {
    window.dispatchEvent( new CustomEvent( 'markaroo:mode-changed', { detail: { mode } } ) );
  }, [ mode ] );

  return <>{ children }</>;
}

export function useSetMode() {
  const dispatch = useWidgetDispatch();

  return ( mode: WidgetMode ) => {
    dispatch( { type: 'SET_MODE', mode } );
  };
}
