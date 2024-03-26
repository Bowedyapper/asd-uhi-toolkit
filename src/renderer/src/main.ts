import './assets/style.css';
import rendererLogger from '$lib/helpers/logger';

rendererLogger.debug('Starting app...');
import App from './App.svelte';

const appElement = document.getElementById('app');
if (!appElement) {
  throw new Error("Couldn't find app element");
}

const app = new App({
  target: appElement
});

export default app;
