# Pro SDK implementation workflows

Check method signatures, threading requirements, and sample compatibility against the project's Pro release.

## Find the right API and example

| Workflow | Start with |
| --- | --- |
| Add-in shell, DAML, or threading | [Framework concepts](https://github.com/Esri/arcgis-pro-sdk/wiki/ProConcepts-Framework) and [asynchronous programming](https://github.com/Esri/arcgis-pro-sdk/wiki/ProConcepts-Asynchronous-Programming-in-ArcGIS-Pro) |
| Selection, map content, or layout export | [Feature selection guide](https://github.com/Esri/arcgis-pro-sdk/wiki/ProGuide-Feature-Selection), [map authoring](https://github.com/Esri/arcgis-pro-sdk/wiki/ProConcepts-Map-Authoring), or [layouts](https://github.com/Esri/arcgis-pro-sdk/wiki/ProConcepts-Layouts) |
| Geometry or geodatabase logic | [Geometry concepts](https://github.com/Esri/arcgis-pro-sdk/wiki/ProConcepts-Geometry) and [geodatabase concepts](https://github.com/Esri/arcgis-pro-sdk/wiki/ProConcepts-Geodatabase) |

The [API reference assembly inventory](https://doc.esri.com/en/arcgis-pro/latest/sdk/api-reference/topic1.html) lists Core assemblies under Pro's `bin` and public subsystems under `bin/Extensions`. Use documented public types. For an add-in, check `ArcGIS.Desktop.Framework.dll` first; add the documented extension references needed for the feature. CoreHost uses the supported Core APIs and host initialization. The [Extensions NuGet guide](https://github.com/Esri/arcgis-pro-sdk/wiki/ProGuide-ArcGIS-Pro-Extensions-NuGet) explains the supported alternative to file-based references for add-ins and configurations.

## Commands, dockpanes, and map tools

- Start with Esri's matching item template. Verify `Config.daml` names the intended module, class, and UI location. Keep existing IDs when modifying a shipped command. Check the DAML reference before calling built-in commands.
- Put ArcGIS event subscriptions and cleanup in the appropriate module or pane lifecycle. For a dockpane, use WPF bindings and existing MVVM conventions. Keep UI updates on the dispatcher. For a map tool, use the tool lifecycle and appropriate drawing or sketch mode, and verify coordinate conversion against the active map.
- On the MCT, keep the operation focused on the Pro state it needs. Capture a stable dataset identifier, field value, or plain result while the object is valid. Avoid retaining live cursors or rows across UI interactions. Check stale context after asynchronous work if the map or selection may have changed.

[Pro Framework and threading](https://github.com/Esri/arcgis-pro-sdk/wiki/ProConcepts-Framework) · [DAML IDs](https://github.com/Esri/arcgis-pro-sdk/wiki/ArcGIS-Pro-DAML-ID-Reference)

## Mapping, editing, and geoprocessing

- Work with the intended `MapView`, `Map`, layout, and layer type. Verify selectability, editability, schema, and spatial reference before processing features. Use the documented coordinate and geometry APIs for measurement or projection.
- Group edits that users should undo together in one supported `EditOperation`. Read its error message when execution fails and avoid reporting partial work as complete. For CoreHost datastore edits, check the datastore’s `Geodatabase.ApplyEdits` guidance and applicability before choosing a transaction pattern.
- For geoprocessing from Pro, use the release-matched `Geoprocessing.ExecuteToolAsync` pattern and the tool’s required parameter order or value array. Inspect result status and messages and handle canceled and failed runs. Add outputs to the map only when the workflow expects that behavior.

[Geodatabase concepts](https://github.com/Esri/arcgis-pro-sdk/wiki/ProConcepts-Geodatabase) · [Editing concepts](https://github.com/Esri/arcgis-pro-sdk/wiki/ProConcepts-Editing) · [Geoprocessing concepts](https://github.com/Esri/arcgis-pro-sdk/wiki/ProConcepts-Geoprocessing)

## Build, packaging, and regression checks

- Build through the existing project or the documented SDK template. Check `.esriAddinX` for add-ins and `.proConfigX` for managed configurations. Follow the selected template for packaging a plug-in data source or deploying a CoreHost app. Check organizational trust or signing policy on the receiving machine.
- Run in the actual Pro host with the debugger, a disposable `.aprx`, and known selections. For a tool that reads a selection, use two selected features and a separate unselected feature. Confirm the output includes only the two selected IDs. Clear the selection and verify the supported empty-state behavior. For a write tool, use a copy, verify changed values, and test undo and redo where available.
- If the package builds but Pro does not load it, check registration or the configured add-in folder, trust policy, and the `desktopVersion` requirement. If the package loads but a control is absent, check `defaultAssembly`, `defaultNamespace`, DAML IDs, and class names. If a call throws `CalledOnWrongThreadException`, verify the method's threading annotation and queue the related MCT calls together. [Esri add-in diagnostics](https://github.com/Esri/arcgis-pro-sdk/wiki/ProGuide-Diagnosing-ArcGIS-Pro-Add-ins)
- Use ordinary unit tests for pure logic. Use the SDK's established in-host regression-testing pattern when a test must exercise Pro or its data APIs. Report compile-only and in-host results separately.

[Build your first add-in](https://doc.esri.com/en/arcgis-pro/latest/sdk/api-reference/conceptdocs/docs/ProGuide-Build-your-first-add-in.html) · [CoreHost](https://github.com/Esri/arcgis-pro-sdk/wiki/ProConcepts-CoreHost) · [Pro regression testing](https://github.com/Esri/arcgis-pro-sdk/wiki/ProGuide-Regression-Testing)
