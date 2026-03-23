# StickyNote Web Component

`StickyNote` is a Shadow DOM web component that renders a sticky-note style card with a title, body text, read-only and editable modes, and host-facing events. In this project it powers the hover preview used by the Discovery Grid widget, but it can also be reused independently.

## Features

- sticky note UI with title and body text
- read-only, disabled, and editable modes
- inline editing with save and cancel controls
- configurable title length and truncated body line count
- programmatic expanded mode for showing the full note body
- optimized render-once/update-in-place behavior
- custom events for host integration
- Shadow DOM encapsulation with exposed `part` hooks

## Import

```js
import "./StickyNoteCard.js";
```

The module exports the class as `StickyNote` and registers the custom element as `<sticky-note>` when `customElements` is available.

## Basic Usage

```html
<sticky-note
  title="Quick Note"
  text="This is a sticky note."
  readonly
></sticky-note>
```

## Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | string | `""` | Title text shown at the top |
| `text` | string | `""` | Body text content |
| `color` | string | `rgb(167, 177, 240)` | Sticky note background color |
| `variant` | string | `default` | Variant class hook applied to the note container |
| `readonly` | boolean | `false` | Hides editing controls and keeps the note view-only |
| `disabled` | boolean | `false` | Prevents editing and interaction |
| `max-title-length` | number | `20` | Maximum title character count |
| `max-lines` | number | `5` | Maximum visible lines before truncation in collapsed mode |
| `tooltip-position` | string | `bottom` | Metadata hook retained on the note container |
| `expanded` | boolean | `false` | Shows the full body content instead of truncated text |

## Behavior Notes

- The component renders its Shadow DOM once, then updates cached elements when attributes change.
- Changing `text`, `max-lines`, or `expanded` triggers an internal resize pass.
- In collapsed read-only mode, the component tracks whether the text is actually truncated and exposes that via `data-truncated`.
- In expanded mode, the body grows to fit the content instead of showing a scrollbar.
- Double-clicking the title area enters edit mode when the component is editable.

## Events

The host element dispatches bubbling, composed `CustomEvent`s.

| Event | When it fires | `detail` |
| --- | --- | --- |
| `title-overlay-click` | Title overlay is clicked | `null` |
| `edit-start` | Edit mode begins | current draft values |
| `title-input` | Title input changes | current draft values |
| `note-input` | Body input changes | current draft values |
| `note-change` | Edits are committed | committed values |
| `edit-cancel` | Editing is cancelled | current attribute-backed values |

Draft and committed value payloads use this shape:

```js
{
  title: "Permitting",
  text: "Delays in permitting slow projects",
  color: "rgb(167, 177, 240)",
  variant: "default"
}
```

## Styling

The component uses Shadow DOM styles internally and exposes `part` names for host styling:

- `container`
- `body`
- `title-wrapper`
- `title`
- `title-overlay`
- `text-wrapper`
- `text`
- `actions`
- `edit-button`
- `save-button`
- `cancel-button`

## Example

```js
const note = document.createElement("sticky-note");
note.setAttribute("title", "Permitting");
note.setAttribute("text", "Delays in permitting slow projects");
note.setAttribute("readonly", "");
note.setAttribute("max-lines", "4");

note.addEventListener("note-change", (event) => {
  console.log("Updated note:", event.detail);
});

document.body.appendChild(note);
```

## Testing

Component-level regression tests live in [`src/components/StickyNoteCard.test.js`](/Users/Dave/Highcharts/discovery-grid-2/src/components/StickyNoteCard.test.js).

Run them with the full project test suite:

```bash
npm test
```
