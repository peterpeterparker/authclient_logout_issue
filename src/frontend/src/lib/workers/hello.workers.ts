import { sayHello } from '$lib/api/backend.api';
import { isNullish } from '$lib/utils/utils';
import { loadIdentity } from '$lib/utils/worker.utils';

onmessage = async () => {
	const identity = await loadIdentity();

	console.log('Worker identity:', identity, identity?.getPrincipal().toText());

	if (isNullish(identity)) {
		return;
	}

	console.log(await sayHello(identity));
};
