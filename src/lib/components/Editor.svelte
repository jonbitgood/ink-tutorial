<script lang="ts">
	import { onMount } from 'svelte';
	import { EditorView, basicSetup } from 'codemirror';
	import { EditorState } from '@codemirror/state';
	import { oneDark } from '@codemirror/theme-one-dark';
	import { StreamLanguage } from '@codemirror/language';
	import { ink } from '$lib/stores/ink';

	let editorContainer: HTMLDivElement;
	let view: EditorView;

	// Simple ink language mode with context tracking
	const inkLanguage = StreamLanguage.define({
		startState: () => ({ inBraces: 0, inLogicLine: false, lastWasWord: false }),
		token(stream, state: { inBraces: number; inLogicLine: boolean; lastWasWord: boolean }) {
			// Reset states at start of line
			if (stream.sol()) {
				state.inLogicLine = false;
				state.lastWasWord = false;
			}

			// Comments
			if (stream.match(/\/\/.*/)) {
				state.lastWasWord = false;
				return 'comment';
			}

			// Tags
			if (stream.match(/#\w+/)) {
				state.lastWasWord = true;
				return 'meta';
			}

			// Knot headers (=== name === with optional trailing ===)
			if (stream.match(/^===+\s*\w+\s*===*/)) {
				state.lastWasWord = false;
				return 'keyword';
			}
			// Trailing === for knot headers (in case matched separately)
			if (stream.match(/^===+$/)) {
				state.lastWasWord = false;
				return 'keyword';
			}

			// Stitch headers
			if (stream.match(/^=\s*\w+/)) {
				state.lastWasWord = true;
				return 'keyword';
			}

			// Choices
			if (stream.match(/^\s*[\*\+]+/)) {
				state.lastWasWord = false;
				return 'operator';
			}

			// Gather points
			if (stream.match(/^\s*-+(?!>)/)) {
				state.lastWasWord = false;
				return 'operator';
			}

			// Diverts
			if (stream.match(/->/)) {
				state.lastWasWord = false;
				return 'keyword';
			}

			// Logic line marker (tilde)
			if (stream.match(/^\s*~/)) {
				state.inLogicLine = true;
				state.lastWasWord = false;
				return 'keyword';
			}

			// Braces content (logic) - track nesting
			if (stream.peek() === '{') {
				stream.next();
				state.inBraces++;
				state.lastWasWord = false;
				return 'bracket';
			}
			if (stream.peek() === '}') {
				stream.next();
				if (state.inBraces > 0) state.inBraces--;
				state.lastWasWord = false;
				return 'bracket';
			}

			// Square brackets (choice display text)
			if (stream.peek() === '[') {
				stream.next();
				state.lastWasWord = false;
				return 'bracket';
			}
			if (stream.peek() === ']') {
				stream.next();
				state.lastWasWord = false;
				return 'bracket';
			}

			// Pipe (sequence separator)
			if (stream.peek() === '|') {
				stream.next();
				state.lastWasWord = false;
				return 'operator';
			}

			// String content
			if (stream.match(/"[^"]*"/)) {
				state.lastWasWord = false;
				return 'string';
			}

			// Numbers
			if (stream.match(/\d+/)) {
				state.lastWasWord = true;
				return 'number';
			}

			// Declaration keywords (always highlighted, only at word start)
			if (!state.lastWasWord && stream.match(/(VAR|CONST|LIST|INCLUDE|EXTERNAL|function|return)(?![a-zA-Z0-9_])/)) {
				state.lastWasWord = true;
				return 'keyword';
			}

			// Logic keywords (only in braces or logic lines, and only at word start)
			if ((state.inBraces > 0 || state.inLogicLine) && !state.lastWasWord) {
				if (stream.match(/(true|false|not|and|or|mod)(?![a-zA-Z0-9_])/)) {
					state.lastWasWord = true;
					return 'keyword';
				}
			}

			// Consume one character and track if it's a word character
			const ch = stream.peek();
			stream.next();
			state.lastWasWord = ch ? /[a-zA-Z0-9_]/.test(ch) : false;
			return null;
		}
	});

	onMount(() => {
		const state = EditorState.create({
			doc: $ink.source,
			extensions: [
				basicSetup,
				oneDark,
				inkLanguage,
				EditorView.updateListener.of((update) => {
					if (update.docChanged) {
						ink.setSource(update.state.doc.toString());
					}
				}),
				EditorView.theme({
					'&': {
						height: '100%',
						fontSize: '14px'
					},
					'.cm-scroller': {
						fontFamily: "'Fira Code', monospace"
					}
				})
			]
		});

		view = new EditorView({
			state,
			parent: editorContainer
		});

		return () => {
			view.destroy();
		};
	});

	// Update editor when source changes externally (e.g., loading an example)
	$effect(() => {
		if (view && $ink.source !== view.state.doc.toString()) {
			view.dispatch({
				changes: {
					from: 0,
					to: view.state.doc.length,
					insert: $ink.source
				}
			});
		}
	});
</script>

<div class="h-full w-full overflow-hidden rounded-lg border border-[var(--color-border)]">
	<div bind:this={editorContainer} class="h-full"></div>
</div>
