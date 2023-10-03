import { getBackendActor } from '$lib/utils/actor.juno.utils';
import type { Identity } from '@dfinity/agent';

export const sayHello = async (identity: Identity | undefined | null): Promise<string> => {
	const actor = await getBackendActor(identity);
	return actor.greet('Hello');
};
