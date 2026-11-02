# Challenge directory

The directory is the public landing page for Paul Gibbs's 2026 map challenge collection. The repository root forwards visitors to [index.html](index.html).

Every day has a theme, a project description, an honest implementation status, a link to its source folder on GitHub, a relative link to its GitHub Pages page, and project notes. Day 1 is complete. The remaining days currently open styled placeholder pages.

## Maintain the collection

Edit [days.json](days.json), then run `npm run check` from the repository root. That command regenerates `directory/index.html` from [template.html on GitHub](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/blob/main/directory/template.html) and checks the Pages artifact. Keep the generated HTML checked in so the source preview also works without a build step.

| Field | Meaning |
| --- | --- |
| `day`, `date`, `theme` | The challenge's day number, November 2026 date, and theme. |
| `title` | The actual map title; use the theme while its subject is undecided. |
| `description` | A short, original description of the project or planned theme. |
| `status` | `complete` for an implemented map, or `planned` for a placeholder. |
| `tags` | Optional tools or topics for completed maps; included in search. |
| `image` | Optional preview-image path, relative to this directory. |

Top-level `repository`, `branch`, and `pagesBase` set the source-link destination and expected hosting address. The current template features Day 1 at the top; revise that editorial section when another featured project is desired.

## Files

- `template.html`: page structure and featured-map section.
- `index.html`: generated, accessible HTML containing all 30 cards.
- `days.json`: the collection metadata.
- `directory.js`: progressive search and status filters. All entries and links remain available with JavaScript disabled.
- `style.css`: collection layout and responsive styling.
- `placeholder.css`: shared styling for unfinished day pages.
- `assets/day1-gorillaz.jpg`: a screenshot of the Day 1 application, including its credited Gorillaz artwork.

## Hosting and preview

Expected hosted directory: https://paulgibbs3rd.github.io/30DayMapChallenge2026/directory/

Run `npm run dev` at the repository root to preview using the GitHub Pages subpath. [Publishing instructions](../docs/deployment.md) explain the initial deployment. The expected GitHub Pages URLs are prepared links until that first deployment succeeds.
