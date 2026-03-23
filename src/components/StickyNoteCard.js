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

export class StickyNote extends HTMLElement {
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
      'tooltip-position',
      'expanded'
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._bound = false;
    this._editing = false;
    this._rendered = false;
    this._refs = null;
  }

  connectedCallback() {
    if (!this._rendered) {
      this.render();
      this.cacheElements();
      this._rendered = true;
    }

    this.refreshUI();
    this.bindEvents();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.shadowRoot || !this._rendered || oldValue === newValue) return;

    switch (name) {
      case 'title':
        this.updateTitle();
        break;
      case 'text':
        this.updateText();
        this.autoResize();
        break;
      case 'color':
        this.updateTheme();
        break;
      case 'variant':
        this.updateVariant();
        break;
      case 'max-title-length':
        this.updateTitleConstraints();
        break;
      case 'max-lines':
        this.updateTextConstraints();
        this.autoResize();
        break;
      case 'tooltip-position':
      case 'readonly':
      case 'disabled':
        this.syncMode();
        break;
      case 'expanded':
        this.updateExpansion();
        this.autoResize();
        break;
      default:
        break;
    }
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

  get expanded() {
    return this.hasAttribute('expanded');
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
      const { titleInput, textInput } = this._refs ?? {};

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
    const { titleInput, textInput } = this._refs ?? {};
    return {
      title: titleInput ? titleInput.value : this.titleValue,
      text: textInput ? textInput.value : this.textValue,
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
    const {
      note,
      titleInput,
      textInput,
      editBtn,
      saveBtn,
      cancelBtn,
    } = this._refs ?? {};

    if (!note || !titleInput || !textInput) return;

    const viewOnly = this.readOnly || this.disabled;
    const editing = this._editing && !viewOnly;

    note.classList.toggle('is-editing', editing);
    note.classList.toggle('is-readonly', viewOnly);
    note.className = `sticky-note ${this.variant}`.trim();
    note.classList.toggle('is-editing', editing);
    note.classList.toggle('is-readonly', viewOnly);
    note.setAttribute('data-tooltip-position', this.tooltipPosition);

    titleInput.readOnly = !editing;
    textInput.readOnly = !editing;
    titleInput.disabled = !editing;
    textInput.disabled = !editing;
    titleInput.tabIndex = editing ? 0 : -1;
    textInput.tabIndex = editing ? 0 : -1;

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
    const { titleInput } = this._refs ?? {};
    if (titleInput) {
      titleInput.focus();
      titleInput.setSelectionRange(titleInput.value.length, titleInput.value.length);
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
    this.refreshUI();
    this.dispatchStickyEvent('edit-cancel', {
      title: this.titleValue,
      text: this.textValue,
      color: this.color,
      variant: this.variant
    });
  }

  autoResize() {
    const text = this._refs?.textInput;
    if (!text) return;
    if (this.expanded) {
      text.style.height = 'auto';
      text.style.height = `${text.scrollHeight}px`;
      this.updateTruncationState();
      return;
    }
    if (!this._editing) {
      text.style.height = 'auto';
      this.updateTruncationState();
      return;
    }
    text.style.height = 'auto';
    text.style.height = text.scrollHeight + 'px';
    this.updateTruncationState();
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
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          vertical-align: top;
          --sticky-note-bg: rgb(167, 177, 240);
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

        .note-text-wrapper::after {
          content: "";
          position: absolute;
          inset: auto 0 0;
          height: 24px;
          pointer-events: none;
          background: linear-gradient(
            to bottom,
            rgba(167, 177, 240, 0),
            rgba(167, 177, 240, 0.95)
          );
          opacity: 0;
          transition: opacity 120ms ease;
        }

        .note-text {
          display: block;
          min-height: calc(1em * var(--max-lines, 5) * 1.35);
          height: auto;
          overflow: hidden;
          font-size: var(--sticky-note-body-size);
          line-height: var(--sticky-note-line-height);
          white-space: pre-wrap;
          word-break: break-word;
          overflow-wrap: anywhere;
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

        :host([expanded]) .note-text {
          min-height: 0;
          overflow: hidden;
          display: block;
          -webkit-line-clamp: initial;
          line-clamp: initial;
        }

        :host([data-truncated="true"]:not([expanded])) .note-text-wrapper::after {
          opacity: 1;
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
              maxlength="20"
              value=""
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
              style="background: transparent; height: auto;"
            ></textarea>
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

  cacheElements() {
    this._refs = {
      note: this.shadowRoot.querySelector('.sticky-note'),
      titleInput: this.shadowRoot.querySelector('.note-title'),
      textInput: this.shadowRoot.querySelector('.note-text'),
      editBtn: this.shadowRoot.querySelector('[data-action="edit"]'),
      saveBtn: this.shadowRoot.querySelector('[data-action="save"]'),
      cancelBtn: this.shadowRoot.querySelector('[data-action="cancel"]'),
    };
  }

  refreshUI() {
    this.updateTheme();
    this.updateVariant();
    this.updateTitleConstraints();
    this.updateTextConstraints();
    this.updateTitle();
    this.updateText();
    this.updateExpansion();
    this.syncMode();
    this.autoResize();
  }

  updateTruncationState() {
    const textInput = this._refs?.textInput;
    if (!textInput) return;

    const hasContent = textInput.value.trim().length > 0;
    const isTruncated = !this._editing &&
      !this.expanded &&
      hasContent &&
      (textInput.scrollHeight - textInput.clientHeight > 1);

    this.setAttribute('data-truncated', isTruncated ? 'true' : 'false');
  }

  updateTheme() {
    this.style.setProperty('--sticky-note-bg', this.color);
  }

  updateVariant() {
    const note = this._refs?.note;
    if (!note) return;

    note.className = `sticky-note ${this.variant}`.trim();
  }

  updateTitleConstraints() {
    const titleInput = this._refs?.titleInput;
    if (!titleInput) return;
    titleInput.maxLength = this.maxTitleLength;
  }

  updateTextConstraints() {
    const textInput = this._refs?.textInput;
    if (!textInput) return;
    textInput.style.setProperty('--max-lines', String(this.maxLines));
  }

  updateTitle() {
    const titleInput = this._refs?.titleInput;
    if (!titleInput) return;
    const nextValue = this.titleValue;
    if (titleInput.value !== nextValue) {
      titleInput.value = nextValue;
    }
  }

  updateText() {
    const textInput = this._refs?.textInput;
    if (!textInput) return;
    const nextValue = this.textValue;
    if (textInput.value !== nextValue) {
      textInput.value = nextValue;
    }
  }

  updateExpansion() {
    const textInput = this._refs?.textInput;
    if (!textInput) return;

    textInput.classList.toggle('truncate', !this.expanded);
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('sticky-note')
) {
  customElements.define('sticky-note', StickyNote);
}
