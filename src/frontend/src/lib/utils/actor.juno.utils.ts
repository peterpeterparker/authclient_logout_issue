import type { _SERVICE as BackendActor } from '$declarations/backend/backend.did';
import { idlFactory as idlFactorBackend } from '$declarations/backend/backend.factory.did';
import { createActor } from '$lib/utils/actor.utils';
import { isNullish } from '$lib/utils/utils';
import type { Identity } from '@dfinity/agent';

export const getBackendActor = async (
	identity: Identity | undefined | null
): Promise<BackendActor> => {
	if (isNullish(identity)) {
		throw new Error('No internet identity.');
	}

	// Canister IDs are automatically expanded to .env config - see vite.config.ts
	const canisterId = import.meta.env.VITE_BACKEND_CANISTER_ID;

	return createActor({
		canisterId,
		idlFactory: idlFactorBackend,
		identity
	});
};
