import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Fixes hydration when a persisted (localStorage-backed) store would otherwise
 * differ between the server render and the client. Returns `undefined` until
 * the client has hydrated, then the real selected state.
 *
 * Uses `useSyncExternalStore` so there is no setState-in-effect (which React 19
 * flags): `getServerSnapshot` returns `false` during SSR/hydration and
 * `getSnapshot` returns `true` afterwards, triggering a single post-hydration
 * re-render.
 */
export const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) => {
  const result = store(callback) as F;
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return hydrated ? result : undefined;
};
