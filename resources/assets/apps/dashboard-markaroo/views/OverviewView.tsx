import { useState, useEffect } from '@wordpress/element';

interface Counts {
	open:             number;
	resolved:         number;
	overdue:          number;
	unassigned:       number;
	total:            number;
	today:            number;
	resolution_rate:  number;
	by_priority?:     Record< string, number >;
	by_page?:         Array< { page_key: string; count: number } >;
}

function StatCard( { label, value, accent }: { label: string; value: number; accent?: string } ) {
	return (
		<div className="markaroo-stat-card">
			<span className="markaroo-stat-card__value" style={ accent ? { color: accent } : undefined }>{ value }</span>
			<span className="markaroo-stat-card__label">{ label }</span>
		</div>
	);
}

export function OverviewView() {
	const config   = window.markarooConfig;
	const restBase = config.restUrl + 'markaroo/v1/';

	const [ counts, setCounts ]   = useState< Counts | null >( null );
	const [ loading, setLoading ] = useState( true );
	const [ error,   setError   ] = useState< string | null >( null );

	useEffect( () => {
		fetch( restBase + 'counts', { headers: { 'X-WP-Nonce': config.nonce } } )
			.then( ( r ) => r.ok ? r.json() as Promise< Counts > : Promise.reject( r.status ) )
			.then( setCounts )
			.catch( () => setError( 'Could not load counts.' ) )
			.finally( () => setLoading( false ) );
	}, [] ); // eslint-disable-line react-hooks/exhaustive-deps

	if ( loading ) return <p className="markaroo-admin__loading">Loading…</p>;
	if ( error )   return <p className="markaroo-admin__error">{ error }</p>;

	return (
		<div className="markaroo-admin-overview">
			<h2 className="markaroo-admin__section-title">Overview</h2>

			<div className="markaroo-stat-grid">
				<StatCard label="Total"       value={ counts?.total      ?? 0 } />
				<StatCard label="Open"        value={ counts?.open       ?? 0 } accent="#6366f1" />
				<StatCard label="Resolved"    value={ counts?.resolved   ?? 0 } accent="#22c55e" />
				<StatCard label="Today"       value={ counts?.today      ?? 0 } />
				<StatCard label="Overdue"     value={ counts?.overdue    ?? 0 } accent="#ef4444" />
				<StatCard label="Unassigned"  value={ counts?.unassigned ?? 0 } />
			</div>

			{ ( counts?.resolution_rate ?? 0 ) > 0 && (
				<p className="markaroo-admin-rate">
					Resolution rate: <strong>{ counts!.resolution_rate }%</strong>
				</p>
			) }

			{ counts?.by_priority && (
				<>
					<h3 className="markaroo-admin__sub-title">By Priority</h3>
					<div className="markaroo-stat-grid">
						{ Object.entries( counts.by_priority ).map( ( [ k, v ] ) => (
							<StatCard key={ k } label={ k.charAt( 0 ).toUpperCase() + k.slice( 1 ) } value={ v } />
						) ) }
					</div>
				</>
			) }

			{ counts?.by_page && counts.by_page.length > 0 && (
				<>
					<h3 className="markaroo-admin__sub-title">Top Pages</h3>
					<table className="markaroo-admin-table">
						<thead>
							<tr>
								<th>Page</th>
								<th>Feedback count</th>
							</tr>
						</thead>
						<tbody>
							{ counts.by_page.slice( 0, 10 ).map( ( row ) => (
								<tr key={ row.page_key }>
									<td><code>{ row.page_key }</code></td>
									<td>{ row.count }</td>
								</tr>
							) ) }
						</tbody>
					</table>
				</>
			) }
		</div>
	);
}
