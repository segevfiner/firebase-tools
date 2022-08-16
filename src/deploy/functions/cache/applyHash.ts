import { Backend, Endpoint, allEndpoints } from "../backend";
import * as args from "../args";

/**
 *
 * Updates all the CodeBase {@link Backend}, applying a hash to each of their {@link Endpoint}.
 */
export async function applyBackendHashToBackends(
  wantBackends: Record<string, Backend>,
  context: args.Context
) {
  for (const [codebase, wantBackend] of Object.entries(wantBackends)) {
    const source = context?.sources?.[codebase];
    await applyBackendHashToBackend(wantBackend, source);
  }
}

/**
 * Updates {@link Backend}, applying a unique hash to each {@link Endpoint}.
 */
export async function applyBackendHashToBackend(wantBackend: Backend, source?: args.Source) {
  // Blocked by #4852
  // const hash = await getBackendHash(wantBackend: backend.Backend, source?: args.Source);
  const hash = "Hash" + wantBackend + source;
  allEndpoints(wantBackend).forEach((endpoint: Endpoint) => {
    // Blocked by #4866
    // endpoint.hash = hash;
    // endpoint.labels[LABEL_HASH] = hash;

    endpoint.labels?.["hash"] = hash;
  });
}
