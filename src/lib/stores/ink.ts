import { writable, get } from 'svelte/store';
import type { InkState, Choice, InkWasm } from '$lib/wasm/types';
import { loadInkWasm, getInkWasm } from '$lib/wasm/ink';

const STORAGE_KEY = 'ink-tutorial-source';

function createInkStore() {
	const initialState: InkState = {
		source: '',
		compiled: null,
		errors: [],
		text: [],
		choices: [],
		tags: [],
		variables: {},
		hasEnded: false,
		isRunning: false,
		isLoading: true,
		storyId: null
	};

	const { subscribe, set, update } = writable<InkState>(initialState);

	let wasm: InkWasm | null = null;

	return {
		subscribe,

		async init() {
			try {
				wasm = await loadInkWasm();
				// Load saved source from localStorage
				if (typeof localStorage !== 'undefined') {
					const saved = localStorage.getItem(STORAGE_KEY);
					if (saved) {
						update((s) => ({ ...s, source: saved, isLoading: false }));
						return;
					}
				}
				update((s) => ({ ...s, isLoading: false }));
			} catch (err) {
				console.error('Failed to load Ink WASM:', err);
				update((s) => ({
					...s,
					isLoading: false,
					errors: ['Failed to load Ink compiler. Please refresh the page.']
				}));
			}
		},

		setSource(source: string) {
			update((s) => ({ ...s, source }));
			// Save to localStorage
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem(STORAGE_KEY, source);
			}
		},

		compile(): boolean {
			const state = get({ subscribe });
			if (!wasm) {
				update((s) => ({ ...s, errors: ['WASM not loaded'] }));
				return false;
			}

			// Destroy existing story if any
			if (state.storyId !== null) {
				wasm.destroy(state.storyId);
			}

			const result = wasm.compile(state.source);

			if (result.errors && result.errors.length > 0) {
				update((s) => ({
					...s,
					errors: result.errors!,
					compiled: null,
					storyId: null,
					isRunning: false
				}));
				return false;
			}

			update((s) => ({
				...s,
				compiled: result.json,
				errors: []
			}));

			return true;
		},

		run() {
			const state = get({ subscribe });
			if (!wasm || !state.compiled) {
				return;
			}

			// Destroy existing story if any
			if (state.storyId !== null) {
				wasm.destroy(state.storyId);
			}

			const storyId = wasm.createStory(state.compiled);
			if (storyId < 0) {
				update((s) => ({
					...s,
					errors: ['Failed to create story from compiled JSON'],
					storyId: null,
					isRunning: false
				}));
				return;
			}

			update((s) => ({
				...s,
				storyId,
				text: [],
				choices: [],
				tags: [],
				variables: {},
				hasEnded: false,
				isRunning: true,
				errors: []
			}));

			this.continueStory();
		},

		compileAndRun() {
			if (this.compile()) {
				this.run();
			}
		},

		continueStory() {
			const state = get({ subscribe });
			if (!wasm || state.storyId === null) return;

			const newText: string[] = [...state.text];
			let currentTags: string[] = [];

			while (wasm.canContinue(state.storyId)) {
				const text = wasm.continue(state.storyId);
				if (text.trim()) {
					newText.push(text);
				}
				currentTags = wasm.getTags(state.storyId);
			}

			const choices = wasm.getChoices(state.storyId);
			const hasEnded = wasm.hasEnded(state.storyId);
			const variables = wasm.getVariables(state.storyId);

			update((s) => ({
				...s,
				text: newText,
				choices,
				tags: currentTags,
				variables,
				hasEnded
			}));
		},

		choose(index: number) {
			const state = get({ subscribe });
			if (!wasm || state.storyId === null) return;

			const success = wasm.choose(state.storyId, index);
			if (success) {
				this.continueStory();
			}
		},

		reset() {
			const state = get({ subscribe });
			if (!wasm || state.storyId === null) return;

			wasm.reset(state.storyId);

			update((s) => ({
				...s,
				text: [],
				choices: [],
				tags: [],
				variables: {},
				hasEnded: false
			}));

			this.continueStory();
		},

		stop() {
			const state = get({ subscribe });
			if (wasm && state.storyId !== null) {
				wasm.destroy(state.storyId);
			}

			update((s) => ({
				...s,
				storyId: null,
				text: [],
				choices: [],
				tags: [],
				variables: {},
				hasEnded: false,
				isRunning: false
			}));
		},

		saveState(): string | null {
			const state = get({ subscribe });
			if (!wasm || state.storyId === null) return null;
			return wasm.getState(state.storyId);
		},

		loadState(savedState: string): boolean {
			const state = get({ subscribe });
			if (!wasm || state.storyId === null) return false;

			const success = wasm.loadState(state.storyId, savedState);
			if (success) {
				// Clear current text and continue from loaded state
				update((s) => ({
					...s,
					text: ['[State loaded]']
				}));
				this.continueStory();
			}
			return success;
		}
	};
}

export const ink = createInkStore();
