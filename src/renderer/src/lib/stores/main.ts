import rendererLogger from '$lib/helpers/logger';
import { Writable, writable } from 'svelte/store';

export const dev = process.env.NODE_ENV === 'development' ? true : false;

export const currentView: Writable<string> = writable('Setup');

export const studentInfo = writable({
  year: 2,
  repositories: []
});

export const studentEvidence = writable({});

export const learningOutcomes = writable([]);

export const animationSpeed = writable(1);
animationSpeed.subscribe((value) => {
  rendererLogger.silly(`animationSpeed changed to ${value}`);
});

export const gitLoaderText = writable();
