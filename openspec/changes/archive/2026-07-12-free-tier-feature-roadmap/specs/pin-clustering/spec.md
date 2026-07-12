## ADDED Requirements

### Requirement: Proximity clustering above threshold
When a page shows more than ~30 pins, the widget SHALL cluster pins client-side by proximity and render one cluster marker per group, reducing DOM node count, and SHALL leave individual pins unclustered below the threshold.

#### Scenario: Above threshold clusters
- **WHEN** 45 pins are present on a page
- **THEN** nearby pins are grouped and rendered as cluster markers rather than 45 individual markers

#### Scenario: Below threshold unchanged
- **WHEN** 12 pins are present
- **THEN** each pin renders individually with no clustering

### Requirement: Expand on click
A cluster marker SHALL expand to reveal its member pins when clicked.

#### Scenario: Expand cluster
- **WHEN** the user clicks a cluster marker
- **THEN** the member pins in that group become individually visible/selectable

### Requirement: Preserve memoized rendering
Clustering SHALL preserve the existing `React.memo` per-marker optimization and stable callbacks so grouped rendering does not reintroduce per-pin re-render churn.

#### Scenario: No re-render regression
- **WHEN** clustering is active and one pin's data changes
- **THEN** only the affected cluster/marker re-renders, not all markers
