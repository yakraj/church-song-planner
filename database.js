const { client } = require("./mongodb");

async function getDocuments(collectionName, query) {
  try {
    const database = client.db("immanuel");
    const collection = database.collection(collectionName);

    // Perform the query
    const result = await collection.find(query).toArray();

    return result;
  } catch (error) {
    console.error("Failed to get documents from MongoDB:", error);
    throw error;
  }
}

module.exports = { getDocuments };
