const prompt = require('prompt-sync')();

class Player {
  constructor(name, score) {
    this.name = name;
    this.score = score;
  }
}

class Team {
  constructor() {
    this.players = [];  
  }

  addPlayer(player) {
    this.players.push(player);
  }

  calculateAverageScore() {
    const totalScore = this.players.reduce((sum, player) => sum + player.score, 0);
    return totalScore / this.players.length;
  }

  calculateMinimumScore() {
    return this.players.reduce((minScore, player) => Math.min(minScore, player.score), Infinity);
  }

  calculateMaximumScore() {
    return this.players.reduce((maxScore, player) => Math.max(maxScore, player.score), -Infinity);
  }
}

function main() {
  const team = new Team();

  const n = parseInt(prompt("Enter the number of players in the team: "));

  for (let i = 1; i <= n; i++) {
    console.log(`Player ${i}:`);
    const name = prompt("Enter the name of the player: ");
    const score = parseFloat(prompt("Enter the score of the player: "));

    team.addPlayer(new Player(name, score));
  }

  console.log(`Average score: ${team.calculateAverageScore()}`);
  console.log(`Minimum score: ${team.calculateMinimumScore()}`);
  console.log(`Maximum score: ${team.calculateMaximumScore()}`);
}

main();