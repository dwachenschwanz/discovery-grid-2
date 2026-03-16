export class StickyNoteCard extends HTMLElement {
  static get observedAttributes() {
    return [
      "title",
      "description",
      "color",
      "max-header-lines",
      "max-text-lines",
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.render();
      this.bindEvents();
    }
  }

  get title() {
    return this.getAttribute("title") || "";
  }

  get description() {
    return this.getAttribute("description") || "";
  }

  get color() {
    return this.getAttribute("color") || "#f7b5b2";
  }

  get maxHeaderLines() {
    return this.getAttribute("max-header-lines") || "3";
  }

  get maxTextLines() {
    return this.getAttribute("max-text-lines") || "5";
  }

  bindEvents() {
    const closeBtn = this.shadowRoot.querySelector(".custom-overlay-close");
    const overlay = this.shadowRoot.querySelector(".custom-overlay");

    closeBtn?.addEventListener("click", () => {
      overlay.classList.remove("show");
    });

    const note = this.shadowRoot.querySelector(".sticky");

    note?.addEventListener("mouseenter", () => {
      overlay.classList.add("show");
    });

    note?.addEventListener("mouseleave", () => {
      overlay.classList.remove("show");
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          position: relative;
          font-family: Arial, sans-serif;
        }

        .block {
          position: relative;
        }

        .custom-overlay {
          position: absolute;
          left: 0;
          bottom: calc(100% + 8px);
          width: 260px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(4px);
          transition: opacity 0.18s ease, transform 0.18s ease;
          z-index: 10;
        }

        .custom-overlay.show {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .custom-overlay-content {
          background: #fff8c6;
          border: 1px solid #d8cf8a;
          box-shadow: 0 4px 14px rgba(0,0,0,0.14);
          padding: 10px 12px;
        }

        .custom-overlay-header {
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }

        .custom-overlay-header p {
          margin: 0;
          flex: 1;
          font-size: 13px;
          line-height: 1.35;
        }

        .custom-overlay-close {
          border: 0;
          background: transparent;
          cursor: pointer;
          font-size: 14px;
        }

        .sticky {
          width: 180px;
          min-height: 140px;
          background: ${this.color};
          border: 1px solid rgba(0,0,0,0.12);
          box-shadow: 0 2px 6px rgba(0,0,0,0.12);
          padding: 12px;
          display: flex;
          flex-direction: column;
          cursor: grab;
        }

        .note-title {
          border: none;
          background: transparent;
          font-weight: bold;
          font-size: 14px;
          width: 100%;
          pointer-events: none;
        }

        .note-text {
          border: none;
          resize: none;
          background: transparent;
          font-size: 13px;
          width: 100%;
          pointer-events: none;
        }
      </style>

      <div class="block" draggable="true">
        <div class="custom-overlay">
          <div class="custom-overlay-content">
            <div class="custom-overlay-header">
              <p>${this.title}: ${this.description}</p>
              <button class="custom-overlay-close">✕</button>
            </div>
          </div>
        </div>

        <div class="sticky">
          <input class="note-title" readonly value="${this.title}" />
          <textarea class="note-text" readonly>${this.description}</textarea>
        </div>
      </div>
    `;
  }
}

customElements.define("sticky-note-card", StickyNoteCard);
