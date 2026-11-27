---
name: build-with-arcpy
license: Apache-2.0
description: Use to build or troubleshoot ArcPy scripts, geoprocessing tools, Python toolboxes, geodatabase edits, raster and vector analysis, ArcGIS Pro map and layout automation, or publishing with arcpy.sharing. Covers ArcGIS Pro and ArcGIS Server Python execution, licensing, and output validation.
---

# Build with ArcPy

Use ArcPy for ArcGIS geoprocessing, GIS data management, and ArcGIS Pro project automation. Work centered on the `arcgis` package, portal administration, or hosted item management belongs with the ArcGIS API for Python skill. A workflow can use both packages when it needs both operations.

## Application requirements

Identify the deliverable and how it will run: in Pro, as a script tool or Python toolbox, as a standalone or scheduled script, or as a published geoprocessing task. Inspect existing tool definitions, scripts, inputs, and expected outputs before changing them. Confirm the ArcGIS release, actual execution identity, data locations, and whether the task creates outputs, edits existing data, or publishes a resource. Use the shared ArcGIS requirements skill when an app or service has unresolved requirements.

## Installation, licensing, and authentication

- Run with the ArcPy environment for the target ArcGIS release. ArcGIS Pro includes `arcgispro-py3`. Use Pro's Python Command Prompt, `propy.bat`, or the project’s existing compatible interpreter. Clone the default environment before adding dependencies. For a supported separate environment, follow Esri’s release-matched conda instructions.
- Check the selected tool’s license level and extension requirements. Use `CheckExtension` or `CheckProduct` as applicable before work that could otherwise fail partway. Only call `CheckOutExtension` when the target licensing model requires it, and release what the script checked out.
- Verify licensing under the identity that runs the script, especially for scheduled jobs or a server. An import error such as “The Product License has not been initialized” calls for checking [standalone authorization](https://doc.esri.com/en/arcgis-pro/latest/arcpy/get-started/installing-python-for-arcgis-pro.html) before debugging GIS code.
- A local file workflow uses the runtime’s license. Portal sign-in, data-store permissions, and publishing privileges apply separately. For protected services or publishing, use the project’s supported authentication flow and the shared ArcGIS authentication skill when available.

A read-only environment probe for the actual interpreter:

```python
import sys
import arcpy

print(sys.executable)
print(arcpy.GetInstallInfo()["Version"])
print(arcpy.ProductInfo())
```

## Patterns and guidelines

- Inspect inputs with `arcpy.Exists`, `Describe`, and `ListFields`. Confirm geometry, spatial reference, schema, and output workspace. When the task uses a layer, account for its selection and definition query. Use explicit dataset paths when the whole dataset is intended.
- Verify the documented tool signature, licenses, and environments for the target release. Use unit-bearing parameters where supported and scope the relevant settings with `arcpy.EnvManager`. Make the datum transformation, measurement method, and raster grid policy explicit where they affect results.
- Write intermediate results to a scratch workspace and give deliverables explicit output paths. Preserve the intended overwrite behavior. Use context-managed `arcpy.da` cursors with a narrow field list and an edit session when required by the dataset. Surface geoprocessing errors and warnings to the actual caller.
- Keep analysis logic separate from toolbox, command-line, and server adapters when the same logic runs in several contexts. Use the applicable workflow in [ArcPy implementation workflows](references/workflows.md) for script tools, transactions, map exports, and publication.

## How to query documentation

Start with [Introduction to ArcPy](https://doc.esri.com/en/arcgis-pro/latest/arcpy/get-started/what-is-arcpy-.html) and the tool reference for the **target runtime release**. Check the syntax, license, environments, and usage notes before using an unfamiliar tool. [Install ArcPy](https://doc.esri.com/en/arcgis-pro/latest/arcpy/get-started/installing-arcpy.html), [licenses and extensions](https://doc.esri.com/en/arcgis-pro/latest/arcpy/geoprocessing_and_python/accessing-licenses-and-extensions-in-python.html), and [ArcPy data access](https://doc.esri.com/en/arcgis-pro/latest/arcpy/data-access/what-is-the-data-access-module-.html) cover the main prerequisites. The Esri developer MCP has no dedicated ArcPy focus. A direct ArcGIS Pro or ArcGIS Server tool reference is the authority for version-specific behavior.

## Validation process

1. **Runtime and prerequisites.** Run the probe with the intended interpreter and execution identity. Confirm the required license, extension, input visibility, and scratch workspace access. Check syntax separately so an unavailable license can be distinguished from invalid Python.
2. **Known-answer run.** Use a small, disposable dataset with known expected results. For example, filter three input features where two satisfy the condition. Verify the two expected records by stable ID, required fields and geometry, spatial reference, and the destination path. Check a representative raster’s cell size, alignment, NoData, and output values when relevant.
3. **Failure and rerun.** Exercise a missing or unsupported input and an existing output. Confirm that the script reports the cause, applies the intended overwrite policy, and leaves input data intact. For edits, check rollback on a disposable datastore if the operation is meant to be atomic.
4. **Real entry point.** Run the tool through the intended toolbox, standalone runner, or staged service. Verify parameter validation, derived outputs, messages, and caller-visible errors. Open map and layout outputs to confirm the expected layers, extent, and export. For a published tool, check an authorized caller can submit a job and retrieve the expected result.
5. **Record evidence.** State the tested ArcGIS and Python versions, fixture, observed output, and any unrun checks. Syntax, import, tool execution, and deployed behavior are separate results.
