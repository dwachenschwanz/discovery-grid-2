# Discovery Grid Two

Discovery Grid Two is a browser-based visualization that maps issues onto a 9x9 **Impact vs. Ignorance** grid, organizes them into quadrants, and provides interactive hover previews using a sticky note component.

---

## Features

* 📊 Highcharts-based 9x9 grid visualization
* 🧭 Four quadrant grouping: Discovery, Specify, Navigate, Manage
* 🔤 Automatic cell labeling (A, B, C...)
* 📍 Multiple issue layout within a single grid cell
* 🖱️ Interactive hover highlighting
* 📝 Sticky note preview with issue details
* 🔄 Dynamic resizing and square layout enforcement

---

## Demo Layout

* X-axis: **Impact (1–9)**
* Y-axis: **Ignorance (1–9)**
* Each issue is plotted as a point
* Issues in the same cell are arranged using mini-layout grids

---

## Project Structure

```
index.html          # App shell
style.css           # Layout and host styling
main.js             # Core visualization logic
data_client.js      # Data loading utility
issues_data.json    # Input dataset
StickyNoteCard.js   # Sticky note web component
```

---

## Getting Started

### 1. Install dependencies (if using Vite)

```bash
npm install
```

### 2. Run dev server

```bash
npm run dev
```

### 3. Open in browser

```
http://localhost:5173
```

---

## Data Format

The app expects a JSON array of issue objects:

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

| Field       | Type   | Description            |
| ----------- | ------ | ---------------------- |
| Impact      | number | X-axis position (1–9)  |
| Ignorance   | number | Y-axis position (1–9)  |
| Description | string | Main issue description |

### Optional

| Field      | Description    |
| ---------- | -------------- |
| Issue Name | Fallback title |

---

## Quadrants

| Quadrant | Range          | Label     |
| -------- | -------------- | --------- |
| Q1       | x: 0–3, y: 0–3 | Manage    |
| Q2       | x: 4–8, y: 0–3 | Navigate  |
| Q3       | x: 0–3, y: 4–8 | Specify   |
| Q4       | x: 4–8, y: 4–8 | Discovery |

---

## Sticky Note Component

Used for hover previews.

### Example

```html
<sticky-note
  id="hoverStickyNote"
  class="stickyNote"
  title=""
  text=""
  readonly
></sticky-note>
```

### Behavior

* Updates on hover
* Positioned relative to chart container
* Controlled via `main.js`

---

## Key Concepts

### Cell Grouping

Issues are grouped by grid cell:

```
(x, y) → cell → multiple issues
```

Each cell gets a letter label (A, B, C...).

---

### Layout Engine

Multiple issues in one cell are arranged using predefined layouts or fallback grid positioning.

---

### Hover Interaction

Hovering an issue label:

* Highlights the corresponding grid cell
* Highlights label text
* Displays sticky note with details

---

## Important Functions

### `buildBasePoints(data)`

Transforms raw data into chart-ready points.

### `groupData(points)`

Groups issues by cell and quadrant.

### `buildJitteredPoints(cellGroups)`

Positions issues within each cell.

### `renderChart()`

Initializes the Highcharts visualization.

### `bindIssueLabelEvents()`

Handles hover interactions and sticky note updates.

---

## Styling Notes

* `.square-container` controls layout and positioning
* `.stickyNote` is only a positioning wrapper (not visual)
* Sticky note visuals are inside the web component (Shadow DOM)

---

## Development Notes

* Uses ES modules (Vite-based setup)
* Sticky note is a custom Web Component
* Highcharts handles rendering and scaling

---

## Known Limitations

* Sticky note may overflow viewport on narrow screens
* Full re-render on attribute changes (simple but not optimized)
* Accessibility can be improved (ARIA labels, roles)

---

## Future Improvements

* Responsive sticky note positioning (left/right auto-flip)
* Keyboard navigation for issues
* Filtering/search for issues
* Export or snapshot functionality

---

## License

Internal / proprietary (update as needed)

---

## Author Notes

This project focuses on clarity of visualization and interaction simplicity rather than framework complexity. It intentionally uses lightweight architecture with minimal dependencies.
