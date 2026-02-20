<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { getTutorial, tutorials, type Tutorial, type TutorialSection } from '$lib/tutorials';
	import { ink } from '$lib/stores/ink';
	import Editor from '$lib/components/Editor.svelte';
	import StoryPlayer from '$lib/components/StoryPlayer.svelte';

	let tutorial: Tutorial | undefined = $state(undefined);
	let currentSectionIndex = $state(0);
	let currentSection: TutorialSection | undefined = $derived(
		tutorial?.sections[currentSectionIndex]
	);

	let tutorialIndex = $derived(tutorials.findIndex(t => t.slug === page.params.slug));
	let prevTutorial = $derived(tutorialIndex > 0 ? tutorials[tutorialIndex - 1] : null);
	let nextTutorial = $derived(tutorialIndex < tutorials.length - 1 ? tutorials[tutorialIndex + 1] : null);

	onMount(() => {
		ink.init();
	});

	$effect(() => {
		tutorial = getTutorial(page.params.slug);
		currentSectionIndex = 0;
	});

	$effect(() => {
		if (currentSection?.code) {
			ink.setSource(currentSection.code);
			ink.stop();
		}
	});

	function goToSection(index: number) {
		currentSectionIndex = index;
	}

	let isLastSection = $derived(tutorial ? currentSectionIndex === tutorial.sections.length - 1 : false);
	let hasNextContent = $derived(!isLastSection || nextTutorial !== null);

	function nextSection() {
		if (tutorial && currentSectionIndex < tutorial.sections.length - 1) {
			currentSectionIndex++;
		}
	}

	function prevSection() {
		if (currentSectionIndex > 0) {
			currentSectionIndex--;
		}
	}

	function handleRun() {
		ink.compileAndRun();
	}

	function handleReset() {
		ink.reset();
	}
</script>

