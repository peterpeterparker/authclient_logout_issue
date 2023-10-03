<script lang="ts">
	import { authSignedInStore, authStore } from '$lib/stores/auth.store';
	import { signIn, signOut } from '$lib/services/auth.services';
	import {isNullish} from "$lib/utils/utils";

	$: $authStore,
		(async () => {
			if (isNullish($authStore.identity)) {
				return;
			}

			console.log('Window identity:', $authStore.identity, $authStore.identity?.getPrincipal().toText());

			const HelloWorker = await import('$lib/workers/hello.workers?worker');
			const helloWorker: Worker = new HelloWorker.default();

			helloWorker.postMessage('hello');
		})();
</script>

{#if $authSignedInStore}
	<p>{$authStore?.identity?.getPrincipal().toText()}</p>

	<button on:click={signOut}>Sign out</button>
{:else}
	<button on:click={async () => await signIn({})}>Sign in</button>
{/if}
