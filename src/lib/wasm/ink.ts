import type { InkWasm, CompileResult, Choice } from './types';

declare global {
	interface Window {
		Go: new () => Go;
		inkCompile: (source: string) => string;
		inkCreateStory: (json: string) => number;
		inkStoryCanContinue: (storyId: number) => boolean;
		inkStoryContinue: (storyId: number) => string;
		inkStoryGetChoices: (storyId: number) => string;
		inkStoryChoose: (storyId: number, index: number) => boolean;
		inkStoryHasEnded: (storyId: number) => boolean;
		inkStoryGetTags: (storyId: number) => string;
		inkStoryGetVariables: (storyId: number) => string;
		inkStoryReset: (storyId: number) => boolean;
		inkDestroyStory: (storyId: number) => boolean;
		inkStoryGetState: (storyId: number) => string;
		inkStoryLoadState: (storyId: number, state: string) => boolean;
	}
}

interface Go {
	run(instance: WebAssembly.Instance): Promise<void>;
	importObject: WebAssembly.Imports;
}

let wasmInstance: InkWasm | null = null;
let loadPromise: Promise<InkWasm> | null = null;

export async function loadInkWasm(): Promise<InkWasm> {
	if (wasmInstance) {
		return wasmInstance;
	}

	if (loadPromise) {
		return loadPromise;
	}

	loadPromise = (async () => {
		// Load wasm_exec.js if not already loaded
		if (typeof window.Go === 'undefined') {
			await new Promise<void>((resolve, reject) => {
				const script = document.createElement('script');
				script.src = '/wasm/wasm_exec.js';
				script.onload = () => resolve();
				script.onerror = () => reject(new Error('Failed to load wasm_exec.js'));
				document.head.appendChild(script);
			});
		}

		const go = new window.Go();
		const result = await WebAssembly.instantiateStreaming(fetch('/wasm/ink.wasm'), go.importObject);
		go.run(result.instance);

		// Wait for the functions to be registered
		await new Promise<void>((resolve) => {
			const check = () => {
				if (typeof window.inkCompile === 'function') {
					resolve();
				} else {
					setTimeout(check, 10);
				}
			};
			check();
		});

		wasmInstance = {
			compile(source: string): CompileResult {
				const resultStr = window.inkCompile(source);
				return JSON.parse(resultStr) as CompileResult;
			},

			createStory(json: string): number {
				return window.inkCreateStory(json);
			},

			canContinue(storyId: number): boolean {
				return window.inkStoryCanContinue(storyId);
			},

			continue(storyId: number): string {
				return window.inkStoryContinue(storyId);
			},

			getChoices(storyId: number): Choice[] {
				const choicesStr = window.inkStoryGetChoices(storyId);
				return JSON.parse(choicesStr) as Choice[];
			},

			choose(storyId: number, index: number): boolean {
				return window.inkStoryChoose(storyId, index);
			},

			hasEnded(storyId: number): boolean {
				return window.inkStoryHasEnded(storyId);
			},

			getTags(storyId: number): string[] {
				const tagsStr = window.inkStoryGetTags(storyId);
				return JSON.parse(tagsStr) as string[];
			},

			getVariables(storyId: number): Record<string, unknown> {
				const varsStr = window.inkStoryGetVariables(storyId);
				return JSON.parse(varsStr) as Record<string, unknown>;
			},

			reset(storyId: number): boolean {
				return window.inkStoryReset(storyId);
			},

			destroy(storyId: number): boolean {
				return window.inkDestroyStory(storyId);
			},

			getState(storyId: number): string {
				return window.inkStoryGetState(storyId);
			},

			loadState(storyId: number, state: string): boolean {
				return window.inkStoryLoadState(storyId, state);
			}
		};

		return wasmInstance;
	})();

	return loadPromise;
}

export function getInkWasm(): InkWasm | null {
	return wasmInstance;
}
