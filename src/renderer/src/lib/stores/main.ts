import rendererLogger from '$lib/helpers/logger';
import { Writable, writable } from 'svelte/store';

export const dev = process.env.NODE_ENV === 'development' ? true : false;

export const currentView: Writable<string> = writable('Setup');

export const studentInfo: Writable<StudentInfo> = writable({
  year: 3,
  repositories: [
  ]
});

export const studentEvidence: Writable<Evidence[]> = writable();

export const learningOutcomes: Writable<CourseModule[]> = writable();

export const animationSpeed: Writable<number> = writable(1);

animationSpeed.subscribe((value: number) => {
  rendererLogger.silly(`animationSpeed changed to ${value}`);
});

export const gitLoaderText: Writable<string> = writable();

export const devToolsEnabled: Writable<boolean> = writable(false);
