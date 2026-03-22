# Discovery Grid Two

Discovery Grid Two is a Vite-based Highcharts project that renders issues on a 9x9 Impact vs. Ignorance grid. It can run as a standalone demo app or be mounted as an embeddable widget inside another web application, including an Angular host.

## Features

- 9x9 Highcharts scatter grid with quadrant background regions
- Stable grouping of issues into cells, quadrants, and cell letters
- Right-side issue list with hover-linked grid highlighting
- Sticky note issue preview powered by a custom web component
- Double-click label expansion for truncated sticky note content
- Smooth sticky note and helper-hint hover transitions
- Embeddable widget API with `updateData()`, `resize()`, and `destroy()`
- Node-based regression tests for data, labels, interactions, and sticky note behavior

## Getting Started

### Install

```bash
npm install
```

### Run the demo

```bash
npm run dev
```

Open `http://localhost:5173`.

### Run tests

```bash
npm test
```

### Build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm test` | Run the Node test suite |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run deploy` | Publish `dist/` with `gh-pages` |

## Data Format

The widget expects an array of issue objects.

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
| `Issue Name` | Display label when present; otherwise a title can be derived from the description |

## Quadrants

| Quadrant | Range | Display Label |
| --- | --- | --- |
| `Q1` | `x: 0-3`, `y: 0-3` | Manage |
| `Q2` | `x: 4-8`, `y: 0-3` | Navigate |
| `Q3` | `x: 0-3`, `y: 4-8` | Specify |
| `Q4` | `x: 4-8`, `y: 4-8` | Discovery |

## Project Structure

```text
index.html
src/
  demo.css
  discoveryGridWidget.js
  main.js
  style.css
  chart/
    constants.js
    data.js
    data.test.js
    interactions.js
    interactions.test.js
    labels.js
    labels.test.js
    renderChart.js
  components/
    README.md
    StickyNoteCard.js
    StickyNoteCard.test.js
  utils/
    data_client.js
```

## Architecture

### Demo entry

[`src/main.js`](/Users/Dave/Highcharts/discovery-grid-2/src/main.js) loads sample data and mounts the widget into the standalone demo page.

### Widget entry

[`src/discoveryGridWidget.js`](/Users/Dave/Highcharts/discovery-grid-2/src/discoveryGridWidget.js) exposes the embeddable API and creates widget-scoped DOM, including the chart container, sticky note, and helper hint.

### Data layer

[`src/chart/data.js`](/Users/Dave/Highcharts/discovery-grid-2/src/chart/data.js) is responsible for:

- validating and normalizing raw issue rows
- grouping issues by cell and quadrant
- generating jittered plot points and cell hover points
- deriving quadrant-aware hover colors and labels

### Label layer

[`src/chart/labels.js`](/Users/Dave/Highcharts/discovery-grid-2/src/chart/labels.js) creates and positions:

- quadrant headers
- right-side issue labels
- cell label collections used by the interaction layer

### Interaction layer

[`src/chart/interactions.js`](/Users/Dave/Highcharts/discovery-grid-2/src/chart/interactions.js) manages:

- grid-cell hover ownership between chart squares and issue labels
- point and cell highlighting
- sticky note show/hide timing
- helper-hint visibility for truncated notes
- double-click expansion behavior
- single-label emphasis when multiple issues share the same grid square

### Chart layer

[`src/chart/renderChart.js`](/Users/Dave/Highcharts/discovery-grid-2/src/chart/renderChart.js) contains the Highcharts configuration and wires the label and interaction modules into chart load and redraw events.

### Styling

[`src/style.css`](/Users/Dave/Highcharts/discovery-grid-2/src/style.css) contains widget-scoped styles used for embedding, including sticky note and helper-hint transitions.

[`src/demo.css`](/Users/Dave/Highcharts/discovery-grid-2/src/demo.css) contains demo-page-only layout styles.

## Embedded Widget API

Import and mount the widget into a host element:

```js
import { mountDiscoveryGrid } from "./src/discoveryGridWidget.js";

const widget = mountDiscoveryGrid(hostElement, {
  data,
  title: "Discovery Grid",
});
```

### Options

| Option | Type | Description |
| --- | --- | --- |
| `data` | `Array` | Raw issue records to render |
| `title` | `string` | Chart title |
| `stickyNote` | `boolean` | Enable or disable the sticky note preview |
| `stickyNoteAttributes` | `object` | Attributes forwarded to the internal `<sticky-note>` element |

### Controller methods

`mountDiscoveryGrid(...)` returns:

| Method | Description |
| --- | --- |
| `updateData(nextData)` | Rebuild and rerender the widget with new data |
| `resize()` | Trigger a Highcharts reflow |
| `destroy()` | Remove the widget, chart, and event listeners from the host |
| `getChart()` | Return the Highcharts chart instance |
| `getHostElement()` | Return the host element used for mounting |

## Sticky Note Behavior

Hovering an issue label shows a sticky note preview beside the issue list.

Current behavior includes:

- smooth fade/slide transitions for the sticky note and helper hint
- square highlighting that remains stable while hovering a matching issue label
- only the hovered issue label is emphasized when multiple issues share one cell
- a helper hint shown only when the current sticky note is truncated
- double-click on an issue label to expand a truncated sticky note
- automatic reset back to truncated mode when hover ends

The sticky note UI is implemented by [`src/components/StickyNoteCard.js`](/Users/Dave/Highcharts/discovery-grid-2/src/components/StickyNoteCard.js).

## Angular Integration Example

Angular should own the host element and input data, while the widget owns rendering and hover behavior.

```ts
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { mountDiscoveryGrid } from 'path-to-widget/discoveryGridWidget';

@Component({
  selector: 'app-discovery-grid',
  template: `<div #host style="width: 100%; height: 700px;"></div>`,
})
export class DiscoveryGridComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  @ViewChild('host', { static: true }) hostRef!: ElementRef<HTMLElement>;
  @Input() data: unknown[] = [];

  private widget: ReturnType<typeof mountDiscoveryGrid> | null = null;

  ngAfterViewInit(): void {
    this.widget = mountDiscoveryGrid(this.hostRef.nativeElement, {
      data: this.data,
      title: 'Discovery Grid',
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.widget) {
      this.widget.updateData(this.data);
    }
  }

  ngOnDestroy(): void {
    this.widget?.destroy();
  }
}
```

### Integration notes

- Give the host element an explicit width and height.
- Call `destroy()` from `ngOnDestroy()`.
- Use `updateData()` when Angular inputs change.
- The widget is host-scoped and does not depend on global IDs like `#container`.

## Testing

Tests use Node's built-in test runner.

```bash
npm test
```

Current test coverage includes:

- data shaping and title generation
- cell and quadrant grouping
- jittered point and hover point generation
- label grouping and layout positioning
- interaction regressions around cell highlighting and shared-cell issue labels
- sticky note component update behavior and truncation detection

Test files:

- [`src/chart/data.test.js`](/Users/Dave/Highcharts/discovery-grid-2/src/chart/data.test.js)
- [`src/chart/labels.test.js`](/Users/Dave/Highcharts/discovery-grid-2/src/chart/labels.test.js)
- [`src/chart/interactions.test.js`](/Users/Dave/Highcharts/discovery-grid-2/src/chart/interactions.test.js)
- [`src/components/StickyNoteCard.test.js`](/Users/Dave/Highcharts/discovery-grid-2/src/components/StickyNoteCard.test.js)
