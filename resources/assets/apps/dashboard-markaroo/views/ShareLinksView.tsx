import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Link2, Copy, Check, Pencil, Trash2, Plus, Globe, FileText } from 'lucide-react';
import { timeAgo } from '../../../widget/support/timeAgo';

/**
 * Guest share links management: list, create, edit, copy, and revoke links.
 * Every per-link option the schema supports is exposed here — label, scope
 * (site / single page), view/comment permissions, widget mode, and expiry.
 */

interface ShareLink {
  id: number;
  label: string;
  token: string;
  share_url: string;
  scope: 'site' | 'page';
  page_key: string | null;
  can_view: boolean;
  can_comment: boolean;
  widget_mode: 'comment' | 'view' | 'clean';
  expires_at: string | null;
  is_expired: boolean;
  created_at: string;
}

interface SharesResponse {
  enabled: boolean;
  items: ShareLink[];
}

interface PageOption {
  key: string;
  title: string;
}

interface FormState {
  label: string;
  scope: 'site' | 'page';
  page_key: string;
  can_view: boolean;
  can_comment: boolean;
  widget_mode: 'comment' | 'view' | 'clean';
  expires_at: string; // datetime-local value or ''
}

const EMPTY_FORM: FormState = {
  label: '',
  scope: 'site',
  page_key: '',
  can_view: true,
  can_comment: true,
  widget_mode: 'comment',
  expires_at: '',
};

function toDatetimeLocal( mysql: string | null ): string {
  if ( ! mysql ) {
    return '';
  }
  // "YYYY-MM-DD HH:MM:SS" (UTC) → "YYYY-MM-DDTHH:MM" for datetime-local.
  return mysql.replace( ' ', 'T' ).slice( 0, 16 );
}

