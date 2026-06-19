import db from "../db.js";
import players from "./players.js";
import questions from "./questions.js";

const insertPlayer = db.prepare(`
  INSERT OR IGNORE INTO players (name, avatar, score) VALUES (@name, @avatar, @score)
`);
const insertQuestion = db.prepare(`
  INSERT OR REPLACE INTO questions (title, answer, difficulty) VALUES (@title, @answer, @difficulty)
`);

const seedPlayers = db.transaction((players) => {
    for (const player of players) {
        insertPlayer.run(player);
    }
});

const seedQuestions = db.transaction((questions) => {
    for (const question of questions) {
        insertQuestion.run(question);
    }
});

seedPlayers(players);
seedQuestions(questions);

console.log('✅ Seeded');
console.log(`${players.length} players and ${questions.length} questions`);

db.close();
