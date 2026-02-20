<script lang="ts">
	import { onMount } from 'svelte';
	import Editor from '$lib/components/Editor.svelte';
	import StoryPlayer from '$lib/components/StoryPlayer.svelte';
	import Toolbar from '$lib/components/Toolbar.svelte';
	import Console from '$lib/components/Console.svelte';
	import { ink } from '$lib/stores/ink';
	import { examples, defaultExample } from '$lib/examples';

	onMount(() => {
		ink.init().then(() => {
			if (!$ink.source) {
				ink.setSource(examples[defaultExample].source);
			}
		});
	});
</script>

<svelte:head>
	<title>Playground - ink Tutorial</title>
</svelte:head>

<div class="h-[calc(100vh-65px)]">
	{#if $ink.isLoading}
		<div class="flex h-full items-center justify-center">
			<div class="text-center">
				<div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-accent)] border-t-transparent"></div>
				<p class="text-[var(--color-text-dim)]">Loading ink compiler...</p>
			</div>
		</div>
	{:else}
		<div class="flex h-full flex-col">
			<div class="border-b border-[var(--color-border)] px-4 py-2">
				<Toolbar />
			</div>

			<div class="flex flex-1 overflow-hidden">
				<div class="flex w-1/2 flex-col border-r border-[var(--color-border)]">
					<div class="flex-1 overflow-hidden p-2">
						<Editor />
					</div>
					<div class="h-36 border-t border-[var(--color-border)] p-2">
						<Console />
					</div>
				</div>

				<div class="w-1/2 p-2">
					<StoryPlayer />
				</div>
			</div>
		</div>
	{/if}
</div>
