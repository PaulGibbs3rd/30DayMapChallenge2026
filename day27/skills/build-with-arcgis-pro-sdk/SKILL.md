---
name: build-with-arcgis-pro-sdk
license: Apache-2.0
description: Use for ArcGIS Pro SDK for .NET add-ins, DAML, dockpanes, map tools, managed configurations, plug-in data sources, and CoreHost applications. Covers version-matched setup, Pro threading, SDK editing and geoprocessing, packaging, and in-host validation.
---

# Build with ArcGIS Pro SDK for .NET

Use this SDK to extend ArcGIS Pro or build a standalone CoreHost application with supported Pro Core APIs. Use ArcPy for Python map automation or a Python geoprocessing tool. Use ArcGIS Maps SDK for .NET when the app needs its own map or scene UI outside ArcGIS Pro.

## Application requirements

Identify the Pro release and deployment environment, the user's entry point, and the datasets, portal services, or Pro capabilities the change depends on. Review existing `.sln`, `.csproj`, `Config.daml`, SDK references, and build profiles before changing them. Reuse the shared ArcGIS requirements skill if the choice of application or service remains unresolved.

| Need | SDK project type |
| --- | --- |
| Add a command, map tool, dockpane, or editing workflow inside Pro | Add-in |
| Customize the Pro startup experience or application shell | Managed configuration |
| Expose a custom source as data Pro can use | Plug-in data source |
| Use supported Core geometry or geodatabase APIs in a standalone process | CoreHost |

## Installation, licensing, and authentication

- Align the SDK, .NET target, architecture, IDE, and Pro assembly references with the supported **target Pro release**. Verify the requirements in the official SDK guide and select the right SDK extension or template for the supported IDE. Preserve the existing project's compatible references and packaging pipeline.
- Use the target release's public assembly inventory. Add-ins reference `ArcGIS.Desktop.Framework.dll`, and the task determines which public Core and extension assemblies are also needed. For file-based Pro assembly references, preserve the SDK template's Copy Local setting of false. For add-ins or configurations already using `Esri.ArcGISPro.Extensions30`, use the matching release with `PackageReference` and avoid mixing it with duplicate file references.
- Start new work from the matching Esri project and item templates. Check the project’s `Config.daml` desktop version, stable IDs, component class names, and command placement. Use the official DAML ID reference for built-in Pro elements.
- Check the Pro license and extensions needed for the workflow separately from access to portal items or enterprise data. Prefer the documented host portal session when an in-Pro workflow calls protected resources. When the workflow adds a sign-in flow or uses new protected services, follow the project's access model and the shared ArcGIS authentication guidance.
- For CoreHost, verify the runtime installation, license, and supported platform for the target release. The manual console project pattern uses x64 and an `[STAThread]` entry point. Initialize `ArcGIS.Core.Hosting.Host` before constructing Core objects. [CoreHost setup](https://github.com/Esri/arcgis-pro-sdk/wiki/ProConcepts-CoreHost)

## Patterns and guidelines

- Use the API reference to identify calls that require the main CIM thread (MCT). Use `await QueuedTask.Run(...)` for those calls inside Pro. Keep UI updates on the WPF dispatcher and unrelated I/O off the MCT. Avoid synchronous blocking of either thread.
- Validate the active map, target layer, and selection at execution time. Use DAML conditions for UI availability where appropriate. Preserve the current selection and project state except where the requested workflow changes them.
- Apply the host’s edit workflow for map edits. Use `EditOperation` where supported and inspect success and errors before showing a success message. For CoreHost, follow the datastore’s transaction API. Dispose geodatabase resources at their proper scope.
- See [Pro SDK implementation workflows](references/workflows.md) for DAML and WPF lifecycle, map tools, editing, asynchronous geoprocessing, and release artifacts.

## How to query documentation

Use the [ArcGIS Pro .NET API Reference](https://doc.esri.com/en/arcgis-pro/latest/sdk/api-reference/topic1.html) to verify the public assembly, exact member signature, threading annotation, and release requirements. Check the version shown at the top of the page. Use the [Esri SDK repository table of contents](https://github.com/Esri/arcgis-pro-sdk?tab=readme-ov-file#table-of-contents) to find ProConcepts for design and lifecycle, ProGuides for setup and workflow, ProSnippets for API examples, and [community samples](https://github.com/Esri/arcgis-pro-sdk-community-samples) for complete projects. Use [repository tags](https://github.com/Esri/arcgis-pro-sdk/tags) and the [installation and upgrade guide](https://github.com/Esri/arcgis-pro-sdk/wiki/ProGuide-Installation-and-Upgrade) to align examples with the target release.

If the Esri developer MCP is available, search with `pro-sdk` and the exact API name, then verify the result against the target-release API reference. A standalone skill install does not configure the MCP server.

## Validation process

1. **Build with the target toolchain.** Restore and build with the supported SDK, .NET target, and configuration. Verify member availability and assembly packaging against the target API reference. Check DAML-to-class wiring and the expected output package or executable. A CoreHost compile does not establish that an add-in packages or loads.
2. **Load in Pro or the CoreHost runner.** For an add-in, install or debug the built package in the target Pro release, confirm Pro discovers the intended package in Add-In Manager and its command is available, and open a disposable project with representative data. For a managed configuration or plug-in data source, exercise the actual startup or Catalog entry point. For CoreHost, prove that `Host.Initialize()` succeeds in the intended runner and execute a minimal Core operation.
3. **Exercise valid and invalid context.** Run the command or tool with the intended map and selection. Check missing or unsupported layers, empty selections, and cancellation where available. Verify button or pane state, thread-sensitive behavior, and that errors are visible without leaving stale UI or unhandled exceptions.
4. **Check side effects and access.** Verify expected edits or outputs, failure behavior, and undo and redo when Pro supports them for that workflow. When a workflow uses protected resources, test the intended signed-in account and a caller without the required access. Test any registered package or signing policy relevant to distribution.
5. **Record evidence.** Report the SDK and Pro releases, configuration, artifact path, entry point tested, and pass, fail, or not run for build, load, and behavior. If the required Pro host or license is unavailable, report the specific limitation.
