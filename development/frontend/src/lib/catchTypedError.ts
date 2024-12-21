// https://www.youtube.com/watch?v=AdmGHwvgaVs

export const catchErrorTyped = <T, E extends new (message?: string) => Error>(
	promise: Promise<T>,
	errorsToCatch?: E[]
): Promise<[undefined, T] | [InstanceType<E>]> =>
	promise
		.then((data) => [undefined, data] as [undefined, T])
		.catch((error) => {
			if (!errorsToCatch || errorsToCatch.some((e) => error instanceof e)) {
				return [error];
			}
			throw error;
		});

export const catchError = <T>(promise: Promise<T>): Promise<[undefined, T] | [Error]> =>
	promise.then((data) => [undefined, data] as [undefined, T]).catch((error) => [error]);