export function ShareLinksView() {
  const config = window.markarooConfig;
  const restBase = config.restUrl + 'markaroo/v1/';
  const headers = { 'Content-Type': 'application/json', 'X-WP-Nonce': config.nonce };

  const [ links, setLinks ] = useState< ShareLink[] >( [] );
  const [ enabled, setEnabled ] = useState( true );
  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState< string | null >( null );
  const [ copiedId, setCopiedId ] = useState< number | null >( null );

  // null = closed, 0 = creating, >0 = editing that link id.
  const [ formFor, setFormFor ] = useState< number | null >( null );
  const [ form, setForm ] = useState< FormState >( EMPTY_FORM );
  const [ saving, setSaving ] = useState( false );

  const [ pages, setPages ] = useState< PageOption[] >( [] );
  const [ pagesLoaded, setPagesLoaded ] = useState( false );

  useEffect( () => {
    fetch( restBase + 'shares', { headers: { 'X-WP-Nonce': config.nonce } } )
      .then( ( r ) => ( r.ok ? ( r.json() as Promise< SharesResponse > ) : Promise.reject( r.status ) ) )
      .then( ( data ) => {
        setLinks( data.items );
        setEnabled( data.enabled );
      } )
      .catch( () => setError( __( 'Could not load share links.', 'markaroo' ) ) )
      .finally( () => setLoading( false ) );
  }, [] ); // eslint-disable-line react-hooks/exhaustive-deps

  // Published pages + posts for the page-scope picker; page_key is the URL path.
  useEffect( () => {
    if ( null === formFor || 'page' !== form.scope || pagesLoaded ) {
      return;
    }
    setPagesLoaded( true );

    const fields = 'per_page=100&status=publish&_fields=id,title,link';
    const opts = { headers: { 'X-WP-Nonce': config.nonce } };

    Promise.all( [
      fetch( `${ config.restUrl }wp/v2/pages?${ fields }`, opts ).then( ( r ) => ( r.ok ? r.json() : [] ) ),
      fetch( `${ config.restUrl }wp/v2/posts?${ fields }`, opts ).then( ( r ) => ( r.ok ? r.json() : [] ) ),
    ] )
      .then( ( [ wpPages, wpPosts ] ) => {
        const toOption = ( p: { link?: string; title?: { rendered?: string } } ): PageOption => {
          let key = '/';
          try {
            key = new URL( p.link ?? '/' ).pathname.replace( /\/+$/, '' ) || '/';
          } catch {
            // keep '/'
          }
          return { key, title: p.title?.rendered || key };
        };
        const all = [ ...wpPages, ...wpPosts ].map( toOption );
        all.sort( ( a, b ) => a.title.localeCompare( b.title ) );
        setPages( all );
      } )
      .catch( () => null );
  }, [ formFor, form.scope, pagesLoaded ] ); // eslint-disable-line react-hooks/exhaustive-deps

  function openCreate() {
    setForm( EMPTY_FORM );
    setFormFor( 0 );
  }

  function openEdit( link: ShareLink ) {
    setForm( {
      label: link.label,
      scope: link.scope,
      page_key: link.page_key ?? '',
      can_view: link.can_view,
      can_comment: link.can_comment,
      widget_mode: link.widget_mode,
      expires_at: toDatetimeLocal( link.expires_at ),
    } );
    setFormFor( link.id );
  }

  async function submitForm( e: React.FormEvent ) {
    e.preventDefault();
    setSaving( true );
    setError( null );

    const body = JSON.stringify( {
      label: form.label,
      scope: form.scope,
      page_key: 'page' === form.scope ? form.page_key : '',
      can_view: form.can_view,
      can_comment: form.can_comment,
      widget_mode: form.widget_mode,
      expires_at: form.expires_at ? form.expires_at.replace( 'T', ' ' ) + ':00' : '',
    } );

    try {
      const creating = 0 === formFor;
      const res = await fetch( restBase + ( creating ? 'shares' : `shares/${ formFor }` ), {
        method: creating ? 'POST' : 'PUT',
        headers,
        body,
      } );
      if ( ! res.ok ) {
        const detail = ( await res.json().catch( () => null ) ) as { message?: string } | null;
        throw new Error( detail?.message || __( 'Save failed.', 'markaroo' ) );
      }
      const saved = ( await res.json() ) as ShareLink;
      setLinks( ( prev ) =>
        creating ? [ saved, ...prev ] : prev.map( ( l ) => ( l.id === saved.id ? saved : l ) )
      );
      setFormFor( null );
    } catch ( err ) {
      setError( err instanceof Error ? err.message : __( 'Save failed.', 'markaroo' ) );
    } finally {
      setSaving( false );
    }
  }

  async function revoke( link: ShareLink ) {
    // eslint-disable-next-line no-alert
    if ( ! window.confirm( __( 'Revoke this link? It will stop working immediately.', 'markaroo' ) ) ) {
      return;
    }
    setError( null );
    try {
      const res = await fetch( restBase + `shares/${ link.id }`, { method: 'DELETE', headers } );
      if ( ! res.ok ) {
        throw new Error( __( 'Could not revoke the link.', 'markaroo' ) );
      }
      setLinks( ( prev ) => prev.filter( ( l ) => l.id !== link.id ) );
    } catch ( err ) {
      setError( err instanceof Error ? err.message : __( 'Could not revoke the link.', 'markaroo' ) );
    }
  }

  function copyUrl( link: ShareLink ) {
    const done = () => {
      setCopiedId( link.id );
      setTimeout( () => setCopiedId( null ), 1500 );
    };
    if ( navigator.clipboard && window.isSecureContext ) {
      navigator.clipboard
        .writeText( link.share_url )
        .then( done )
        // eslint-disable-next-line no-alert
        .catch( () => window.prompt( __( 'Copy this link:', 'markaroo' ), link.share_url ) );
      return;
    }
    // Fallback for insecure (http://) dev contexts.
    const ta = document.createElement( 'textarea' );
    ta.value = link.share_url;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild( ta );
    ta.focus();
    ta.select();
    try {
      document.execCommand( 'copy' );
      done();
    } catch {
      // eslint-disable-next-line no-alert
      window.prompt( __( 'Copy this link:', 'markaroo' ), link.share_url );
    }
    document.body.removeChild( ta );
  }

  const modeLabels: Record< string, string > = {
    comment: __( 'Comment', 'markaroo' ),
    view: __( 'View only', 'markaroo' ),
    clean: __( 'Clean', 'markaroo' ),
  };

  if ( loading ) {
    return <p className="markaroo-admin__loading">{ __( 'Loading…', 'markaroo' ) }</p>;
  }

  return (
    <div className="markaroo-share-links">
      <div className="markaroo-share-links__head">
        <h2 className="markaroo-admin__section-title">{ __( 'Share Links', 'markaroo' ) }</h2>
        <button
          type="button"
          className="markaroo-admin-btn markaroo-admin-btn--primary"
          onClick={ openCreate }
        >
          <Plus size={ 15 } strokeWidth={ 2.5 } /> { __( 'New link', 'markaroo' ) }
        </button>
      </div>

      <p className="markaroo-settings-group__hint">
        { __(
          'Anyone with a link can review your site as a guest — no account needed. Each link has its own scope, permissions, widget mode, and expiry.',
          'markaroo'
        ) }
      </p>

      { ! enabled && (
        <div className="markaroo-admin__error-box">
          { __(
            'Guest links are currently turned off in Settings → Guest Feedback Link. Links below will not resolve until you enable them.',
            'markaroo'
          ) }
        </div>
      ) }

      { error && <div className="markaroo-admin__error-box">{ error }</div> }

      { null !== formFor && (
        <form className="markaroo-share-links__form markaroo-settings-group" onSubmit={ submitForm }>
          <h3 className="markaroo-settings-group__title">
            { 0 === formFor ? __( 'New share link', 'markaroo' ) : __( 'Edit share link', 'markaroo' ) }
          </h3>

          <label>
            { __( 'Label (internal)', 'markaroo' ) }
            <input
              type="text"
              value={ form.label }
              placeholder={ __( 'e.g. Acme Corp review', 'markaroo' ) }
              onChange={ ( e ) => setForm( { ...form, label: e.target.value } ) }
            />
          </label>

          <label>
            { __( 'Scope', 'markaroo' ) }
            <select
              value={ form.scope }
              onChange={ ( e ) =>
                setForm( { ...form, scope: e.target.value as FormState[ 'scope' ] } )
              }
            >
              <option value="site">{ __( 'Entire site', 'markaroo' ) }</option>
              <option value="page">{ __( 'Single page', 'markaroo' ) }</option>
            </select>
          </label>

          { 'page' === form.scope && (
            <label>
              { __( 'Page', 'markaroo' ) }
              <select
                value={ form.page_key }
                onChange={ ( e ) => setForm( { ...form, page_key: e.target.value } ) }
                required
              >
                <option value="">{ __( 'Select a page…', 'markaroo' ) }</option>
                { pages.map( ( p ) => (
                  <option key={ p.key } value={ p.key }>
                    { p.title }
                  </option>
                ) ) }
              </select>
            </label>
          ) }

          <label>
            { __( 'Widget mode', 'markaroo' ) }
            <select
              value={ form.widget_mode }
              onChange={ ( e ) =>
                setForm( { ...form, widget_mode: e.target.value as FormState[ 'widget_mode' ] } )
              }
            >
              <option value="comment">{ __( 'Comment — view and add feedback', 'markaroo' ) }</option>
              <option value="view">{ __( 'View — see pins, no new feedback', 'markaroo' ) }</option>
              <option value="clean">{ __( 'Clean — browse without pins', 'markaroo' ) }</option>
            </select>
          </label>

          <label className="markaroo-settings-toggle">
            <input
              type="checkbox"
              checked={ form.can_view }
              onChange={ ( e ) => setForm( { ...form, can_view: e.target.checked } ) }
            />
            { __( 'Can view existing feedback', 'markaroo' ) }
          </label>

          <label className="markaroo-settings-toggle">
            <input
              type="checkbox"
              checked={ form.can_comment }
              onChange={ ( e ) => setForm( { ...form, can_comment: e.target.checked } ) }
            />
            { __( 'Can submit feedback', 'markaroo' ) }
          </label>

          <label>
            { __( 'Expires (optional)', 'markaroo' ) }
            <input
              type="datetime-local"
              value={ form.expires_at }
              onChange={ ( e ) => setForm( { ...form, expires_at: e.target.value } ) }
            />
          </label>

          <div className="markaroo-settings-actions">
            <button
              type="submit"
              className="markaroo-admin-btn markaroo-admin-btn--primary"
              disabled={ saving }
            >
              { saving ? __( 'Saving…', 'markaroo' ) : __( 'Save link', 'markaroo' ) }
            </button>
            <button
              type="button"
              className="markaroo-admin-btn markaroo-admin-btn--ghost"
              onClick={ () => setFormFor( null ) }
            >
              { __( 'Cancel', 'markaroo' ) }
            </button>
          </div>
        </form>
      ) }

      { 0 === links.length && null === formFor && (
        <div className="markaroo-share-links__empty">
          <Link2 size={ 28 } strokeWidth={ 1.5 } />
          <p>{ __( 'No share links yet. Create one to invite a client.', 'markaroo' ) }</p>
        </div>
      ) }

      <ul className="markaroo-share-links__list">
        { links.map( ( link ) => (
          <li
            key={ link.id }
            className={ `markaroo-share-links__item${
              link.is_expired ? ' markaroo-share-links__item--expired' : ''
            }` }
          >
            <div className="markaroo-share-links__meta">
              <span className="markaroo-share-links__label">
                { 'site' === link.scope ? (
                  <Globe size={ 15 } strokeWidth={ 2 } />
                ) : (
                  <FileText size={ 15 } strokeWidth={ 2 } />
                ) }
                { link.label || __( 'Untitled link', 'markaroo' ) }
              </span>
              <span className="markaroo-share-links__detail">
                { 'site' === link.scope
                  ? __( 'Entire site', 'markaroo' )
                  : link.page_key || __( 'Single page', 'markaroo' ) }
                { ' · ' }
                { modeLabels[ link.widget_mode ] ?? link.widget_mode }
                { ! link.can_comment && ` · ${ __( 'read-only', 'markaroo' ) }` }
                { link.expires_at &&
                  ` · ${
                    link.is_expired
                      ? __( 'Expired', 'markaroo' )
                      : `${ __( 'Expires', 'markaroo' ) } ${ link.expires_at }`
                  }` }
                { ' · ' }
                { timeAgo( link.created_at ) }
              </span>
              <input
                type="text"
                readOnly
                className="markaroo-share-links__url"
                value={ link.share_url }
                onFocus={ ( e ) => e.currentTarget.select() }
              />
            </div>
            <div className="markaroo-share-links__actions">
              <button
                type="button"
                className="markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm"
                onClick={ () => copyUrl( link ) }
              >
                { copiedId === link.id ? (
                  <>
                    <Check size={ 14 } strokeWidth={ 2.5 } /> { __( 'Copied!', 'markaroo' ) }
                  </>
                ) : (
                  <>
                    <Copy size={ 14 } strokeWidth={ 2 } /> { __( 'Copy', 'markaroo' ) }
                  </>
                ) }
              </button>
              <button
                type="button"
                className="markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm"
                onClick={ () => openEdit( link ) }
              >
                <Pencil size={ 14 } strokeWidth={ 2 } /> { __( 'Edit', 'markaroo' ) }
              </button>
              <button
                type="button"
                className="markaroo-admin-btn markaroo-admin-btn--danger markaroo-admin-btn--sm"
                onClick={ () => revoke( link ) }
              >
                <Trash2 size={ 14 } strokeWidth={ 2 } /> { __( 'Revoke', 'markaroo' ) }
              </button>
            </div>
          </li>
        ) ) }
      </ul>
    </div>
  );
}
