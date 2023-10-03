<script lang="ts">
	import { authStore } from '$lib/stores/auth.store';
	import { browser } from '$app/environment';

	const init = async () => await Promise.all([syncAuthStore()]);

	const syncAuthStore = async () => {
		if (!browser) {
			return;
		}

		try {
			await authStore.sync();
		} catch (err: unknown) {
			console.error(err);
		}
	};
</script>

<svelte:window on:storage={syncAuthStore} />

{#await init()}
	Loading
{:then _}
	<slot />
{/await}
