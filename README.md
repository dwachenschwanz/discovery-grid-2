# Discovery Grid Two

Discovery Grid Two is a Vite-based browser app that plots issues on a 9x9 Impact vs. Ignorance grid using Highcharts. Issues are grouped into quadrants, arranged within shared cells, and surfaced through hover-driven label highlighting plus a sticky note detail preview.

## Features

- 9x9 Highcharts scatter grid with quadrant backgrounds
- Automatic grouping of issues by cell and quadrant
- Stable cell lettering (`A`, `B`, `C`, ...)
- Predefined in-cell layouts for crowded cells
- Hover highlighting for cells, labels, and issue points
- Sticky note preview powered by a custom web component
- Lightweight automated tests for data and label logic

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

Open `http://localhost:5173`.

### Run tests

```bash
npm test
```

### Build for production

```bash
npm run build
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm test` | Run the Node test suite |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |

## Data Format

The app expects a JSON array of issue objects, typically loaded from `issues_data.json`.

```json
[
  {
    "Impact": 7,
    "Ignorance": 8,
    "Issue Name": "Permitting",
    "Description": "Delays in permitting slow projects"
  }
]
```

### Required fields

| Field | Type | Description |
| --- | --- | --- |
| `Impact` | number | X-axis position, `1` through `9` |
| `Ignorance` | number | Y-axis position, `1` through `9` |
| `Description` | string | Main issue description |

### Optional fields

| Field | Description |
| --- | --- |
| `Issue Name` | Fallback display name if no generated title is used |

## Quadrants

| Quadrant | Range | Label |
| --- | --- | --- |
| `Q1` | `x: 0-3`, `y: 0-3` | Manage |
| `Q2` | `x: 4-8`, `y: 0-3` | Navigate |
| `Q3` | `x: 0-3`, `y: 4-8` | Specify |
| `Q4` | `x: 4-8`, `y: 4-8` | Discovery |

## Project Structure

```text
index.html
src/
  main.js
  style.css
  components/
    StickyNoteCard.js
  chart/
    constants.js
    data.js
    data.test.js
    interactions.js
    labels.js
    labels.test.js
    renderChart.js
  utils/
    data_client.js
```

## Architecture

### Entry point

[`src/main.js`](/Users/Dave/Highcharts/discovery-grid-2/src/main.js) loads the dataset, transforms it into chart-ready structures, and calls the chart renderer.

### Data layer

[`src/chart/data.js`](/Users/Dave/Highcharts/discovery-grid-2/src/chart/data.js) handles:

- filtering and normalizing raw issue data
- assigning issues to cells and quadrants
- generating in-cell point layouts
- deriving hover styles from quadrant color mappings

### Label layer

[`src/chart/labels.js`](/Users/Dave/Highcharts/discovery-grid-2/src/chart/labels.js) builds the right-side issue list, creates quadrant labels, and positions all custom labels during chart redraws.

### Interaction layer

[`src/chart/interactions.js`](/Users/Dave/Highcharts/discovery-grid-2/src/chart/interactions.js) manages hover state, sticky note behavior, label emphasis, and cell/point activation.

### Chart layer

[`src/chart/renderChart.js`](/Users/Dave/Highcharts/discovery-grid-2/src/chart/renderChart.js) owns the Highcharts configuration and wires the label and interaction layers into the chart lifecycle.

## Testing

Tests use Node's built-in test runner, so no extra test framework is required.

Current coverage includes:

- data filtering and title generation
- cell and quadrant grouping
- hover style mapping
- jittered point and hover point generation
- label grouping and label layout positioning

Test files:

- [`src/chart/data.test.js`](/Users/Dave/Highcharts/discovery-grid-2/src/chart/data.test.js)
- [`src/chart/labels.test.js`](/Users/Dave/Highcharts/discovery-grid-2/src/chart/labels.test.js)

## Sticky Note Component

Hover previews are rendered through the custom element defined in [`src/components/StickyNoteCard.js`](/Users/Dave/Highcharts/discovery-grid-2/src/components/StickyNoteCard.js).

Example host markup:

```html
<sticky-note
  id="hoverStickyNote"
  class="stickyNote"
  title=""
  text=""
  readonly
></sticky-note>
```

## Current Notes

- The app is optimized for hover-based exploration on desktop-sized layouts.
- Sticky note positioning is functional but could still be improved for tighter viewport constraints.
- Accessibility and keyboard interaction remain good next-step improvements.

## License

Internal / proprietary.
