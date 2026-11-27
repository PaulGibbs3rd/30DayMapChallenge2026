# ArcPy implementation workflows

Use the workflow for the requested deliverable and the documentation for its ArcGIS release.

## Geoprocessing and spatial data

- Use toolbox-qualified calls such as `arcpy.analysis.Buffer` and `arcpy.management.CopyFeatures`. Inspect the documentation for parameters the tool can leave at defaults and those that need domain-specific choices. Check `Result` outputs and warnings when a later step depends on them. Use `arcpy.GetMessages(2)` promptly when handling `arcpy.ExecuteError`, and propagate the failure to the caller.
- For projected outputs, distinguish assigning known coordinate-system metadata from actually transforming coordinates. Use `Project` for features and `Project Raster` for rasters when appropriate. Choose a supported geographic transformation for the area and accuracy requirement if the datums differ. Check whether the required coordinate-system grid files are present. For rasters, choose snap raster, alignment, cell size, extent, and resampling appropriate to the source values.
- Use a file geodatabase when the workflow depends on domains, geodatabase field types, or schema that does not survive a simpler export format. Verify output names are valid for the actual workspace. Inspect the workspace’s SQL dialect and active filters before reusing a where clause across stores.
- Scope temporary outputs to the run when a job may be retried or run in parallel. For required edit sessions, confirm the data store and versioning model before choosing an `arcpy.da.Editor` pattern. Keep cursors inside one edit operation and release them before schema changes.

[Python and geoprocessing](https://doc.esri.com/en/arcgis-pro/latest/help/analysis/geoprocessing/basics/python-and-geoprocessing.html) · [EnvManager](https://doc.esri.com/en/arcgis-pro/latest/arcpy/classes/envmanager.html) · [Project](https://doc.esri.com/en/arcgis-pro/latest/tool-reference/data-management/project.html) · [Editor](https://doc.esri.com/en/arcgis-pro/latest/arcpy/data-access/editor.html)

## Script tools and Python toolboxes

- Match each script-tool parameter’s order, type, direction, and optional status to the toolbox. Use `GetParameter` for typed values and `GetParameterAsText` for text values. Set output parameters with `SetParameter` or `SetParameterAsText` as required. For a derived output tied to an edited input, set the parameter dependency and return the resulting data.
- In a `.pyt`, define `arcpy.Parameter` objects in `getParameterInfo` and read their values inside `execute`. Keep validation lightweight and avoid doing geoprocessing at import time. Report messages through the geoprocessing interface. Confirm the tool works from Pro and from any programmatic caller the project supports.

[Script tool parameters](https://doc.esri.com/en/arcgis-pro/latest/arcpy/functions/getparameterastext.html) · [SetParameterAsText](https://doc.esri.com/en/arcgis-pro/latest/arcpy/functions/setparameterastext.html) · [Python toolboxes](https://doc.esri.com/en/arcgis-pro/latest/arcpy/geoprocessing_and_python/a-quick-tour-of-python-toolboxes.html)

## Projects, layouts, and exports

- Use `arcpy.mp.ArcGISProject("CURRENT")` in a supported in-app context and an explicit `.aprx` path in a standalone process. Select the intended map and layout by a verified name or stable project convention. Check for missing and ambiguous matches, broken data sources, and read-only project state.
- Save a derivative with `saveACopy` where appropriate; reopen the resulting project when validating it. Use the export API supported by the target release. Verify map frame extent, scale, page size, legend, and expected output files against the requested layout.

[ArcGISProject](https://doc.esri.com/en/arcgis-pro/latest/arcpy/mapping/arcgisproject-class.html) · [Layout](https://doc.esri.com/en/arcgis-pro/latest/arcpy/mapping/layout-class.html)

## Publishing and server execution

- Choose the matching sharing draft for the intended item or service. Confirm the portal or server, target folder, ownership or publishing permissions, registered versus copied data, overwrites, and audience. For a web tool or geoprocessing service, use a successful, representative execution as required by the publishing workflow.
- Inspect analyzer messages when staging and resolve errors. Verify which Python environment, libraries, file paths, and permissions are available on the server. Replace assumptions about a signed-in desktop session or a mapped desktop drive with paths accessible to the actual server process.
- When publication is in scope, upload the staged definition to the intended environment and run the service with the expected caller. Verify the result and any long-running, asynchronous, or failure path the service exposes.

[ArcPy sharing](https://doc.esri.com/en/arcgis-pro/latest/arcpy/sharing/introduction-to-arcpy-sharing.html) · [Publish web tools using Python](https://doc.esri.com/en/arcgis-pro/latest/help/analysis/geoprocessing/share-analysis/publishing-web-tools-in-a-python-script.html) · [Authoring with Python scripts](https://doc.esri.com/en/arcgis-pro/latest/help/analysis/geoprocessing/share-analysis/authoring-geoprocessing-services-with-python-scripts.html)
