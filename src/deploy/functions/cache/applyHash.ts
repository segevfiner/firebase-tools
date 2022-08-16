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
    const source = context?.sources?.[codebase]; // populated earlier in prepare flow
    await applyBackendHashToBackend(wantBackend, source);
  }
}

/**
 * Updates {@link Backend}, applying a unique hash to each {@link Endpoint}.
 */
export async function applyBackendHashToBackend(wantBackend: Backend, source?: args.Source) {
  // Blocked by #4852
  // const v1FunctionHash = await getBackendHash(wantBackend, source.functionsSourceV1);
  // const v2FunctionHash = await getBackendHash(wantBackend, source.functionsSourceV2);
  const v1FunctionHash = "Hash-v1" + wantBackend + source;
  const v2FunctionHash = "Hash-v2" + wantBackend + source;

  allEndpoints(wantBackend).forEach((endpoint: Endpoint) => {
    const isV2 = endpoint.platform === "gcfv2";
    // Blocked by #4866
    // endpoint.hash = isV2 ? v2FunctionHash : v1FunctionHash;
    // endpoint.labels[LABEL_HASH] = isV2 ? v2FunctionHash : v1FunctionHash;

    endpoint.labels["hash"] = isV2 ? v2FunctionHash : v1FunctionHash;
  });
}
