export class DataClient {
  /** Singleton class to manage data storage */
  static instance = null;
  constructor() {
    if (DataClient.instance) {
      return DataClient.instance;
    }
    DataClient.instance = this;
    return this;
  }

  async getData(fileName) {
    try {
      const response = await fetch(fileName);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Fetched issues:", data);
      return data;
    } catch (error) {
      console.error("Failed to fetch issues_data.json:", error);
      throw error;
    }
  }
}

// Create and export a variable (instance) of ApiClient
export const dataClient = new DataClient();
