import { useSyncExternalStore } from 'react';
import { useGarageStore } from './useGarageStore';

/** True once the persisted garage vehicle has been read from localStorage on the client. */
export function useGarageHydrated(): boolean {
    return useSyncExternalStore(
        (callback) => useGarageStore.persist.onFinishHydration(callback),
        () => useGarageStore.persist.hasHydrated(),
        () => false
    );
}
