<script lang="ts">
	import { tutorials } from '$lib/tutorials';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	let video: HTMLVideoElement;
	let videoOpacity = $state(1);

	onMount(() => {
		if (!video) return;

		const handleTimeUpdate = () => {
			const timeRemaining = video.duration - video.currentTime;

			if (timeRemaining <= 5) {
				// Fade out over last 5 seconds
				videoOpacity = timeRemaining / 5;
			} else if (video.currentTime <= 2) {
				// Fade in over first 2 seconds
				videoOpacity = video.currentTime / 2;
			} else {
				videoOpacity = 1;
			}
		};

		video.addEventListener('timeupdate', handleTimeUpdate);
		return () => video.removeEventListener('timeupdate', handleTimeUpdate);
	});
</script>

<!-- Hero Section -->
<section class="relative overflow-hidden border-b border-[var(--color-border)]">
	<!-- Video Background -->
	<div class="absolute inset-0 overflow-hidden">
		<video
			bind:this={video}
			autoplay
			loop
			muted
			playsinline
			class="h-full w-full object-cover transition-opacity duration-300"
			style="opacity: {videoOpacity}"
		>
			<source src="{base}/ink.mp4" type="video/mp4" />
		</video>
	</div>
	<div class="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/80 via-[var(--color-bg)]/60 to-[var(--color-bg)]"></div>

	<div class="relative mx-auto max-w-7xl px-4 py-24 text-center">
		<div class="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-1.5 text-sm text-[var(--color-text-dim)]">
			<span class="h-2 w-2 rounded-full bg-[var(--color-success)] animate-pulse"></span>
			Interactive tutorial with live code execution
		</div>

		<h1 class="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
			Learn to write
			<span class="glow-text text-[var(--color-ink)]">interactive fiction</span>
			<br />with ink
		</h1>

		<p class="mx-auto mb-10 max-w-2xl text-lg text-[var(--color-text-dim)] md:text-xl">
			ink is the powerful scripting language behind award-winning games like
			<strong class="text-[var(--color-text)]">80 Days</strong> and
			<strong class="text-[var(--color-text)]">Heaven's Vault</strong>.
			Start creating your own branching narratives today.
		</p>

		<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
			<a
				href="{base}/learn"
				class="group inline-flex items-center gap-2 rounded-lg bg-[var(--color-ink)] px-8 py-3 text-lg font-semibold text-white transition-all hover:bg-[var(--color-ink-dim)] animate-pulse-glow"
			>
				Start Learning
				<svg class="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
				</svg>
			</a>
			<a
				href="{base}/playground"
				class="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-8 py-3 text-lg font-semibold text-[var(--color-text)] transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				Open Playground
			</a>
		</div>
	</div>
</section>

<!-- Features Section -->
<section class="border-b border-[var(--color-border)] py-20">
	<div class="mx-auto max-w-7xl px-4">
		<h2 class="mb-12 text-center text-3xl font-bold">Why learn ink?</h2>

		<div class="grid gap-8 md:grid-cols-3">
			<div class="card-hover rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
				<div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
					</svg>
				</div>
				<h3 class="mb-2 text-xl font-semibold">Easy to Learn</h3>
				<p class="text-[var(--color-text-dim)]">
					ink's syntax is intuitive and readable. If you can write a story, you can write in ink.
					No programming experience required.
				</p>
			</div>

			<div class="card-hover rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
				<div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-ink)]/10 text-[var(--color-ink)]">
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
					</svg>
				</div>
				<h3 class="mb-2 text-xl font-semibold">Industry Proven</h3>
				<p class="text-[var(--color-text-dim)]">
					Used in commercial games with millions of players. ink handles complex narratives
					with thousands of branching paths.
				</p>
			</div>

			<div class="card-hover rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
				<div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-success)]/10 text-[var(--color-success)]">
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
					</svg>
				</div>
				<h3 class="mb-2 text-xl font-semibold">Powerful Features</h3>
				<p class="text-[var(--color-text-dim)]">
					Variables, conditionals, functions, and more. Everything you need to create
					dynamic, responsive stories.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Tutorials Preview Section -->
