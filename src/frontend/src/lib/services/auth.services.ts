import { authStore, type AuthSignInParams } from '$lib/stores/auth.store';

export const signIn = async (
	params: AuthSignInParams
): Promise<{ success: 'ok' | 'cancelled' | 'error'; err?: unknown }> => {
	try {
		await authStore.signIn(params);

		return { success: 'ok' };
	} catch (err: unknown) {
		if (err === 'UserInterrupt') {
			// We do not display an error if user explicitly cancelled the process of sign-in
			return { success: 'cancelled' };
		}

		return { success: 'error', err };
	}
};

export const signOut = async () => {
	await authStore.signOut();
};

export const idleSignOut = async () => {
	await signOut();
};
