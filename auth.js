/* Optional Google sign-in. Guest checkout remains the default AVVM flow. */
(function () {
  'use strict';

  const CONFIG_URL = '/api/auth-config';
  const SUPABASE_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  const state = { ready: false, enabled: false, client: null, user: null };

  const text = (key, fallback) => window.AVVM_I18N?.t?.(key, fallback) || fallback;
  const toast = (message) => {
    if (typeof window.toast === 'function') window.toast(message);
    else window.alert(message);
  };

  function getDisplayName(user) {
    const metadata = user?.user_metadata || {};
    return String(metadata.full_name || metadata.name || metadata.user_name || '').trim();
  }

  function setFieldValue(id, value) {
    const field = document.getElementById(id);
    if (!field || field.value || !value) return;
    field.value = value;
    field.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function autofillContact(user) {
    if (!user) return;
    setFieldValue('emailInput', user.email || '');
    setFieldValue('emailInput2', user.email || '');
    setFieldValue('brandInput', getDisplayName(user));
    setFieldValue('brandInput2', getDisplayName(user));
  }

  function render() {
    const navButton = document.getElementById('googleSignIn');
    const badge = document.getElementById('authAccountBadge');
    const panel = document.getElementById('authInlinePanel');
    const accountEmail = document.getElementById('authAccountEmail');
    const signedIn = Boolean(state.user);

    if (navButton) navButton.hidden = !state.enabled || signedIn;
    if (panel) panel.hidden = !state.enabled;
    if (badge) {
      badge.hidden = !state.enabled || !signedIn;
      badge.textContent = signedIn ? (state.user.email || text('authSignedIn', 'SIGNED IN')) : '';
      badge.title = signedIn ? text('authSignedIn', 'Signed in with Google') : '';
    }
    if (accountEmail) accountEmail.textContent = signedIn ? (state.user.email || '') : '';
    document.documentElement.classList.toggle('avvm-authenticated', signedIn);
  }

  function updateUser(user) {
    state.user = user || null;
    autofillContact(state.user);
    render();
    document.dispatchEvent(new CustomEvent('avvm:authchange', { detail: { user: state.user } }));
  }

  function loadSupabaseLibrary() {
    if (window.supabase?.createClient) return Promise.resolve(window.supabase);
    const existing = document.querySelector('script[data-avvm-supabase-client]');
    if (existing) {
      return new Promise((resolve, reject) => {
        existing.addEventListener('load', () => resolve(window.supabase), { once: true });
        existing.addEventListener('error', () => reject(new Error('Could not load the authentication library.')), { once: true });
      });
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SUPABASE_CDN;
      script.async = true;
      script.dataset.avvmSupabaseClient = 'true';
      script.onload = () => window.supabase?.createClient ? resolve(window.supabase) : reject(new Error('Authentication library is unavailable.'));
      script.onerror = () => reject(new Error('Could not load the authentication library.'));
      document.head.appendChild(script);
    });
  }

  async function initialize() {
    try {
      const response = await fetch(CONFIG_URL, { credentials: 'same-origin', headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Google sign-in is not configured.');
      const config = await response.json();
      if (!config?.enabled || !config.supabaseUrl || !config.supabaseAnonKey) return;

      const supabase = await loadSupabaseLibrary();
      state.client = supabase.createClient(config.supabaseUrl, config.supabaseAnonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });
      state.enabled = true;

      const { data, error } = await state.client.auth.getSession();
      if (error) throw error;
      updateUser(data?.session?.user || null);
      state.client.auth.onAuthStateChange((_event, session) => updateUser(session?.user || null));
    } catch (error) {
      state.enabled = false;
      state.client = null;
      console.warn('Optional Google sign-in is unavailable:', error.message);
    } finally {
      state.ready = true;
      render();
      document.dispatchEvent(new CustomEvent('avvm:authready', { detail: { enabled: state.enabled } }));
    }
  }

  async function signInWithGoogle() {
    if (!state.enabled || !state.client) {
      toast(text('authUnavailable', 'Google sign-in is not available yet. Please continue as a guest.'));
      return;
    }
    try {
      const redirectTo = `${window.location.origin}${window.location.pathname}`;
      const { error } = await state.client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
      if (error) throw error;
    } catch (error) {
      console.error('Google sign-in failed:', error);
      toast(text('authError', 'Google login could not be started. Please try again.'));
    }
  }

  async function signOut() {
    if (!state.client) return;
    try {
      const { error } = await state.client.auth.signOut();
      if (error) throw error;
      toast(text('authSignedOut', 'Signed out. You can continue as a guest.'));
    } catch (error) {
      console.error('Google sign-out failed:', error);
      toast(text('authError', 'We could not complete that request. Please try again.'));
    }
  }

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-auth-login]')) {
      event.preventDefault();
      signInWithGoogle();
    }
    if (event.target.closest('[data-auth-signout]')) {
      event.preventDefault();
      signOut();
    }
  });

  document.addEventListener('avvm:languagechange', render);
  window.AVVM_AUTH = {
    get ready() { return state.ready; },
    get enabled() { return state.enabled; },
    get user() { return state.user; },
    signInWithGoogle,
    signOut
  };

  initialize();
})();
