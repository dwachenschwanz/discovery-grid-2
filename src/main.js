import { dataClient } from "./utils/data_client.js";
import "./demo.css";
import { mountDiscoveryGrid } from "./discoveryGridWidget.js";

main();

async function main() {
  try {
    const data = await dataClient.getData("issues_data.json");
    const hostElement = document.querySelector("[data-discovery-grid-root]");

    if (!hostElement) {
      throw new Error("Missing discovery grid host element.");
    }

    mountDiscoveryGrid(hostElement, { data });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