{#if tutorial}
	<div class="flex h-[calc(100vh-65px)]">
		<!-- Sidebar -->
		<aside class="w-72 flex-shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg-alt)]">
			<div class="flex h-full flex-col">
				<div class="border-b border-[var(--color-border)] p-4">
					<a href="{base}/learn" class="mb-2 flex items-center gap-1 text-xs text-[var(--color-text-dim)] hover:text-[var(--color-accent)]">
						<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
						</svg>
						All Tutorials
					</a>
					<h2 class="text-lg font-semibold">{tutorial.title}</h2>
					<span class="mt-1 inline-block rounded-full border px-2 py-0.5 text-xs font-medium difficulty-{tutorial.difficulty}">
						{tutorial.difficulty}
					</span>
				</div>

				<nav class="flex-1 overflow-y-auto p-2">
					{#each tutorial.sections as section, i}
						<button
							class="w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors
								{i === currentSectionIndex
									? 'bg-[var(--color-ink)]/10 text-[var(--color-ink)]'
									: 'text-[var(--color-text-dim)] hover:bg-[var(--color-panel)] hover:text-[var(--color-text)]'}"
							onclick={() => goToSection(i)}
						>
							<span class="mr-2 inline-flex h-5 w-5 items-center justify-center rounded text-xs
								{i === currentSectionIndex
									? 'bg-[var(--color-ink)] text-white'
									: 'bg-[var(--color-border)]'}">
								{i + 1}
							</span>
							{section.title}
						</button>
					{/each}
				</nav>

				<!-- Tutorial Navigation -->
				<div class="border-t border-[var(--color-border)] p-4">
					{#if prevTutorial}
						<a
							href="{base}/learn/{prevTutorial.slug}"
							class="mb-2 flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-dim)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
							</svg>
							{prevTutorial.title}
						</a>
					{/if}
					{#if nextTutorial}
						<a
							href="{base}/learn/{nextTutorial.slug}"
							class="flex items-center justify-between gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-dim)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
						>
							{nextTutorial.title}
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
							</svg>
						</a>
					{/if}
				</div>
			</div>
		</aside>

		<!-- Main Content -->
		<div class="flex flex-1 flex-col overflow-hidden">
			<!-- Lesson Content -->
			<div class="border-b border-[var(--color-border)] bg-[var(--color-panel)] p-6">
				<div class="mx-auto max-w-3xl">
					<h1 class="mb-4 text-2xl font-bold">{currentSection?.title}</h1>
					<div class="tutorial-content prose prose-invert max-w-none text-[var(--color-text-dim)]">
						{@html currentSection?.content?.trim().replace(/\n\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>') ?? ''}
					</div>
					{#if currentSection?.hint}
						<div class="mt-4 flex items-start gap-3 rounded-lg border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 p-4">
							<svg class="h-5 w-5 flex-shrink-0 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
							</svg>
							<p class="text-sm text-[var(--color-accent)]">{currentSection.hint}</p>
						</div>
					{/if}
				</div>
			</div>

			<!-- Editor and Story Area -->
			<div class="flex flex-1 overflow-hidden">
				<!-- Editor -->
				<div class="flex w-1/2 flex-col border-r border-[var(--color-border)]">
					<div class="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-alt)] px-4 py-2">
						<span class="text-sm font-medium text-[var(--color-text-dim)]">Code</span>
						<div class="flex items-center gap-2">
							<button
								class="rounded bg-[var(--color-success)] px-4 py-1 text-sm font-medium text-white transition-colors hover:bg-[var(--color-success-dim)]"
								onclick={handleRun}
								disabled={$ink.isLoading}
							>
								Run
							</button>
							{#if $ink.isRunning}
								<button
									class="rounded border border-[var(--color-border)] px-3 py-1 text-sm text-[var(--color-text-dim)] transition-colors hover:bg-[var(--color-panel)]"
									onclick={handleReset}
								>
									Reset
								</button>
							{/if}
						</div>
					</div>
					<div class="flex-1 overflow-hidden">
						<Editor />
					</div>
					{#if $ink.errors?.length > 0}
						<div class="border-t border-[var(--color-error)]/30 bg-[var(--color-error)]/10 p-3">
							{#each $ink.errors ?? [] as error}
								<p class="text-sm text-[var(--color-error)]">{error}</p>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Story Player -->
				<div class="w-1/2">
					<StoryPlayer />
				</div>
			</div>

			<!-- Section Navigation -->
			<div class="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-bg-alt)] px-4 py-3">
				<button
					class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors
						{currentSectionIndex === 0
							? 'text-[var(--color-text-muted)] cursor-not-allowed'
							: 'text-[var(--color-text-dim)] hover:bg-[var(--color-panel)] hover:text-[var(--color-text)]'}"
					onclick={prevSection}
					disabled={currentSectionIndex === 0}
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
					Previous
				</button>

				<span class="text-sm text-[var(--color-text-dim)]">
					{currentSectionIndex + 1} / {tutorial.sections.length}
				</span>

				{#if isLastSection && nextTutorial}
					<a
						href="{base}/learn/{nextTutorial.slug}"
						class="flex items-center gap-2 rounded-lg bg-[var(--color-ink)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-ink-dim)]"
					>
						{nextTutorial.title}
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</a>
				{:else if isLastSection}
					<a
						href="{base}/learn"
						class="flex items-center gap-2 rounded-lg bg-[var(--color-success)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-success-dim)]"
					>
						Complete!
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
					</a>
				{:else}
					<button
						class="flex items-center gap-2 rounded-lg bg-[var(--color-ink)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-ink-dim)]"
						onclick={nextSection}
					>
						Next
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</button>
				{/if}
			</div>
		</div>
	</div>
{:else}
	<div class="flex h-[calc(100vh-65px)] items-center justify-center">
		<div class="text-center">
			<h1 class="mb-4 text-2xl font-bold">Tutorial not found</h1>
			<a href="{base}/learn" class="text-[var(--color-accent)] hover:underline">
				Back to tutorials
			</a>
		</div>
	</div>
{/if}
