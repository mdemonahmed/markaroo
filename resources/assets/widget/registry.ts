/**
 * window.markaroo — JS extension registry for the third-party code.
 *
 * Usage:
 *
 *   window.markaroo.registerComposerField({
 *     id: 'sprint', label: 'Sprint', render: (props) => <SprintField {...props} />,
 *   });
 *
 *   window.markaroo.registerAnnotationTool({
 *     id: 'blur', icon: '...',
 *     draw: (ctx, from, to) => { ... },
 *   });
 *
 *   window.markaroo.registerAdminTab({
 *     id: 'reports', label: 'Reports', render: () => <ReportsView />,
 *   });
 *
 *   window.markaroo.registerPinRenderer({
 *     id: 'custom', render: (feedback) => <CustomPin feedback={feedback} />,
 *   });
 */

export interface ComposerFieldDef {
  id: string;
  label: string;
  render: ( props: Record< string, unknown > ) => unknown;
}

export interface AnnotationToolDef {
  id: string;
  icon: string;
  label: string;
  draw: (
    ctx: CanvasRenderingContext2D,
    from: { x: number; y: number },
    to: { x: number; y: number }
  ) => void;
}

export interface AdminTabDef {
  id: string;
  label: string;
  render: () => unknown;
}

export interface PinRendererDef {
  id: string;
  render: ( feedback: Record< string, unknown > ) => unknown;
}

export interface MarkarooRegistry {
  version: string;
  composerFields: ComposerFieldDef[];
  annotationTools: AnnotationToolDef[];
  adminTabs: AdminTabDef[];
  pinRenderers: PinRendererDef[];
  registerComposerField: ( def: ComposerFieldDef ) => void;
  registerAnnotationTool: ( def: AnnotationToolDef ) => void;
  registerAdminTab: ( def: AdminTabDef ) => void;
  registerPinRenderer: ( def: PinRendererDef ) => void;
}

export function initRegistry(): void {
  if ( ( window as unknown as Record< string, unknown > ).markaroo ) {
    return;
  }

  const registry: MarkarooRegistry = {
    version: '1.0.0',
    composerFields: [],
    annotationTools: [],
    adminTabs: [],
    pinRenderers: [],

    registerComposerField( def ) {
      if ( ! registry.composerFields.find( ( f ) => f.id === def.id ) ) {
        registry.composerFields.push( def );
      }
    },

    registerAnnotationTool( def ) {
      if ( ! registry.annotationTools.find( ( t ) => t.id === def.id ) ) {
        registry.annotationTools.push( def );
      }
    },

    registerAdminTab( def ) {
      if ( ! registry.adminTabs.find( ( t ) => t.id === def.id ) ) {
        registry.adminTabs.push( def );
      }
    },

    registerPinRenderer( def ) {
      if ( ! registry.pinRenderers.find( ( r ) => r.id === def.id ) ) {
        registry.pinRenderers.push( def );
      }
    },
  };

  ( window as unknown as Record< string, unknown > ).markaroo = registry;
}
