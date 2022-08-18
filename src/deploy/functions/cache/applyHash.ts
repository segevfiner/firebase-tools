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
  // envHash
  const envHash = getEnvHash(wantBackends);
  for (const [codebase, wantBackend] of Object.entries(wantBackends)) {
    const source = context?.sources?.[codebase]; // populated earlier in prepare flow
    const sourceV1Hash = await getSourceHash(source?.functionsSourceV1);
    const sourceV2Hash = await getSourceHash(source?.functionsSourceV2);
    applyBackendHashToBackend(wantBackend, envHash, sourceV1Hash, sourceV2Hash);
  }
}

/**
 * Updates {@link Backend}, applying a unique hash to each {@link Endpoint}.
 */
export function applyBackendHashToBackend(
  wantBackend: Backend,
  envHash: string,
  sourceV1Hash: string,
  sourceV2Hash: string
) {
  allEndpoints(wantBackend).forEach((endpoint: Endpoint) => {
    const secretsHash = getSecretHash(endpoint);
    const isV2 = endpoint.platform === "gcfv2";
    const sourceHash = isV2 ? sourceV2Hash : sourceV1Hash;
    // Blocked by #4866
    endpoint.hash = getEndpointHash(sourceHash, envHash, secretsHash);
  });
}

function getEnvHash(wantBackends: Record<string, Backend>) {
  const backends = Object.values(wantBackends);
  if (backends.length) {
    return getEnvironmentVariablesHash(backends[0]);
  }
  return "";
}

function getEnvironmentVariablesHash(backend: Backend) {
  return "UNBLOCKING_HELPER_PLEASE_DELETE_ME_BEFORE_ITS_TOO_LATE";
}

async function getSourceHash(pathToGeneratedPackageFile = "") {
  return "UNBLOCKING_HELPER_PLEASE_DELETE_ME_BEFORE_ITS_TOO_LATE";
}

function getSecretHash(endpoint: Endpoint) {
  return "UNBLOCKING_HELPER_PLEASE_DELETE_ME_BEFORE_ITS_TOO_LATE";
}

function getEndpointHash(sourceHash: string, envHash: string, secretsHash: string) {
  return "UNBLOCKING_HELPER_PLEASE_DELETE_ME_BEFORE_ITS_TOO_LATE";
}
