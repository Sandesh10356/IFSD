const prompt = require('prompt-sync')();
const { MongoClient, ObjectId } = require('mongodb');

class Player {
  constructor(name, score) {
    this.name = name;
    this.score = score;
  }
}

class TeamDB {
  constructor(collection) {
    this.collection = collection;
  }

  async addPlayer(player) {
    await this.collection.insertOne(player);
  }

  async updatePlayer(playerId, updatedPlayer) {
    await this.collection.updateOne({ _id: new ObjectId(playerId) }, { $set: updatedPlayer });
  }

  async deletePlayer(playerId) {
    await this.collection.deleteOne({ _id: new ObjectId(playerId) });
  }

  async calculateAverageScore() {
    const result = await this.collection.aggregate([{ $group: { _id: null, averageScore: { $avg: "$score" } } }]).toArray();
    return result[0].averageScore || 0;
  }

  async calculateMinimumScore() {
    const result = await this.collection.aggregate([{ $group: { _id: null, minimumScore: { $min: "$score" } } }]).toArray();
    return result[0].minimumScore || 0;
  }

  async calculateMaximumScore() {
    const result = await this.collection.aggregate([{ $group: { _id: null, maximumScore: { $max: "$score" } } }]).toArray();
    return result[0].maximumScore || 0;
  }

  async getAllPlayers() {
    const players = await this.collection.find().toArray();
    return players;
  }
}

async function main() {
  const uri = 'mongodb+srv://sandeshahubsc22:sandy123@cluster0.ies233z.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB connection URI
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = 'player123'; // Replace with your database name
    const collectionName = 'test123'; // Replace with your collection name

    const db = client.db(database);
    const collection = db.collection(collectionName);

    const team = new TeamDB(collection);

    const operation = parseInt(prompt("Select an operation:\n1. Add Player\n2. Update Player\n3. Delete Player\n4. Calculate Average Score\n5. Calculate Minimum Score\n6. Calculate Maximum Score\n7. Get All Players\n"));

    switch (operation) {
      case 1:
        console.log("Add Player:");
        const nameToAdd = prompt("Enter the name of the player: ");
        const scoreToAdd = parseFloat(prompt("Enter the score of the player: "));
        const playerToAdd = new Player(nameToAdd, scoreToAdd);
        await team.addPlayer(playerToAdd);
        console.log("Player added successfully.");
        break;

      case 2:
        console.log("Update Player:");
        const playerIdToUpdate = prompt("Enter the ID of the player to update: ");
        const nameToUpdate = prompt("Enter the updated name of the player: ");
        const scoreToUpdate = parseFloat(prompt("Enter the updated score of the player: "));
        const playerToUpdate = new Player(nameToUpdate, scoreToUpdate);
        await team.updatePlayer(playerIdToUpdate, playerToUpdate);
        console.log("Player updated successfully.");
        break;

      case 3:
        console.log("Delete Player:");
        const playerIdToDelete = prompt("Enter the ID of the player to delete: ");
        await team.deletePlayer(playerIdToDelete);
        console.log("Player deleted successfully.");
        break;

      case 4:
        console.log(`Average score: ${await team.calculateAverageScore()}`);
        break;

      case 5:
        console.log(`Minimum score: ${await team.calculateMinimumScore()}`);
        break;

      case 6:
        console.log(`Maximum score: ${await team.calculateMaximumScore()}`);
        break;

      case 7:
        const allPlayers = await team.getAllPlayers();
        console.log("All Players:");
        console.log(allPlayers);
        break;

      default:
        console.log("Invalid operation.");
        break;
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

main();
