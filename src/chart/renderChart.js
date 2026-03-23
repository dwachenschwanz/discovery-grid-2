import Highcharts from "highcharts";
import "highcharts/highcharts-more";
import { categories, CHART_LAYOUT } from "./constants.js";
import {
  activateCellHover,
  buildIssueLabelsByCell,
  deactivateCellHover,
  initializeChartInteractions,
} from "./interactions.js";
import { initializeChartLabels, positionLabels } from "./labels.js";

export function renderChart({
  chartElement,
  jitteredPoints,
  cellHoverPoints,
  quadrantGroups,
  cellGroups,
  stickyNoteElement,
  stickyNoteHintElement,
  title = "Discovery Grid",
}) {
  return Highcharts.chart(chartElement, {
    chart: {
      type: "scatter",
      marginRight: CHART_LAYOUT.marginRight,
      marginLeft: CHART_LAYOUT.marginLeft,
      marginTop: CHART_LAYOUT.marginTop,
      zoomType: null,
      events: {
        load: function () {
          const chart = this;
          initializeChartLabels(chart, quadrantGroups, cellGroups);
          chart.issueLabelsByCell = buildIssueLabelsByCell(chart.customLabels);
          initializeChartInteractions(chart, {
            stickyNoteElement,
            stickyNoteHintElement,
          });

          enforceSquarePlot(chart);
          positionLabels(chart);
        },
        redraw: function () {
          enforceSquarePlot(this);
          positionLabels(this);
        },
      },
    },
    credits: {
      enabled: false,
    },
    title: {
      text: title,
    },
    xAxis: {
      title: {
        text: "Impact",
        y: -10,
        style: {
          fontSize: "18px",
          fontWeight: "bold",
        },
      },
      labels: {
        style: {
          fontSize: "18px",
        },
        y: 20,
      },
      categories,
      min: 0,
      max: 8,
      gridLineWidth: 1,
      gridLineColor: "#888",
      lineWidth: 0,
    },
    yAxis: {
      title: {
        text: "Ignorance",
        align: "middle",
        rotation: 270,
        x: 0,
        style: {
          fontSize: "18px",
          fontWeight: "bold",
        },
      },
      labels: {
        style: {
          fontSize: "18px",
        },
        x: -10,
        formatter: function () {
          return this.value;
        },
      },
      categories,
      min: 0,
      max: 8,
      gridLineWidth: 1,
      gridLineColor: "#888",
    },
    tooltip: {
      enabled: false,
    },
    plotOptions: {
      series: {
        states: {
          inactive: {
            enabled: false,
          },
        },
      },
      scatter: {
        marker: { radius: 6 },
      },
    },
    series: [
      {
        name: "Points",
        type: "scatter",
        data: jitteredPoints,
        showInLegend: false,
        enableMouseTracking: false,
        states: {
          hover: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
      },
      {
        name: "Cells",
        type: "scatter",
        data: cellHoverPoints,
        enableMouseTracking: true,
        marker: {
          enabled: true,
          symbol: "square",
          radius: 30,
          fillColor: "rgba(255,255,255,0.001)",
          lineColor: "transparent",
          lineWidth: 0,
          states: {
            hover: {
              enabled: true,
              lineWidth: 3,
            },
          },
        },
        point: {
          events: {
            mouseOver: function () {
              activateCellHover(this.series.chart, `${this.x}-${this.y}`);
            },
            mouseOut: function () {
              deactivateCellHover(this.series.chart, `${this.x}-${this.y}`);
            },
          },
        },
        dataLabels: {
          enabled: true,
          useHTML: false,
          formatter: function () {
            return this.point.cellLetter || "";
          },
          style: {
            fontSize: "16px",
            fontWeight: "bold",
            color: "#000",
            textOutline: "none",
          },
        },
        states: {
          hover: {
            halo: {
              size: 0,
            },
          },
        },
        showInLegend: false,
        clip: false,
      },
      {
        name: "Manage",
        type: "polygon",
        color: "rgba(179, 255, 228, 0.627)",
        animation: false,
        enableMouseTracking: false,
        showInLegend: false,
        data: [
          [-0.5, -0.5],
          [3.5, -0.5],
          [3.5, 3.5],
          [-0.5, 3.5],
        ],
        zIndex: -10,
      },
      {
        name: "Navigate",
        type: "polygon",
        color: "#a0c5f899",
        animation: false,
        enableMouseTracking: false,
        showInLegend: false,
        data: [
          [3.5, -0.5],
          [8.5, -0.5],
          [8.5, 3.5],
          [3.5, 3.5],
        ],
        zIndex: -10,
      },
      {
        name: "Specify",
        type: "polygon",
        color: "rgba(255, 255, 150, 0.45)",
        animation: false,
        enableMouseTracking: false,
        showInLegend: false,
        data: [
          [-0.5, 3.5],
          [3.5, 3.5],
          [3.5, 8.5],
          [-0.5, 8.5],
        ],
        zIndex: -10,
      },
      {
        name: "Discovery",
        type: "polygon",
        color: "#ffcce469",
        animation: false,
        enableMouseTracking: false,
        showInLegend: false,
        data: [
          [3.5, 3.5],
          [8.5, 3.5],
          [8.5, 8.5],
          [3.5, 8.5],
        ],
        zIndex: -10,
      },
    ],
  });
}

function enforceSquarePlot(chart) {
  if (chart.__squareFramePending || chart.__resizingToSquare) return;
  if (!chart.container?.offsetWidth || !chart.container?.offsetHeight) return;

  const plotWidth = chart.plotWidth;
  const plotHeight = chart.plotHeight;
  if (Math.abs(plotWidth - plotHeight) < 1) return;

  chart.__squareFramePending = true;

  requestAnimationFrame(() => {
    chart.__squareFramePending = false;
    if (chart.__resizingToSquare) return;

    const nextPlotWidth = chart.plotWidth;
    const nextPlotHeight = chart.plotHeight;
    if (Math.abs(nextPlotWidth - nextPlotHeight) < 1) return;

    const extraWidth = chart.chartWidth - nextPlotWidth;
    const extraHeight = chart.chartHeight - nextPlotHeight;
    const squareSize = Math.min(nextPlotWidth, nextPlotHeight);

    chart.__resizingToSquare = true;
    chart.setSize(squareSize + extraWidth, squareSize + extraHeight, false);
    chart.__resizingToSquare = false;
  });
}
