import { applyBackendHashToBackends } from "../../../../deploy/functions/cache/applyHash";
import * as backend from "../../../../deploy/functions/backend";
import { expect } from "chai";

const EMPTY_ENDPOINT: backend.Endpoint = {
  id: "id",
  region: "region",
  project: "project",
  platform: "gcfv2",
  runtime: "nodejs16",
  entryPoint: "ep",
  httpsTrigger: {},
  secretEnvironmentVariables: [],
};

describe("applyHash", () => {
  describe("applyBackendHashToBackends", () => {
    it("should applyHash to each endpoint of a given backend", () => {
      // Prepare
      const context = {
        projectId: "projectId",
        sources: {
          function1: {
            functionsSourceV1: "function1_sourceV1",
            functionsSourceV2: "function1_sourceV2",
          },
          function2: {
            functionsSourceV1: "function2_sourceV1",
            functionsSourceV2: "function2_sourceV2",
          },
        },
      };
      const endpoint1 = {
        ...EMPTY_ENDPOINT,
        id: "endpoint1",
        platform: "gcfv1",
        secretEnvironmentVariables: [
          {
            key: "key",
            secret: "secret1",
            projectId: "projectId",
            version: "1",
          },
        ],
      } as backend.Endpoint;
      const endpoint2 = {
        ...EMPTY_ENDPOINT,
        id: "endpoint2",
        platform: "gcfv2",
        secretEnvironmentVariables: [
          {
            key: "key",
            secret: "secret2",
            projectId: "projectId",
            version: "2",
          },
        ],
      } as backend.Endpoint;

      const backend1 = backend.of(endpoint1);
      const backend2 = backend.of(endpoint2);
      const backends = { backend1, backend2 };

      // Execute
      applyBackendHashToBackends(backends, context);

      // Expect
      expect(endpoint1.hash).to.equal("env:envHash+source:function1_sourceV1+secret:secret=1");
      expect(endpoint2.hash).to.equal("env:envHash+source:function2_sourceV2+secret:secret=2");
    });
  });
});
