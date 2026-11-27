# Set up the ArcGIS Agent Skills Extension

These three skills extend Esri’s ArcGIS agentic developer toolkit with guidance for ArcPy, ArcGIS Pro SDK for .NET, and ArcGIS Enterprise SDK. The bundle uses the open [Agent Skills format](https://agentskills.io/specification).

## In a skill-compatible agent

1. Extract the ZIP and choose the folders you need under `skills/`. Each folder contains `SKILL.md` and a `references/` directory.
2. Use your agent’s skill import or documented skills directory. Preserve the folder name and the relative paths inside it.
3. Select the imported skill or ask for it by its name, such as `build-with-arcpy`. Verify the agent can open both the skill instructions and its workflow reference.

See the [Agent Skills client showcase](https://agentskills.io/clients) for examples of clients that support the format. For an agent without built-in skill loading, attach or expose the required Markdown files and ask the agent to follow the skill for the task.

## Alongside Esri’s toolkit

Use [Esri’s setup guide](https://developers.arcgis.com/ai/arcgis-agentic-developer-toolkit/get-started/install-and-set-up/) for the official skills and the documentation MCP server. Install the three extension folders alongside the existing skills. If you maintain a toolkit checkout, copy the directories into its `skills/` folder and follow the toolkit’s normal setup for your client.

The extension skills can consult the Esri documentation MCP server when the agent has it configured. The linked Esri documentation also works as a source for agents with web access. Running the workflows requires the relevant ArcGIS software, licenses, and resource access.

[Esri Developer Agent Skills source](https://github.com/Esri/esri-developer-agent-skills) · [Apache 2.0 license](LICENSE.txt) · [Attribution notice](NOTICE.txt)
