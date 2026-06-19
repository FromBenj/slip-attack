import {newQuesState, getRandomQues} from "../question.js";
import apiRoutes from "./apis.js";
import db from "../../db/db.js";

export default function setRoutes(app) {
    apiRoutes(app);

    app.get("/", (req, res) => {
        const players = db.prepare('SELECT * FROM players').all();

        res.render("welcome", {
            mainScript: process.env.MAIN_SCRIPT,
            mainStyles: process.env.MAIN_STYLES,
            players: players
        });
    });

    app.get("/slip", async (req, res) => {
        if (!req.session?.player) return res.redirect("/");
        if (!req.session?.questions) req.session.questions = newQuesState;
        if (!req.session?.lives) req.session.lives = 3;
        if (req.session?.lives < 0) req.session.lives = 0;
            const questions = req.session.questions;
        if (!questions.current) {
            const question = getRandomQues(req, questions.showed);
            if (question) {
                questions.current = question;
                questions.showed.push(question.id);
                req.session.questions = questions;
            }
        }
        await req.session.save();

        res.render("game", {
            mainScript: process.env.MAIN_SCRIPT,
            mainStyles: process.env.MAIN_STYLES,
            title: questions.current?.title ?? "",
            inputs: questions.current?.answer?.split('') ?? [],
            player: req.session.player,
            lives: Array(req.session.lives).fill('') ?? [],
        });
    });

    app.use((req, res) => {
        res.redirect("/");
    })
}

