import { Writable, writable } from 'svelte/store';
import Store from 'electron-store';

export const persistentStore = new Store();

export const volatileStore: Writable<{ param1: string; param2: string }> = writable();
