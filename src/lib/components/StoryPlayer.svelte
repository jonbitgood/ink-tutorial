<script lang="ts">
	import { ink } from '$lib/stores/ink';

	let storyContainer: HTMLDivElement;

	// Auto-scroll when new text appears
	$effect(() => {
		if ($ink.text?.length > 0 && storyContainer) {
			setTimeout(() => {
				storyContainer.scrollTop = storyContainer.scrollHeight;
			}, 50);
		}
	});

	function handleChoice(index: number) {
		ink.choose(index);
	}
</script>

<div class="flex h-full flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)]">
	<div class="border-b border-[var(--color-border)] px-4 py-2">
		<h2 class="text-sm font-medium text-[var(--color-text-dim)]">Story</h2>
	</div>

	<div
		bind:this={storyContainer}
		class="flex-1 overflow-y-auto p-4"
	>
		{#if !$ink.isRunning}
			<div class="flex h-full items-center justify-center text-[var(--color-text-dim)]">
				<p class="text-center">
					Write some ink code and click <strong>Run</strong> to see your story here.
				</p>
			</div>
		{:else}
			<div class="story-text space-y-4">
				{#each $ink.text ?? [] as paragraph, i (i)}
					<p class="fade-in text-[var(--color-text)]">
						{@html paragraph.replace(/\n/g, '<br>')}
					</p>
				{/each}

				{#if $ink.tags?.length > 0}
					<div class="flex flex-wrap gap-2">
						{#each $ink.tags ?? [] as tag (tag)}
							<span class="rounded bg-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-text-dim)]">
								#{tag}
							</span>
						{/each}
					</div>
				{/if}

				{#if $ink.choices?.length > 0}
					<div class="mt-6 space-y-2">
						{#each $ink.choices ?? [] as choice (choice.index)}
							<button
								class="choice-button block w-full rounded border border-[var(--color-choice)] bg-transparent px-4 py-2 text-left text-[var(--color-choice)] hover:border-[var(--color-choice-hover)] hover:bg-[var(--color-choice-hover)]/10 hover:text-[var(--color-choice-hover)]"
								onclick={() => handleChoice(choice.index)}
							>
								<span class="mr-2 text-[var(--color-text-dim)]">{choice.index + 1}.</span>
								{choice.text}
							</button>
						{/each}
					</div>
				{/if}

				{#if $ink.hasEnded}
					<div class="mt-6 rounded border border-[var(--color-accent)] bg-[var(--color-accent)]/10 p-4 text-center">
						<p class="text-[var(--color-accent)]">The End</p>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
