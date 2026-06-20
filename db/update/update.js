import db from "../db.js";
import players from "./players.js";
import questions from "./questions.js";

const insertPlayer = db.prepare(`
  INSERT OR IGNORE INTO players (name, avatar, score) VALUES (@name, @avatar, @score)
`);
const insertQuestion = db.prepare(`
  INSERT OR REPLACE INTO questions (title, answer, difficulty) VALUES (@title, @answer, @difficulty)
`);

function updatePlayers(players) {
    db.exec('BEGIN');
    try {
        for (const player of players) {
            insertPlayer.run(player);
        }
        db.exec('COMMIT');
    } catch (err) {
        db.exec('ROLLBACK');
        throw err;
    }
}

function updateQuestions(questions) {
    db.exec('BEGIN');
    try {
        for (const question of questions) {
            insertQuestion.run(question);
        }
        db.exec('COMMIT');
    } catch (err) {
        db.exec('ROLLBACK');
        throw err;
    }
}

updatePlayers(players);
updateQuestions(questions);

console.log('✅ updated');
console.log(`${players.length} players and ${questions.length} questions`);

db.close();
