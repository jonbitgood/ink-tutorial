import { tutorials } from '$lib/tutorials';

export function entries() {
	return tutorials.map((tutorial) => ({
		slug: tutorial.slug
	}));
}
