import db from "../db/db.js";

export const newQuesState = {
    current: null,
    showed: []
}

export function getRandomQues(req, showedIds) {
    if (!Array.isArray(showedIds)) return null;

    const cleanShowedIds = cleanQuesIds(showedIds);
    const placeholders = cleanShowedIds.map(() => '?').join(',');
    const question = db.prepare(`
        SELECT *
        FROM questions
        WHERE id NOT IN (${placeholders})
        ORDER BY RANDOM()
        LIMIT 1
    `).get(...cleanShowedIds);

    if (!question) {
        req.session.questions = newQuesState;
        return getRandomQues(req, req.session.questions.showed)
    }

    return question;
}

function cleanQuesIds(quesIds) {
    if (quesIds.length === 0) return [];

    const placeholders = quesIds.map(() => '?').join(', ');
    const rows = db.prepare(`
        SELECT id
        FROM questions
        WHERE id IN (${placeholders})
    `).all(...quesIds);
    const cleanIds = rows.map(row => row.id);
    if (cleanIds.length !== quesIds.length) console.log("Problem in cleanQues");

    return cleanIds;
}
