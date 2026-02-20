<script lang="ts">
	import { ink } from '$lib/stores/ink';
	import { examples } from '$lib/examples';

	let selectedExample = $state('');

	function handleRun() {
		ink.compileAndRun();
	}

	function handleReset() {
		if ($ink.isRunning) {
			ink.reset();
		}
	}

	function handleStop() {
		ink.stop();
	}

	function handleExampleChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		const value = target.value;
		if (value && examples[value]) {
			ink.setSource(examples[value].source);
			selectedExample = value;
		}
	}

	// Keyboard shortcut
	function handleKeydown(e: KeyboardEvent) {
		if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
			e.preventDefault();
			handleRun();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2">
	<button
		class="rounded bg-[var(--color-success)] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-success)]/80 disabled:cursor-not-allowed disabled:opacity-50"
		onclick={handleRun}
		disabled={$ink.isLoading}
	>
		{$ink.isLoading ? 'Loading...' : 'Run'}
	</button>

	{#if $ink.isRunning}
		<button
			class="rounded bg-[var(--color-accent)] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent)]/80"
			onclick={handleReset}
		>
			Restart
		</button>

		<button
			class="rounded border border-[var(--color-border)] px-4 py-1.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-border)]"
			onclick={handleStop}
		>
			Stop
		</button>
	{/if}

	<div class="mx-2 h-6 w-px bg-[var(--color-border)]"></div>

	<select
		class="rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-sm text-[var(--color-text)]"
		value={selectedExample}
		onchange={handleExampleChange}
	>
		<option value="">Load Example...</option>
		{#each Object.entries(examples) as [key, example]}
			<option value={key}>{example.name}</option>
		{/each}
	</select>

	<div class="flex-1"></div>

	<span class="text-xs text-[var(--color-text-dim)]">
		<kbd class="rounded bg-[var(--color-border)] px-1.5 py-0.5 font-mono">Ctrl</kbd>
		+
		<kbd class="rounded bg-[var(--color-border)] px-1.5 py-0.5 font-mono">Enter</kbd>
		to run
	</span>
</div>
