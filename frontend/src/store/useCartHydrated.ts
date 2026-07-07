import { useSyncExternalStore } from 'react';
import { useCartStore } from './useCartStore';

/** True once the persisted cart has been read from localStorage on the client. */
export function useCartHydrated(): boolean {
    return useSyncExternalStore(
        (callback) => useCartStore.persist.onFinishHydration(callback),
        () => useCartStore.persist.hasHydrated(),
        () => false
    );
}
