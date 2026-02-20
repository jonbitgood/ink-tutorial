export interface Choice {
	text: string;
	index: number;
}

export interface CompileResult {
	json: string;
	errors: string[] | null;
}

export interface InkWasm {
	compile(source: string): CompileResult;
	createStory(json: string): number;
	canContinue(storyId: number): boolean;
	continue(storyId: number): string;
	getChoices(storyId: number): Choice[];
	choose(storyId: number, index: number): boolean;
	hasEnded(storyId: number): boolean;
	getTags(storyId: number): string[];
	getVariables(storyId: number): Record<string, unknown>;
	reset(storyId: number): boolean;
	destroy(storyId: number): boolean;
	getState(storyId: number): string;
	loadState(storyId: number, state: string): boolean;
}

export interface InkState {
	source: string;
	compiled: string | null;
	errors: string[];
	text: string[];
	choices: Choice[];
	tags: string[];
	variables: Record<string, unknown>;
	hasEnded: boolean;
	isRunning: boolean;
	isLoading: boolean;
	storyId: number | null;
}
