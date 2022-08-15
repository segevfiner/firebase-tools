import * as backend from "../backend";
import * as args from "../args";

/**
 *
 */
export async function applyBackendHashToBackends(
  wantBackends: Record<string, backend.Backend>,
  context: args.Context
) {
  for (const [codebase, wantBackend] of Object.entries(wantBackends)) {
    const source = context?.sources?.[codebase];
    await applyBackendHashToBackend(wantBackend, source);
  }
}

/**
 *
 */
export async function applyBackendHashToBackend(wantBackend: backend.Backend, source?: args.Source) {
  // Blocked by #4852
  // const hash = await getBackendHash(wantBackend: backend.Backend, source?: args.Source);
  const hash = "Hash" + wantBackend + source;
  backend.allEndpoints(wantBackend).forEach((endpoint) => {
    // Blocked by #4866
    // endpoint.hash = hash;
    // endpoint.labels[LABEL_HASH] = hash;

    endpoint.labels?.["hash"] = hash;
  });
}
