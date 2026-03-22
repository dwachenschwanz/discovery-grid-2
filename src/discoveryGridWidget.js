import "./components/StickyNoteCard.js";
import "./style.css";
import {
  buildBasePoints,
  buildCellHoverPoints,
  buildJitteredPoints,
  groupData,
} from "./chart/data.js";
import { renderChart } from "./chart/renderChart.js";

const DEFAULT_OPTIONS = {
  title: "Discovery Grid",
  stickyNote: true,
  stickyNoteAttributes: {
    variant: "default",
    color: "rgb(167, 177, 240)",
    "max-title-length": "20",
    "max-lines": "5",
    readonly: "",
  },
};

export function mountDiscoveryGrid(hostElement, options = {}) {
  if (!(hostElement instanceof HTMLElement)) {
    throw new Error("mountDiscoveryGrid requires a host HTMLElement.");
  }

  const settings = {
    ...DEFAULT_OPTIONS,
    ...options,
    stickyNoteAttributes: {
      ...DEFAULT_OPTIONS.stickyNoteAttributes,
      ...(options.stickyNoteAttributes ?? {}),
    },
  };

  let chart = null;
  let resizeObserver = null;
  let widgetElements = null;
  let currentData = settings.data ?? [];

  hostElement.replaceChildren();
  hostElement.classList.add("discovery-grid-widget-host");

  widgetElements = createWidgetElements(hostElement, settings);
  chart = renderFromData(currentData);

  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(() => {
      chart?.reflow();
    });
    resizeObserver.observe(hostElement);
  }

  return {
    updateData(nextData) {
      currentData = Array.isArray(nextData) ? nextData : [];
      chart?.destroy();
      chart = renderFromData(currentData);
    },
    resize() {
      chart?.reflow();
    },
    destroy() {
      resizeObserver?.disconnect();
      resizeObserver = null;
      chart?.destroy();
      chart = null;
      hostElement.replaceChildren();
      hostElement.classList.remove("discovery-grid-widget-host");
    },
    getChart() {
      return chart;
    },
    getHostElement() {
      return hostElement;
    },
  };

  function renderFromData(data) {
    const basePoints = buildBasePoints(data);
    const { cellGroups, quadrantGroups } = groupData(basePoints);
    const jitteredPoints = buildJitteredPoints(cellGroups);
    const cellHoverPoints = buildCellHoverPoints(cellGroups);

    return renderChart({
      chartElement: widgetElements.chartElement,
      stickyNoteElement: widgetElements.stickyNoteElement,
      stickyNoteHintElement: widgetElements.stickyNoteHintElement,
      title: settings.title,
      jitteredPoints,
      cellHoverPoints,
      quadrantGroups,
      cellGroups,
    });
  }
}

function createWidgetElements(hostElement, settings) {
  const container = document.createElement("div");
  container.className = "discovery-grid-widget";

  let stickyNoteElement = null;
  let stickyNoteHintElement = null;
  if (settings.stickyNote) {
    stickyNoteElement = document.createElement("sticky-note");
    stickyNoteElement.className = "stickyNote";
    stickyNoteElement.setAttribute("title", "");
    stickyNoteElement.setAttribute("text", "");

    Object.entries(settings.stickyNoteAttributes).forEach(([key, value]) => {
      if (value === false || value === null || value === undefined) {
        return;
      }

      if (value === "") {
        stickyNoteElement.setAttribute(key, "");
        return;
      }

      stickyNoteElement.setAttribute(key, String(value));
    });

    container.appendChild(stickyNoteElement);

    stickyNoteHintElement = document.createElement("div");
    stickyNoteHintElement.className = "stickyNoteHint";
    stickyNoteHintElement.textContent = "Double-click label to expand";
    container.appendChild(stickyNoteHintElement);
  }

  const chartElement = document.createElement("div");
  chartElement.className = "square-chart";
  container.appendChild(chartElement);

  hostElement.appendChild(container);

  return {
    container,
    chartElement,
    stickyNoteElement,
    stickyNoteHintElement,
  };
}
