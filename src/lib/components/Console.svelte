<script lang="ts">
	import { ink } from '$lib/stores/ink';

	let showVariables = $state(false);
</script>

<div class="flex h-full flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)]">
	<div class="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2">
		<h2 class="text-sm font-medium text-[var(--color-text-dim)]">Console</h2>
		{#if $ink.isRunning && Object.keys($ink.variables ?? {}).length > 0}
			<button
				class="text-xs text-[var(--color-accent)] hover:underline"
				onclick={() => showVariables = !showVariables}
			>
				{showVariables ? 'Hide' : 'Show'} Variables
			</button>
		{/if}
	</div>

	<div class="flex-1 overflow-y-auto p-4 font-mono text-sm">
		{#if $ink.errors?.length > 0}
			<div class="space-y-2">
				{#each $ink.errors ?? [] as error}
					<div class="rounded border border-[var(--color-error)]/50 bg-[var(--color-error)]/10 p-2 text-[var(--color-error)]">
						{error}
					</div>
				{/each}
			</div>
		{:else if showVariables && Object.keys($ink.variables ?? {}).length > 0}
			<div class="space-y-1">
				<p class="mb-2 text-[var(--color-text-dim)]">Variables:</p>
				{#each Object.entries($ink.variables ?? {}) as [name, value]}
					<div class="flex gap-2">
						<span class="text-[var(--color-accent)]">{name}</span>
						<span class="text-[var(--color-text-dim)]">=</span>
						<span class="text-[var(--color-success)]">{JSON.stringify(value)}</span>
					</div>
				{/each}
			</div>
		{:else}
			<p class="text-[var(--color-text-dim)]">
				{#if $ink.isRunning}
					Story running. No errors.
				{:else}
					Ready. Click Run to compile and execute your ink story.
				{/if}
			</p>
		{/if}
	</div>
</div>
