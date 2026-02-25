import { writable, get } from 'svelte/store';
import { Compiler, CompilerOptions } from 'inkjs/full';
import type { Story } from 'inkjs';

export interface Choice {
	text: string;
	index: number;
}

export interface InkState {
	source: string;
	errors: string[];
	text: string[];
	choices: Choice[];
	tags: string[];
	variables: Record<string, unknown>;
	hasEnded: boolean;
	isRunning: boolean;
	isLoading: boolean;
}

const STORAGE_KEY = 'ink-tutorial-source';

function extractVariables(story: Story, source: string): Record<string, unknown> {
	const varNames = [...source.matchAll(/^VAR\s+(\w+)/gm)].map((m) => m[1]);
	const vars: Record<string, unknown> = {};
	for (const name of varNames) {
		try {
			vars[name] = story.variablesState[name];
		} catch {
			// skip unknown variables
		}
	}
	return vars;
}

function createInkStore() {
	const initialState: InkState = {
		source: '',
		errors: [],
		text: [],
		choices: [],
		tags: [],
		variables: {},
		hasEnded: false,
		isRunning: false,
		isLoading: false
	};

	const { subscribe, update } = writable<InkState>(initialState);

	let story: Story | null = null;

	function continueStory() {
		if (!story) return;

		const state = get({ subscribe });
		const newText: string[] = [...state.text];
		let currentTags: string[] = [];

		while (story.canContinue) {
			const line = story.Continue();
			if (line && line.trim()) {
				newText.push(line.trim());
			}
			currentTags = story.currentTags ?? [];
		}

		const choices: Choice[] = (story.currentChoices ?? []).map((c) => ({
			text: c.text,
			index: c.index
		}));
		const hasEnded = !story.canContinue && choices.length === 0;
		const variables = extractVariables(story, state.source);

		update((s) => ({ ...s, text: newText, choices, tags: currentTags, variables, hasEnded }));
	}

	return {
		subscribe,

		async init(): Promise<void> {
			if (typeof localStorage !== 'undefined') {
				const saved = localStorage.getItem(STORAGE_KEY);
				if (saved) {
					update((s) => ({ ...s, source: saved }));
				}
			}
		},

		setSource(source: string) {
			update((s) => ({ ...s, source }));
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem(STORAGE_KEY, source);
			}
		},

		compileAndRun() {
			const state = get({ subscribe });
			story = null;
			update((s) => ({
				...s,
				errors: [],
				text: [],
				choices: [],
				tags: [],
				variables: {},
				hasEnded: false,
				isRunning: false
			}));

			const errors: string[] = [];
			try {
				const compiler = new Compiler(
					state.source,
					new CompilerOptions(null, [], false, (message: string) => {
						errors.push(message);
					})
				);
				story = compiler.Compile();
			} catch (e) {
				if (errors.length === 0) {
					errors.push(e instanceof Error ? e.message : String(e));
				}
				update((s) => ({ ...s, errors }));
				return;
			}

			if (errors.length > 0) {
				update((s) => ({ ...s, errors }));
				return;
			}

			update((s) => ({ ...s, isRunning: true, errors: [] }));
			continueStory();
		},

		reset() {
			if (!story) return;
			story.ResetState();
			update((s) => ({
				...s,
				text: [],
				choices: [],
				tags: [],
				variables: {},
				hasEnded: false
			}));
			continueStory();
		},

		stop() {
			story = null;
			update((s) => ({
				...s,
				text: [],
				choices: [],
				tags: [],
				variables: {},
				hasEnded: false,
				isRunning: false
			}));
		},

		choose(index: number) {
			if (!story) return;
			story.ChooseChoiceIndex(index);
			continueStory();
		},

		saveState(): string | null {
			if (!story) return null;
			return story.state.ToJson();
		},

		loadState(savedState: string): boolean {
			if (!story) return false;
			try {
				story.state.LoadJson(savedState);
				update((s) => ({ ...s, text: ['[State loaded]'] }));
				continueStory();
				return true;
			} catch {
				return false;
			}
		}
	};
}

export const ink = createInkStore();
