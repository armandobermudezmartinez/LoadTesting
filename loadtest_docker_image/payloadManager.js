// payloadManager.js
import { SharedArray } from "k6/data";

// Define the PayloadManager class
export class PayloadManager {
  constructor(jsonFilePath = null) {
    this.payloads = jsonFilePath
      ? new SharedArray("Payloads", function () {
          return JSON.parse(open(jsonFilePath)); // Load predefined payloads
        })
      : null; // If no JSON file is provided, handle dynamic payload generation
  }

  // Method to get a random payload from the JSON file
  getRandomFromFile() {
    if (!this.payloads) {
      throw new Error("Payloads file not loaded.");
    }
    const randomIndex = Math.floor(Math.random() * this.payloads.length);
    return this.payloads[randomIndex];
  }

  // Method to generate a random payload dynamically
  generateRandomPayload() {
    const randomNum = Math.floor(Math.random() * 1000); // Generate a reusable random number
    const types = ["raw"];
    const locations = ["Hamburg", "Berlin", "Munich"];

    return {
      ownerGroup: `ownerGroup ${randomNum}`,
      owner: `owner ${randomNum}`,
      ownerEmail: `ownerEmail${randomNum}@owner.mail`,
      contactEmail: `contactEmail${randomNum}@contact.mail`,
      sourceFolder: `/nfs/folder${randomNum}`,
      sourceFolderHost: "sourcefolder.host",
      creationTime: new Date().toISOString(),
      type: types[Math.floor(Math.random() * types.length)], // Randomly pick type
      description: `test for LoadTesting with seed ${randomNum}`,
      datasetName: `LoadTesting ${randomNum}`,
      principalInvestigator: "Armando Bermudez Martinez",
      creationLocation: locations[Math.floor(Math.random() * locations.length)],
      investigator: "armando@bermudez.martinez",
      inputDatasets: Math.random() > 0.5 ? `inputDataset ${randomNum}` : "",
      usedSoftware: Math.random() > 0.5 ? `Software ${randomNum}` : "",
    };
  }

  // Method to fetch a payload (either random or from file)
  getPayload(useRandom = true) {
    if (useRandom || !this.payloads) {
      return this.generateRandomPayload();
    }
    return this.getRandomFromFile();
  }

  // Method to fetch multiple payloads with an optional random count (up to maxCount)
  getPayloads(maxCount = 1, useRandomCount = false, useRandomPayload = true) {
    // Determine count: if useRandomCount is true, generate a random number up to maxCount
    const count = useRandomCount
      ? Math.floor(Math.random() * maxCount) + 1
      : maxCount;

    let result = [];
    for (let i = 0; i < count; i++) {
      result.push(this.getPayload(useRandomPayload)); // useRandom affects only the content
    }
    return result;
  }
}
