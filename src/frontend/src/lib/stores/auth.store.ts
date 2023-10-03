import { AUTH_MAX_TIME_TO_LIVE, localIdentityCanisterId } from '$lib/constants/constants';
import { createAuthClient } from '$lib/utils/auth.utils';
import { nonNullish } from '$lib/utils/utils';
import type { Identity } from '@dfinity/agent';
import type { AuthClient } from '@dfinity/auth-client';
import { derived, writable, type Readable } from 'svelte/store';

export interface AuthStoreData {
	identity: Identity | undefined | null;
}

let authClient: AuthClient | undefined | null;

export interface AuthSignInParams {
	domain?: 'internetcomputer.org' | 'ic0.app';
}

export interface AuthStore extends Readable<AuthStoreData> {
	sync: () => Promise<void>;
	signIn: (params: AuthSignInParams) => Promise<void>;
	signOut: () => Promise<void>;
}

const initAuthStore = (): AuthStore => {
	const { subscribe, set, update } = writable<AuthStoreData>({
		identity: undefined
	});

	return {
		subscribe,

		sync: async () => {
			console.log(authClient);

			authClient = authClient ?? (await createAuthClient());
			const isAuthenticated: boolean = await authClient.isAuthenticated();

			set({
				identity: isAuthenticated ? authClient.getIdentity() : null
			});
		},

		signIn: ({ domain }: AuthSignInParams) =>
			// eslint-disable-next-line no-async-promise-executor
			new Promise<void>(async (resolve, reject) => {
				authClient = authClient ?? (await createAuthClient());

				const identityProvider = nonNullish(localIdentityCanisterId)
					? `http://${localIdentityCanisterId}.localhost:4943`
					: `https://identity.${domain ?? 'internetcomputer.org'}`;

				await authClient?.login({
					maxTimeToLive: AUTH_MAX_TIME_TO_LIVE,
					onSuccess: () => {
						update((state: AuthStoreData) => ({
							...state,
							identity: authClient?.getIdentity()
						}));

						resolve();
					},
					onError: reject,
					identityProvider
				});
			}),

		signOut: async () => {
			const client: AuthClient = authClient ?? (await createAuthClient());

			await client.logout();

			// TODO: this is required
			// authClient = null;

			update((state: AuthStoreData) => ({
				...state,
				identity: null
			}));
		}
	};
};

export const authStore = initAuthStore();

export const authSignedInStore: Readable<boolean> = derived(
	authStore,
	({ identity }) => identity !== null && identity !== undefined
);