<section class="py-20">
	<div class="mx-auto max-w-7xl px-4">
		<div class="mb-12 flex items-end justify-between">
			<div>
				<h2 class="text-3xl font-bold">Interactive Tutorials</h2>
				<p class="mt-2 text-[var(--color-text-dim)]">Learn by doing with hands-on lessons</p>
			</div>
			<a
				href="{base}/learn"
				class="text-sm text-[var(--color-accent)] hover:underline"
			>
				View all tutorials &rarr;
			</a>
		</div>

		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each tutorials.slice(0, 3) as tutorial}
				<a
					href="{base}/learn/{tutorial.slug}"
					class="card-hover group rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 transition-colors hover:border-[var(--color-accent)]"
				>
					<div class="mb-3 flex items-center justify-between">
						<span class="rounded-full border px-2.5 py-0.5 text-xs font-medium difficulty-{tutorial.difficulty}">
							{tutorial.difficulty}
						</span>
						<span class="text-xs text-[var(--color-text-muted)]">
							{tutorial.sections.length} lessons
						</span>
					</div>

					<h3 class="mb-2 text-lg font-semibold group-hover:text-[var(--color-accent)]">
						{tutorial.title}
					</h3>

					<p class="text-sm text-[var(--color-text-dim)]">
						{tutorial.description}
					</p>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- Code Example Section -->
<section class="border-t border-[var(--color-border)] bg-[var(--color-bg-alt)] py-20">
	<div class="mx-auto max-w-7xl px-4">
		<div class="grid items-center gap-12 lg:grid-cols-2">
			<div>
				<h2 class="mb-4 text-3xl font-bold">Write stories, not code</h2>
				<p class="mb-6 text-lg text-[var(--color-text-dim)]">
					ink looks like the stories you write. Choices are marked with asterisks,
					story branches are named sections, and variables track your world state.
				</p>
				<ul class="space-y-3 text-[var(--color-text-dim)]">
					<li class="flex items-center gap-3">
						<span class="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-success)]/20 text-[var(--color-success)]"><svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></span>
						Natural, readable syntax
					</li>
					<li class="flex items-center gap-3">
						<span class="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-success)]/20 text-[var(--color-success)]"><svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></span>
						Powerful variable system
					</li>
					<li class="flex items-center gap-3">
						<span class="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-success)]/20 text-[var(--color-success)]"><svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></span>
						Conditional content & choices
					</li>
					<li class="flex items-center gap-3">
						<span class="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-success)]/20 text-[var(--color-success)]"><svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></span>
						Functions & reusable logic
					</li>
				</ul>
			</div>

			<div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-1">
				<div class="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-2">
					<div class="h-3 w-3 rounded-full bg-[var(--color-error)]"></div>
					<div class="h-3 w-3 rounded-full bg-[var(--color-warning)]"></div>
					<div class="h-3 w-3 rounded-full bg-[var(--color-success)]"></div>
					<span class="ml-2 text-xs text-[var(--color-text-muted)]">adventure.ink</span>
				</div>
				<pre class="overflow-x-auto p-4 font-mono text-sm"><code class="text-[var(--color-text)]"><span class="text-[var(--color-text-muted)]">VAR</span> <span class="text-[var(--color-accent)]">gold</span> = <span class="text-[var(--color-warning)]">10</span>

You enter the mysterious cave.

<span class="text-[var(--color-choice)]">*</span> [Light a torch]
  The cave illuminates.
  <span class="text-[var(--color-text-muted)]">-></span> explore

<span class="text-[var(--color-choice)]">*</span> [Proceed in darkness]
  You stumble forward...
  <span class="text-[var(--color-text-muted)]">-></span> danger

<span class="text-[var(--color-ink)]">===</span> explore <span class="text-[var(--color-ink)]">===</span>
You find <span class="text-[var(--color-warning)]">{"{"}</span>gold<span class="text-[var(--color-warning)]">{"}"}</span> gold coins!
<span class="text-[var(--color-text-muted)]">-></span> END</code></pre>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="py-20">
	<div class="mx-auto max-w-3xl px-4 text-center">
		<h2 class="mb-4 text-3xl font-bold">Ready to start writing?</h2>
		<p class="mb-8 text-lg text-[var(--color-text-dim)]">
			Jump into the playground and start experimenting, or follow our structured tutorials
			to master ink step by step.
		</p>
		<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
			<a
				href="{base}/learn/basics"
				class="rounded-lg bg-[var(--color-ink)] px-8 py-3 font-semibold text-white transition-all hover:bg-[var(--color-ink-dim)]"
			>
				Begin Tutorial
			</a>
			<a
				href="{base}/playground"
				class="rounded-lg border border-[var(--color-border)] px-8 py-3 font-semibold text-[var(--color-text)] transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
			>
				Explore Playground
			</a>
		</div>
	</div>
</section>
