import { dataClient } from "./utils/data_client.js";
import "./components/StickyNoteCard.js";
import "./style.css";
import {
  buildBasePoints,
  buildCellHoverPoints,
  buildJitteredPoints,
  groupData,
} from "./chart/data.js";
import { renderChart } from "./chart/renderChart.js";

const DEBUG = false;

const log = (...args) => {
  if (DEBUG) console.log(...args);
};

main();

async function main() {
  try {
    const data = await dataClient.getData("issues_data.json");
    const basePoints = buildBasePoints(data);
    init(basePoints);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function init(basePoints) {
  const { cellGroups, quadrantGroups } = groupData(basePoints);
  const jitteredPoints = buildJitteredPoints(cellGroups);
  const cellHoverPoints = buildCellHoverPoints(cellGroups);

  log("quadrantGroups", quadrantGroups);

  renderChart({
    jitteredPoints,
    cellHoverPoints,
    quadrantGroups,
    cellGroups,
  });
}
