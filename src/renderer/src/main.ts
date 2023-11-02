import './assets/style.css';
import rendererLogger from '$lib/helpers/logger';

rendererLogger.debug('Starting app...');
import App from './App.svelte';
const app = new App({
  target: document.getElementById('app')
});

export default app;
