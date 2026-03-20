/**
 * StickyNote web component.
 *
 * A Shadow DOM custom element that renders a sticky-note style UI with
 * title/body content, readonly and editable modes, configurable truncation,
 * and custom event hooks for host applications.
 *
 * Attributes:
 * - title
 * - text
 * - color
 * - variant
 * - readonly
 * - disabled
 * - max-title-length
 * - max-lines
 * - tooltip-position
 *
 * Events:
 * - title-overlay-click
 * - edit-start
 * - title-input
 * - note-input
 * - note-change
 * - edit-cancel
 */

class StickyNote extends HTMLElement {
  static get observedAttributes() {
    return [
      'title',
      'text',
      'color',
      'variant',
      'readonly',
      'disabled',
      'max-title-length',
      'max-lines',
      'tooltip-position'
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._bound = false;
    this._editing = false;
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
    this.syncMode();
    this.autoResize();
  }

  attributeChangedCallback() {
    if (!this.shadowRoot) return;
    this.render();
    this.bindEvents();
    this.syncMode();
    this.autoResize();
  }

  get titleValue() {
    return this.getAttribute('title') ?? '';
  }
  set titleValue(value) {
    this.setAttribute('title', value ?? '');
  }

  get textValue() {
    return this.getAttribute('text') ?? '';
  }
  set textValue(value) {
    this.setAttribute('text', value ?? '');
  }

  get color() {
    return this.getAttribute('color') || 'rgb(167, 177, 240)';
  }
  set color(value) {
    this.setAttribute('color', value);
  }

  get variant() {
    return this.getAttribute('variant') || 'default';
  }

  get maxTitleLength() {
    return Number(this.getAttribute('max-title-length') || 20);
  }

  get maxLines() {
    return Number(this.getAttribute('max-lines') || 5);
  }

  get readOnly() {
    return this.hasAttribute('readonly');
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  get tooltipPosition() {
    return this.getAttribute('tooltip-position') || 'bottom';
  }

  bindEvents() {
    if (this._bound) return;
    this._bound = true;

    this.shadowRoot.addEventListener('click', (event) => {
      const target = event.target;

      if (target.closest('.title-click-overlay')) {
        this.dispatchStickyEvent('title-overlay-click');
      }

      if (target.closest('[data-action="edit"]')) {
        this.enterEditMode();
      }

      if (target.closest('[data-action="save"]')) {
        this.commitChanges();
      }

      if (target.closest('[data-action="cancel"]')) {
        this.cancelChanges();
      }
    });

    this.shadowRoot.addEventListener('dblclick', (event) => {
      if (event.target.closest('.title-click-overlay') || event.target.closest('.note-title-wrapper')) {
        this.enterEditMode();
      }
    });

    this.shadowRoot.addEventListener('input', (event) => {
      if (event.target.matches('.note-text')) {
        this.autoResize();
        this.dispatchStickyEvent('note-input', this.getDraftValue());
      }
      if (event.target.matches('.note-title')) {
        this.dispatchStickyEvent('title-input', this.getDraftValue());
      }
    });

    this.shadowRoot.addEventListener('keydown', (event) => {
      const titleInput = this.shadowRoot.querySelector('.note-title');
      const textInput = this.shadowRoot.querySelector('.note-text');

      if (event.key === 'Escape' && this._editing) {
        event.preventDefault();
        this.cancelChanges();
      }

      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter' && this._editing) {
        event.preventDefault();
        this.commitChanges();
      }

      if (event.key === 'Enter' && event.target === titleInput && this._editing) {
        event.preventDefault();
        textInput.focus();
      }
    });

    this.shadowRoot.addEventListener('focusout', (event) => {
      if (!this._editing) return;
      const next = event.relatedTarget;
      if (next && this.shadowRoot.contains(next)) return;
      this.commitChanges();
    });
  }

  /**
 * Returns the current draft values from the live input fields if available.
 * Falls back to attribute values when the shadow inputs are not present.
 *
 * @returns {{title: string, text: string, color: string, variant: string}}
 */
  getDraftValue() {
    const title = this.shadowRoot.querySelector('.note-title');
    const text = this.shadowRoot.querySelector('.note-text');
    return {
      title: title ? title.value : this.titleValue,
      text: text ? text.value : this.textValue,
      color: this.color,
      variant: this.variant
    };
  }

/**
 * Synchronizes the DOM with the current component mode.
 * Applies readonly/editing state, class names, button visibility,
 * disabled flags, and tab order.
 *
 * @returns {void}
 */
  syncMode() {
    const root = this.shadowRoot;
    const note = root.querySelector('.sticky-note');
    const title = root.querySelector('.note-title');
    const text = root.querySelector('.note-text');
    const editBtn = root.querySelector('[data-action="edit"]');
    const saveBtn = root.querySelector('[data-action="save"]');
    const cancelBtn = root.querySelector('[data-action="cancel"]');

    if (!note || !title || !text) return;

    const viewOnly = this.readOnly || this.disabled;
    const editing = this._editing && !viewOnly;

    note.classList.toggle('is-editing', editing);
    note.classList.toggle('is-readonly', viewOnly);
    note.setAttribute('data-tooltip-position', this.tooltipPosition);

    title.readOnly = !editing;
    text.readOnly = !editing;
    title.disabled = !editing;
    text.disabled = !editing;
    title.tabIndex = editing ? 0 : -1;
    text.tabIndex = editing ? 0 : -1;

    if (editBtn) editBtn.hidden = viewOnly || editing;
    if (saveBtn) saveBtn.hidden = !editing;
    if (cancelBtn) cancelBtn.hidden = !editing;
  }

/**
 * Enters edit mode unless the component is readonly or disabled.
 *
 * @returns {void}
 */
  enterEditMode() {
    if (this.readOnly || this.disabled) return;
    this._editing = true;
    this.syncMode();
    this.autoResize();
    const title = this.shadowRoot.querySelector('.note-title');
    if (title) {
      title.focus();
      title.setSelectionRange(title.value.length, title.value.length);
    }
    this.dispatchStickyEvent('edit-start', this.getDraftValue());
  }

/**
 * Commits the current draft values back to component attributes
 * and emits a `note-change` event.
 *
 * @returns {void}
 */
  commitChanges() {
    if (!this._editing) return;
    const draft = this.getDraftValue();
    this._editing = false;
    this.titleValue = draft.title;
    this.textValue = draft.text;
    this.syncMode();
    this.dispatchStickyEvent('note-change', draft);
  }

/**
 * Cancels editing, restores rendered values from attributes,
 * and emits an `edit-cancel` event.
 *
 * @returns {void}
 */
  cancelChanges() {
    if (!this._editing) return;
    this._editing = false;
    this.render();
    this.syncMode();
    this.autoResize();
    this.dispatchStickyEvent('edit-cancel', {
      title: this.titleValue,
      text: this.textValue,
      color: this.color,
      variant: this.variant
    });
  }

  autoResize() {
    const text = this.shadowRoot.querySelector('.note-text');
    if (!text) return;
    if (!this._editing) {
      text.style.height = 'auto';
      return;
    }
    text.style.height = 'auto';
    text.style.height = text.scrollHeight + 'px';
  }
  
/**
 * Dispatches a bubbling, composed CustomEvent from the host element.
 *
 * @param {string} name
 * @param {any} [detail=null]
 * @returns {void}
 */
  dispatchStickyEvent(name, detail = null) {
    this.dispatchEvent(new CustomEvent(name, {
      bubbles: true,
      composed: true,
      detail
    }));
  }

  escapeAttr(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  escapeText(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  render() {
    const title = this.escapeAttr(this.titleValue);
    const text = this.escapeText(this.textValue);
    const maxTitleLength = this.maxTitleLength;
    const maxLines = this.maxLines;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          vertical-align: top;
          --sticky-note-bg: ${this.color};
          --sticky-note-color: #1f2430;
          --sticky-note-width: 190px;
          --sticky-note-min-height: 134px;
          --sticky-note-radius: 0;
          --sticky-note-padding: 10px 10px 8px;
          --sticky-note-font-family: Arial, Helvetica, sans-serif;
          --sticky-note-title-size: 12px;
          --sticky-note-body-size: 12px;
          --sticky-note-shadow: none;
          --sticky-note-border: none;
          --sticky-note-line-height: 1.35;
          --sticky-note-focus-ring: 0 0 0 2px rgba(59, 130, 246, 0.35);
        }

        * {
          box-sizing: border-box;
        }

        .sticky-note {
          position: relative;
          width: var(--sticky-note-width);
          min-height: var(--sticky-note-min-height);
          background: var(--sticky-note-bg);
          color: var(--sticky-note-color);
          border: var(--sticky-note-border);
          border-radius: var(--sticky-note-radius);
          box-shadow: var(--sticky-note-shadow);
          padding: var(--sticky-note-padding);
        }

        .note-body {
          display: flex;
          flex-direction: column;
          min-height: calc(var(--sticky-note-min-height) - 18px);
        }

        .note-title-wrapper,
        .note-text-wrapper {
          position: relative;
          width: 100%;
        }

        .note-title,
        .note-text {
          width: 100%;
          margin: 0;
          padding: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: inherit;
          font-family: var(--sticky-note-font-family);
          resize: none;
          appearance: none;
          -webkit-appearance: none;
        }

        .note-title {
          font-size: var(--sticky-note-title-size);
          line-height: 16px;
          font-weight: 700;
          height: 16px;
          min-height: 16px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
        }

        .note-title::placeholder,
        .note-text::placeholder {
          color: rgba(31, 36, 48, 0.55);
        }

        .title-click-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .note-text-wrapper {
          margin-top: 6px;
          flex: 1 1 auto;
        }

        .note-text {
          display: block;
          min-height: calc(1em * ${maxLines} * 1.35);
          height: auto;
          overflow: hidden;
          font-size: var(--sticky-note-body-size);
          line-height: var(--sticky-note-line-height);
          white-space: pre-wrap;
          word-break: break-word;
          overflow-wrap: anywhere;
          --max-lines: ${maxLines};
        }

        .truncate {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: var(--max-lines);
          line-clamp: var(--max-lines);
        }

        .note-actions {
          display: flex;
          justify-content: flex-end;
          gap: 6px;
          margin-top: 8px;
        }

        .note-btn {
          border: 0;
          background: rgba(255, 255, 255, 0.55);
          color: inherit;
          font: inherit;
          font-size: 11px;
          line-height: 1;
          padding: 5px 7px;
          border-radius: 2px;
          cursor: pointer;
        }

        .note-btn:hover {
          background: rgba(255, 255, 255, 0.78);
        }

        .note-btn:focus-visible,
        .note-title:focus-visible,
        .note-text:focus-visible {
          box-shadow: var(--sticky-note-focus-ring);
        }

        .note-btn[hidden] {
          display: none;
        }

        .sticky-note.is-readonly .note-actions {
          display: none;
        }

        .sticky-note:not(.is-editing) .note-title,
        .sticky-note:not(.is-editing) .note-text {
          cursor: default;
        }

        .sticky-note:not(.is-editing) .note-title[disabled],
        .sticky-note:not(.is-editing) .note-text[disabled] {
          opacity: 1;
          -webkit-text-fill-color: currentColor;
        }

        .sticky-note:not(.is-editing) .note-text {
          pointer-events: none;
        }

        .sticky-note.is-editing .title-click-overlay {
          display: none;
        }

        .sticky-note.is-editing .note-title,
        .sticky-note.is-editing .note-text {
          background: rgba(255, 255, 255, 0.18);
        }

        .sticky-note.is-editing .note-title {
          padding: 0 2px;
        }

        .sticky-note.is-editing .note-text {
          padding: 2px;
          overflow: auto;
          display: block;
          -webkit-line-clamp: initial;
          line-clamp: initial;
        }
      </style>

      <div class="sticky-note ${this.variant}" part="container" data-tooltip-position="${this.escapeAttr(this.tooltipPosition)}">
        <div class="note-body" part="body">
          <div class="note-title-wrapper" part="title-wrapper">
            <input
              name="noteText"
              class="note-title"
              part="title"
              readonly
              disabled
              placeholder=""
              tabindex="-1"
              maxlength="${maxTitleLength}"
              value="${title}"
            />
            <div class="title-click-overlay" part="title-overlay"></div>
          </div>
          <div class="note-text-wrapper" part="text-wrapper">
            <textarea
              name="noteText"
              class="note-text truncate"
              part="text"
              placeholder=""
              readonly
              disabled
              tabindex="-1"
              style="background: transparent; --max-lines: ${maxLines}; height: auto;"
            >${text}</textarea>
          </div>
          <div class="note-actions" part="actions">
            <button class="note-btn" part="edit-button" data-action="edit" type="button">Edit</button>
            <button class="note-btn" part="save-button" data-action="save" type="button" hidden>Save</button>
            <button class="note-btn" part="cancel-button" data-action="cancel" type="button" hidden>Cancel</button>
          </div>
        </div>
      </div>
    `;
  }
}

if (!customElements.get('sticky-note')) {
  customElements.define('sticky-note', StickyNote);
}

