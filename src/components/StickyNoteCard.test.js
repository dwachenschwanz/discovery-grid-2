import test from "node:test";
import assert from "node:assert/strict";

globalThis.HTMLElement = class {};

const { StickyNote } = await import("./StickyNoteCard.js");

function createNoteDouble() {
  const note = Object.create(StickyNote.prototype);
  note._rendered = true;
  note._editing = false;
  note._refs = {
    note: {
      className: "sticky-note default",
      classList: {
        toggle() {},
      },
      setAttribute(name, value) {
        this[name] = value;
      },
    },
    titleInput: {
      value: "",
      maxLength: 20,
      focus() {},
      setSelectionRange() {},
    },
    textInput: {
      value: "",
      classList: {
        toggle() {},
      },
      style: {
        setProperty(name, value) {
          this[name] = value;
        },
      },
      focus() {},
    },
    editBtn: {},
    saveBtn: {},
    cancelBtn: {},
  };
  note.shadowRoot = {};
  note.style = {
    setProperty(name, value) {
      this[name] = value;
    },
  };

  note._attrs = new Map([
    ["title", "Original title"],
    ["text", "Original text"],
    ["color", "rgb(167, 177, 240)"],
    ["variant", "default"],
    ["max-title-length", "20"],
    ["max-lines", "5"],
    ["tooltip-position", "bottom"],
  ]);

  note.getAttribute = (name) => note._attrs.get(name) ?? null;
  note.setAttribute = (name, value) => {
    note._attrs.set(name, String(value));
  };
  note.hasAttribute = (name) => note._attrs.has(name);

  return note;
}

test("attributeChangedCallback updates only the targeted field handlers", () => {
  const note = createNoteDouble();
  const calls = [];

  note.updateTitle = () => calls.push("title");
  note.updateText = () => calls.push("text");
  note.updateTheme = () => calls.push("theme");
  note.updateVariant = () => calls.push("variant");
  note.updateTitleConstraints = () => calls.push("title-constraints");
  note.updateTextConstraints = () => calls.push("text-constraints");
  note.autoResize = () => calls.push("resize");
  note.syncMode = () => calls.push("sync");

  note.attributeChangedCallback("title", "A", "B");
  note.attributeChangedCallback("text", "A", "B");
  note.attributeChangedCallback("color", "A", "B");
  note.attributeChangedCallback("variant", "A", "B");
  note.attributeChangedCallback("max-title-length", "20", "24");
  note.attributeChangedCallback("max-lines", "5", "6");
  note.attributeChangedCallback("readonly", null, "");
  note.attributeChangedCallback("title", "same", "same");

  assert.deepEqual(calls, [
    "title",
    "text",
    "theme",
    "variant",
    "title-constraints",
    "text-constraints",
    "resize",
    "sync",
  ]);
});

test("refreshUI synchronizes theme, constraints, values, and mode", () => {
  const note = createNoteDouble();
  const calls = [];

  note.updateTheme = () => calls.push("theme");
  note.updateVariant = () => calls.push("variant");
  note.updateTitleConstraints = () => calls.push("title-constraints");
  note.updateTextConstraints = () => calls.push("text-constraints");
  note.updateTitle = () => calls.push("title");
  note.updateText = () => calls.push("text");
  note.syncMode = () => calls.push("sync");
  note.autoResize = () => calls.push("resize");

  note.refreshUI();

  assert.deepEqual(calls, [
    "theme",
    "variant",
    "title-constraints",
    "text-constraints",
    "title",
    "text",
    "sync",
    "resize",
  ]);
});

test("update helpers patch cached refs without re-rendering", () => {
  const note = createNoteDouble();

  note._attrs.set("title", "Updated title");
  note._attrs.set("text", "Updated text");
  note._attrs.set("color", "#ffcc00");
  note._attrs.set("variant", "compact");
  note._attrs.set("max-title-length", "32");
  note._attrs.set("max-lines", "7");

  note.updateTitle();
  note.updateText();
  note.updateTheme();
  note.updateVariant();
  note.updateTitleConstraints();
  note.updateTextConstraints();

  assert.equal(note._refs.titleInput.value, "Updated title");
  assert.equal(note._refs.textInput.value, "Updated text");
  assert.equal(note.style["--sticky-note-bg"], "#ffcc00");
  assert.equal(note._refs.note.className, "sticky-note compact");
  assert.equal(note._refs.titleInput.maxLength, 32);
  assert.equal(note._refs.textInput.style["--max-lines"], "7");
});
