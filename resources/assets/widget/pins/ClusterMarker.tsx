import { memo } from '@wordpress/element';

interface Props {
  clusterKey: string;
  count: number;
  left: number;
  top: number;
  dimmed: boolean;
  onExpand: ( key: string ) => void;
}

/**
 * A single marker standing in for a group of nearby pins. Clicking it expands
 * the cluster to its member pins. Memoized so unrelated pin changes don't
 * re-render every cluster.
 */
export const ClusterMarker = memo( function ClusterMarker( {
  clusterKey,
  count,
  left,
  top,
  dimmed,
  onExpand,
}: Props ) {
  return (
    <button
      type="button"
      className={ `markaroo-pin markaroo-pin--cluster${ dimmed ? ' markaroo-pin--dimmed' : '' }` }
      style={ { left: `${ left }px`, top: `${ top }px` } }
      onClick={ () => onExpand( clusterKey ) }
      aria-label={ `${ count } feedback pins — click to expand` }
    >
      <span className="markaroo-pin__badge">{ count }</span>
    </button>
  );
} );
