import {getRandomQues, newQuesState} from "../question.js";
import db from "../../db/db.js";
import fs from "node:fs";

export default function apiRoutes(app) {
    app.post("/login", async (req, res) => {
        const id = req.body?.playerId;
        if (!id) return res.status(400).json({
            success: false,
            message: "No player id received",
        })
        const player = db.prepare("SELECT * FROM players WHERE id = ?").get(id);
        if (!player) return res.status(400).json({
            success: false,
            message: "Wrong id. Player is not in the db",
        })
        req.session.player = player;
        req.session.questions = newQuesState;
        req.session.lives = 3;
        await req.session.save();

        return res.status(200).json({
            success: true,
            player: player,
        })
    })


    app.post("/api/guess/validation", async (req, res) => {
        console.log("start", req.session.player.score)

        let defeat = false;
        const guess = req.body?.guess;
        if (!guess) return res.status(400).json({
            success: false,
            answer: null,
            message: 'No files uploaded'
        });
        const questions = req.session?.questions;
        if (!questions || !questions.current?.answer) return res.status(500).json({
            success: false,
            answer: null,
            message: "questions state is missing"
        });

        if (guess !== questions.current.answer) {
            req.session.lives--;
            if (req.session.lives <= 0) defeat = true;
        } else {
            req.session.player.score++;
            db.prepare("UPDATE players SET score = ? WHERE id = ?")
                .run(req.session.player.score, req.session.player.id);
            await req.session.save();
        }
        console.log("new", req.session.player.score)


        return res.status(200).json({
            success: guess === questions.current.answer,
            score: req.session.player.score,
            defeat: defeat,
            answer: questions.current.answer,
            message: "Validation sent"
        });
    })

    app.get("/api/question/new", async (req, res) => {
        if (!req.session?.questions) return res.status(500).json({
            message: "questions state is missing"
        });
        const questions = req.session.questions;
        const question = getRandomQues(req, questions.showed);
        if (!question) return res.status(500).json({
            message: "error when getting a new random question"
        });
        req.session.questions.current = question;
        req.session.questions.showed.push(question.id);
        req.session.lives = 3;
        await req.session.save();

        const inputTemplate = fs.readFileSync("views/partials/guess-inputs.mst", "utf-8");
        const livesTemplate = fs.readFileSync("views/partials/lives.mst", "utf-8");

        return res.json({
            message: "success",
            question: question,
            inputs: questions.current?.answer?.split('') ?? [],
            lives: Array(req.session.lives).fill('') ?? [],
            templates: {
                inputs: inputTemplate,
                lives: livesTemplate
            }
        });
    });

    app.post('/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Could not log out'
                });
            }
            res.clearCookie('connect.sid');
            return res.status(200).json({
                success: true,
                message: 'Cookie cleared'
            });
        });
    });
}
