<script lang="ts">
	import { tutorials } from '$lib/tutorials';
	import { base } from '$app/paths';
</script>

<div class="mx-auto max-w-7xl px-4 py-12">
	<div class="mb-12">
		<h1 class="text-4xl font-bold">Learn ink</h1>
		<p class="mt-3 text-lg text-[var(--color-text-dim)]">
			Master interactive fiction writing with our hands-on tutorials
		</p>
	</div>

	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each tutorials as tutorial, index}
			<a
				href="{base}/learn/{tutorial.slug}"
				class="card-hover group relative rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 transition-colors hover:border-[var(--color-accent)]"
			>
				<div class="absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-ink)] text-sm font-bold text-white">
					{index + 1}
				</div>

				<div class="mb-4 flex items-center justify-between">
					<span class="rounded-full border px-2.5 py-0.5 text-xs font-medium difficulty-{tutorial.difficulty}">
						{tutorial.difficulty}
					</span>
					<span class="text-xs text-[var(--color-text-muted)]">
						{tutorial.sections.length} lessons
					</span>
				</div>

				<h2 class="mb-2 text-xl font-semibold group-hover:text-[var(--color-accent)]">
					{tutorial.title}
				</h2>

				<p class="mb-4 text-sm text-[var(--color-text-dim)]">
					{tutorial.description}
				</p>

				<div class="space-y-1.5">
					{#each tutorial.sections.slice(0, 3) as section, i}
						<div class="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
							<span class="flex h-4 w-4 items-center justify-center rounded bg-[var(--color-border)] text-[10px]">
								{i + 1}
							</span>
							{section.title}
						</div>
					{/each}
					{#if tutorial.sections.length > 3}
						<div class="text-xs text-[var(--color-text-muted)]">
							+{tutorial.sections.length - 3} more lessons
						</div>
					{/if}
				</div>

				<div class="mt-4 flex items-center gap-1 text-sm font-medium text-[var(--color-accent)] opacity-0 transition-opacity group-hover:opacity-100">
					Start learning
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
					</svg>
				</div>
			</a>
		{/each}
	</div>

	<div class="mt-16 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-8 text-center">
		<h2 class="mb-2 text-2xl font-bold">Want to experiment?</h2>
		<p class="mb-6 text-[var(--color-text-dim)]">
			Try the playground to write and test ink code without following a structured lesson.
		</p>
		<a
			href="{base}/playground"
			class="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 py-2.5 font-semibold text-white transition-colors hover:bg-[var(--color-accent-dim)]"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			Open Playground
		</a>
	</div>
</div>
