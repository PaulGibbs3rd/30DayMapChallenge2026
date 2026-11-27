# Day 27 · ArcGIS Agent Skills Extension

November 27, 2026 · New tool

Day 27 extends Esri’s ArcGIS agentic developer toolkit with three portable skills for ArcPy, the ArcGIS Pro SDK for .NET, and the ArcGIS Enterprise SDK. The same folders work with tools that support the open Agent Skills format. [Day 27 page](index.html) · [Download the ZIP](arcgis-developer-skills.zip) · [Official challenge](https://30daymapchallenge.com/2026/)

## Skills

| Skill | Example task |
| --- | --- |
| [ArcPy](skills/build-with-arcpy/index.html) | Create a Pro script tool that filters a feature class and writes a new output to a scratch geodatabase. [ArcPy documentation](https://doc.esri.com/en/arcgis-pro/latest/arcpy/get-started/what-is-arcpy-.html) |
| [ArcGIS Pro SDK for .NET](skills/build-with-arcgis-pro-sdk/index.html) | Build a .NET add-in that reads the current selection and uses the documented Pro threading model. [ArcGIS Pro SDK documentation](https://doc.esri.com/en/arcgis-pro/latest/sdk/index.html) |
| [ArcGIS Enterprise SDK](skills/build-with-arcgis-enterprise-sdk/index.html) | Choose and package a server extension for a specified ArcGIS Enterprise release and target service. [ArcGIS Enterprise SDK documentation](https://developers.arcgis.com/enterprise-sdk/) |

## Install

Extract the ZIP and add the complete skill folders to your agent alongside Esri’s toolkit skills. Use your agent’s import or folder-discovery instructions. For a tool without native Agent Skills support, provide the Markdown instructions and relevant references as task context. [Setup guide](INSTALL.md) · [Agent Skills format](https://agentskills.io/specification) · [Esri toolkit setup](https://developers.arcgis.com/ai/arcgis-agentic-developer-toolkit/get-started/install-and-set-up/)

## Validation

Each skill includes a validation process with explicit pass criteria for its real entry point and a worked example or fixture in its implementation reference. All three skills passed frontmatter validation. A sample .NET 10 CoreHost project compiled against ArcGIS Pro 3.7.1. The standalone ArcPy test stopped at license initialization. ArcGIS Pro add-in behavior and ArcGIS Enterprise deployment remain unverified.

Regenerate the review pages and ZIP with `python day27/scripts/render-skills.py` in an environment with `markdown-it-py`.

## Credits

This is an independent Day 27 release. The skills follow the structure of the Esri Developer Agent Skills toolkit at upstream commit `817bf39` and are made available under Apache 2.0. The distribution contains the setup guide, skill instructions, and reference material. [Upstream source](https://github.com/Esri/esri-developer-agent-skills/tree/817bf39) · [License](LICENSE.txt) · [Attribution notice](NOTICE.txt)
