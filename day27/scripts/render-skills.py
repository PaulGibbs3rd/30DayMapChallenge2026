from html import escape
from os.path import relpath
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

from markdown_it import MarkdownIt

DAY = Path(__file__).resolve().parents[1]
SKILLS = (
    ("ArcPy", DAY / "skills/build-with-arcpy/SKILL.md"),
    ("ArcGIS Pro SDK for .NET", DAY / "skills/build-with-arcgis-pro-sdk/SKILL.md"),
    ("ArcGIS Enterprise SDK", DAY / "skills/build-with-arcgis-enterprise-sdk/SKILL.md"),
)
REFERENCES = (
    ("ArcPy implementation workflows", SKILLS[0][1].parent / "references/workflows.md"),
    ("Pro SDK implementation workflows", SKILLS[1][1].parent / "references/workflows.md"),
    ("Enterprise SDK extension workflows", SKILLS[2][1].parent / "references/extension-workflows.md"),
)
PAGES = {
    **{source: source.with_name("index.html") for _, source in SKILLS},
    **{source: source.with_suffix(".html") for _, source in REFERENCES},
}
MARKDOWN = MarkdownIt("commonmark", {"html": False}).enable("table")


def relative_url(target, directory):
    return Path(relpath(target, directory)).as_posix()


def render(title, source):
    output = PAGES[source]
    root = output.parent
    markdown = source.read_text(encoding="utf-8")
    if markdown.startswith("---\n"):
        _, _, markdown = markdown.split("---", 2)

    tokens = MARKDOWN.parse(markdown)
    for block in tokens:
        for token in block.children or ():
            if token.type == "link_open":
                href = token.attrGet("href")
                if href and href.startswith("references/"):
                    target = (source.parent / href).resolve()
                    token.attrSet("href", relative_url(PAGES[target], root))
    body = MARKDOWN.renderer.render(tokens, MARKDOWN.options, {})

    navigation = []
    for label, path in SKILLS:
        link = relative_url(PAGES[path], root)
        current = ' aria-current="page"' if path == source else ""
        navigation.append(f'      <a href="{link}"{current}>{escape(label)}</a>')
    links = "\n".join(navigation)
    output.write_text(
        f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#152d29">
  <title>{escape(title)} · Day 27</title>
  <link rel="stylesheet" href="{relative_url(DAY / 'style.css', root)}">
</head>
<body>
  <header class="masthead">
    <nav class="wrap top" aria-label="Day 27 navigation">
      <a href="{relative_url(DAY / 'index.html', root)}">← Day 27 skills</a>
      <a href="{relative_url(source, root)}">View Markdown source</a>
    </nav>
  </header>
  <main class="wrap skill-copy">
    <nav class="skill-nav" aria-label="Skill pages">
{links}
    </nav>
    <article>
{body}    </article>
  </main>
</body>
</html>
""",
        encoding="utf-8",
        newline="\n",
    )


for title, source in (*SKILLS, *REFERENCES):
    render(title, source)

with ZipFile(DAY / "arcgis-developer-skills.zip", "w") as archive:
    for source in sorted([*PAGES, DAY / "INSTALL.md", DAY / "LICENSE.txt", DAY / "NOTICE.txt"]):
        member = ZipInfo(source.relative_to(DAY).as_posix())
        archive.writestr(member, source.read_bytes(), compress_type=ZIP_DEFLATED)
