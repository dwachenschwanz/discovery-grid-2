# StickyNote Web Component

`StickyNote` is a reusable Web Component that renders a sticky-note style UI with a title and body text. It supports both read-only and editable modes, emits events for integration, and encapsulates styling using Shadow DOM.

---

## Features

- 📝 Sticky note UI with title and body
- ✏️ Inline editing with save/cancel controls
- 🔒 Read-only and disabled modes
- 📏 Configurable title length and text truncation
- 🎨 Customizable background color
- 📡 Emits events for integration
- 🎯 Shadow DOM encapsulation
- 🎛️ Exposes `part` selectors for styling

---

## Installation

Include the script:

```html
<script src="./StickyNoteCard.js"></script>
```

## Basic Usage

```html
<sticky-note
  title="Quick Note"
  text="This is a sticky note."
></sticky-note>
```


## Attributes

| Attribute          | Type    | Default              | Description                     |
| ------------------ | ------- | -------------------- | ------------------------------- |
| `title`            | string  | `""`                 | Title text displayed at the top |
| `text`             | string  | `""`                 | Body text content               |
| `color`            | string  | `rgb(167, 177, 240)` | Background color                |
| `variant`          | string  | `default`            | CSS class hook for styling      |
| `readonly`         | boolean | false                | Disables editing UI             |
| `disabled`         | boolean | false                | Prevents all interaction        |
| `max-title-length` | number  | 20                   | Maximum title characters        |
| `max-lines`        | number  | 5                    | Max visible lines (truncation)  |
| `tooltip-position` | string  | `bottom`             | Metadata for positioning        |
