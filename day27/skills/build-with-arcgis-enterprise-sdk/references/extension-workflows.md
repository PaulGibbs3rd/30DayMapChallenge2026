# ArcGIS Enterprise SDK extension workflows

Use the section for the intended extension and select the same release as the target deployment in the official documentation. Check installation and deployment prerequisites separately.

| Extension | Typical artifact | Test first |
| --- | --- | --- |
| Java or .NET SOE or SOI | `.soe` | Published service type, operation contract, native permissions |
| Java service interceptor | `.interceptor` | URL scope, chain ordering, pass-through, and deployment topology |
| Custom data feed | `.cdpk` | Provider schema, stable identifiers, query support, and upstream failures |
| Enterprise custom MCP tool | `.mcp` | Validated input and output schema, caller eligibility, and retry behavior |

## Choose a release-matched sample

Start with Esri’s [Enterprise SDK sample catalog](https://github.com/Esri/arcgis-enterprise-sdk-resources/tree/master/Samples). Use the target release's sample branch when available, such as [11.5](https://github.com/Esri/arcgis-enterprise-sdk-resources/tree/release-v11.5.0), or the samples bundled with the target SDK. Verify the sample's project dependencies and required service capabilities before adapting or building it. Record the sample branch or commit in validation notes.

| Extension | Starting point |
| --- | --- |
| SOE or SOI | Select the Java or .NET project and matching service fixture from the [sample catalog](https://github.com/Esri/arcgis-enterprise-sdk-resources/tree/master/Samples). For a Java REST SOE, the [official Maven walkthrough](https://developers.arcgis.com/enterprise-sdk/guide/java/build-rest-soes-using-the-maven-command/) describes the archetype and package. |
| Service interceptor | The [audit-log sample](https://github.com/Esri/arcgis-enterprise-sdk-resources/tree/master/Samples/service-interceptors/AuditLogInterceptor) illustrates the request lifecycle. Adapt URL scope and logged fields to the intended service and data policy. |
| Custom data feed | The [read-only CSV point provider](https://github.com/Esri/arcgis-enterprise-sdk-resources/tree/master/Samples/custom-data-feeds/csv-full-fetch-read-only-points) provides a small starting point for testing field mapping and geometry. |
| Custom MCP tool | Use the archetype and examples linked from the [Enterprise MCP API reference](https://developers.arcgis.com/enterprise-sdk/api-reference/mcp/). Match its release and JDK to the server. |

## Server object extensions and interceptors

- For Java, use the SDK's release-matched `install-maven-artifacts` script and choose the official project archetype. For a REST SOE the documented archetype is `rest-soe-archetype`. Build the generated project with the documented Maven lifecycle and check for the `.soe` in its output. For .NET, use the matching SDK Visual Studio template and build through the project’s packaging target.
- For an SOE, define the published operations, parameters, output shape, and errors. For an SOI, preserve the behavior and contract of unaffected operations, including the service’s existing authorization checks. Treat native geodatabase and server objects as scoped resources and follow the extension lifecycle for initialization and cleanup.
- Use the service fixture requested by the chosen sample. The catalog describes USA and vegetation map-image services using the installed `EnterpriseSDKSampleData.zip` where provided. For a disposable staging run, publish the matching fixture from ArcGIS Pro, capture the service capabilities and a representative response, then compare before and after enablement. Check the intended custom operation or interception, existing operations, denied access, and release-appropriate capabilities. ArcGIS Server Manager and Enterprise Manager have different workflows. Registration and per-service enablement are distinct. Inspect server logs if registration or activation fails, and verify impact before updating or removing a shared extension.

[Java SDK installation](https://developers.arcgis.com/enterprise-sdk/guide/java/install-the-maven-artifacts/) · [Java REST SOE build](https://developers.arcgis.com/enterprise-sdk/guide/java/build-rest-soes-using-the-maven-command/) · [.NET SDK installation](https://developers.arcgis.com/enterprise-sdk/guide/net/installation-net/) · [Java deployment](https://developers.arcgis.com/enterprise-sdk/guide/java/deploy-extensions-java/) · [.NET deployment](https://developers.arcgis.com/enterprise-sdk/guide/net/deploy-extensions-net/) · [Service enablement](https://developers.arcgis.com/enterprise-sdk/guide/net/enable-extensions-net/)

## Service interceptors

- Use the Java interceptor template for the release. A service interceptor receives REST request and response data through its handler framework. For a workflow that needs service internals, check whether a service-level SOI is applicable.
- Limit URL patterns to the intended staging endpoints. Check chain order, propagation through the chain, and the response when a dependency is unavailable. Confirm how the release handles supported protocols and multiple machines. Registration can activate interception for matching requests.
- Verify at least one matching request and one nonmatching request, plus safe failure behavior with existing authorization. Compare latency with the baseline. Confirm the documented disable or removal procedure before deploying across a wider scope.

[Service interceptor guide](https://developers.arcgis.com/enterprise-sdk/guide/service-interceptors/) · [Create and deploy service interceptors](https://developers.arcgis.com/enterprise-sdk/guide/service-interceptors/create-deploy-service-interceptors/) · [Service interceptor FAQ](https://developers.arcgis.com/enterprise-sdk/guide/service-interceptors/faq/)

## Custom data feeds

- Use the supported Node.js and custom data feeds tooling. Generate or inspect the provider, its dependencies, and its `cdconfig.json`. Choose the documented service parameter format for the target release and keep upstream credentials in an appropriate configuration or secret store. Validate field names and types, stable feature IDs, geometry, and spatial reference with small upstream fixtures.
- Test in the local custom data app, including the query operations the exposed feature service claims to support. In the custom data app directory, use the documented `cdf export <name>` workflow when packaging a `.cdpk`. Registration and service creation require the relevant server privileges.
- In staging, query the published service with representative filters, ordering, and pagination where supported. For a read-only CSV point provider, prepare three rows with known coordinates and stable IDs, with two rows matching a chosen filter. Verify unfiltered and filtered results, field values, and point locations. Confirm attempted writes fail under the documented read-only configuration. Check a slow or unavailable upstream source and compare feature counts and identifiers with the fixture. Inspect the rollback instructions because unregistering a provider can affect its dependent services.

[Custom data feeds guide](https://developers.arcgis.com/enterprise-sdk/guide/custom-data-feeds/) · [Custom Data CLI](https://developers.arcgis.com/enterprise-sdk/guide/custom-data-feeds/custom-data-cli-reference/) · [Build a custom data package](https://developers.arcgis.com/enterprise-sdk/guide/custom-data-feeds/build-a-custom-data-package-file/) · [Register a provider](https://developers.arcgis.com/enterprise-sdk/guide/custom-data-feeds/register-a-custom-data-provider/)

## Enterprise custom MCP tools

- Check the supported Enterprise release, deployment platform, JDK, and version of the MCP Maven artifacts. Use the official archetype to implement one `IMCPTool` per `.mcp` package. Define input and output schemas and keep per-call state in the execution context or local variables.
- Test the tool’s list and call behavior with appropriate caller permissions. Verify malformed input, concurrent calls, and any operation with side effects. Enable retries only for operations that can safely run again. Preserve the tool and catalog access model when updating an existing deployment.
- Package with the official Maven build, then verify discovery and invocation in the intended staging catalog after deployment. Distinguish deployment mechanics for the release from the client’s configuration of the connected server.

[Enterprise MCP API, lifecycle, and supported releases](https://developers.arcgis.com/enterprise-sdk/api-reference/mcp/)
