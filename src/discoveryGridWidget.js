import "./components/StickyNoteCard.js";
import "./style.css";
import {
  buildBasePoints,
  buildCellHoverPoints,
  buildJitteredPoints,
  groupData,
} from "./chart/data.js";
import { WIDGET_STYLE_DEFAULTS } from "./chart/constants.js";
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

function mergeWidgetOptions(baseOptions, nextOptions = {}) {
  return {
    ...baseOptions,
    ...nextOptions,
    stickyNoteAttributes: {
      ...baseOptions.stickyNoteAttributes,
      ...(nextOptions.stickyNoteAttributes ?? {}),
    },
  };
}

function applyWidgetStyleDefaults(hostElement) {
  Object.entries(WIDGET_STYLE_DEFAULTS).forEach(([name, value]) => {
    hostElement.style.setProperty(name, value);
  });
}

export function mountDiscoveryGrid(hostElement, options = {}) {
  if (!(hostElement instanceof HTMLElement)) {
    throw new Error("mountDiscoveryGrid requires a host HTMLElement.");
  }

  let settings = mergeWidgetOptions(DEFAULT_OPTIONS, options);
  let chart = null;
  let resizeObserver = null;
  let widgetElements = null;
  let currentData = settings.data ?? [];

  hostElement.replaceChildren();
  hostElement.classList.add("discovery-grid-widget-host");
  applyWidgetStyleDefaults(hostElement);

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
      rerenderChart();
    },
    updateOptions(nextOptions = {}) {
      if ("data" in nextOptions) {
        currentData = Array.isArray(nextOptions.data) ? nextOptions.data : [];
      }

      const previousSettings = settings;
      settings = mergeWidgetOptions(settings, nextOptions);

      const stickyNoteConfigChanged =
        previousSettings.stickyNote !== settings.stickyNote ||
        "stickyNoteAttributes" in nextOptions;

      if (stickyNoteConfigChanged) {
        rebuildWidgetElements();
        return;
      }

      if ("title" in nextOptions && chart) {
        chart.setTitle({ text: settings.title });
      }

      if (!("title" in nextOptions) || "data" in nextOptions) {
        rerenderChart();
      }
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

  function rerenderChart() {
    chart?.destroy();
    chart = renderFromData(currentData);
  }

  function rebuildWidgetElements() {
    chart?.destroy();
    hostElement.replaceChildren();
    widgetElements = createWidgetElements(hostElement, settings);
    chart = renderFromData(currentData);
  }

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
