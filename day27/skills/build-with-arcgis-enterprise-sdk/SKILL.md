---
name: build-with-arcgis-enterprise-sdk
license: Apache-2.0
description: Use for ArcGIS Enterprise SDK server-side development, including Java or .NET SOEs and SOIs, Java service interceptors, Node.js custom data feeds, and Enterprise-hosted custom MCP tools. Covers extension selection, release and runtime compatibility, packaging, deployment, and staging validation.
---

# Build with ArcGIS Enterprise SDK

Use the Enterprise SDK when the task requires custom behavior running in ArcGIS Enterprise. Ordinary portal administration, standard REST queries, or an app consuming an existing service belongs with the appropriate REST or client SDK. A published geoprocessing workflow may fit ArcPy when it only needs geoprocessing tools.

## Application requirements

Identify the exact Enterprise and ArcGIS Server release, deployment platform and site topology, target service type, and the operation or response contract. Determine whether the user needs source, a build artifact, or an authorized deployment. Confirm which clients use the service and what behavior must remain compatible when the extension is enabled, disabled, or updated.

| Need | Extension point |
| --- | --- |
| Add an operation to an eligible map or image service | Server object extension (SOE, Java or .NET where supported) |
| Extend existing operations through an eligible service’s internal APIs | Server object interceptor (SOI, Java or .NET where supported) |
| Process requests or responses at the REST handler layer | Java service interceptor, with server-side URL patterns and chain order |
| Serve external records through feature service workflows | Custom data feed, built with the SDK’s Node.js tooling |
| Run a custom Java tool callable by authorized MCP clients | ArcGIS Enterprise custom MCP tool |

## Installation and compatibility

- Select the SDK release and extension-specific instructions from the [Enterprise SDK landing page](https://developers.arcgis.com/enterprise-sdk/). The SDK is available through My Esri with ArcGIS Enterprise. Check platform support separately for development, deployment, and the specific service capability. Verify support before carrying an extension from Windows or Linux to Kubernetes, or across single-machine and multi-machine deployments.
- For SOEs and SOIs, confirm the exact service was published through a supported workflow. Esri’s sample repository uses ArcGIS Pro-published map services, including supported capabilities of those services. Check hosted feature-service use separately under the REST service-interceptor workflow, including the target release's limits.
- For .NET SOEs and SOIs, check the supported Windows, Visual Studio, and .NET toolchain and use the SDK’s matching template. Verify that the target ArcGIS Server has .NET Extension Support when required.
- For Java SOEs, SOIs, and service interceptors, check the version-matched JDK, Maven, and SDK artifacts or archetypes. Enterprise custom MCP tool artifacts have their own release matrix. For custom data feeds, check the supported Node.js version and CLI independently.
- Confirm the service’s publisher, the administrator who can register or enable the extension, and the identity of the actual caller. Use the project’s established authentication flow and validate both service access and extension-specific authorization. Use the shared ArcGIS authentication skill when the workflow introduces new protected resources or sign-in behavior.

## Patterns and guidelines

- Start from the official template or closest release-matched sample. Keep the server adapter small and test domain logic outside the server where practical. Separate extension configuration from credentials. Validate request input, bound downstream work, and keep per-request data out of shared instance fields. Preserve the service’s normal authorization and avoid logging secrets or sensitive payloads.
- Use the appropriate [Enterprise SDK extension workflows](references/extension-workflows.md) to choose a build command, verify the package, and distinguish uploading, registration, enablement, and activation. A successful build establishes none of the last three states.
- If deployment is in scope, capture baseline behavior and the current configuration on the intended staging site. Identify the version-specific disable or rollback mechanism and which services it could affect. A registration, update, or removal can activate behavior or restart dependent services.

## How to query documentation

Use the [Enterprise SDK](https://developers.arcgis.com/enterprise-sdk/) and its release selector for prerequisites, API reference, and supported service types. Use the [Esri Enterprise SDK resources repository](https://github.com/Esri/arcgis-enterprise-sdk-resources) for sample projects and service fixtures. Pick the release branch or SDK-installed sample that matches the target. Confirm the selected sample's SDK dependency and README even when the repository links to a newer API guide. See [sample selection by extension type](references/extension-workflows.md) for starting points.

The Esri developer MCP has no dedicated Enterprise SDK focus. When available, use `developers` for discovery, then confirm the operation and toolchain in the version-specific SDK guide.

## Validation process

1. **Compatibility and build.** Record target release, platform, topology, service type, toolchain, sample revision, and artifact type. Check Maven, .NET, or Node dependencies against the target SDK. Run the relevant local tests and build from the supported template. Check the expected artifact, configuration, version, and required dependencies.
2. **Behavior before deployment.** Test normal and invalid inputs with a small known-answer fixture. For external dependencies, test timeout, unavailable data, and retry behavior. For interceptors, test the targeted operation and an unchanged pass-through path. Record what can be demonstrated with fixtures or mocks.
3. **Deploy and exercise staging when authorized.** Compare against a baseline recorded before the change. Verify deployment, registration, enablement or activation as applicable. Test from the intended client with an allowed and a denied caller. Confirm results, response schema, service logs, and relevant latency or concurrency behavior. For multiple server machines, verify consistent behavior across eligible instances when the topology supports it.
4. **Recovery and release.** Identify the supported disable or rollback steps, then verify baseline behavior after recovery on staging when the test permits it. Record the artifact and configuration used, observed results, and any unrun checks. Report packaging, staging activation, production deployment, and client verification separately.
