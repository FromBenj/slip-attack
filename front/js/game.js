import axios from "axios";
import customListener from "./event.js";
import Mustache from "mustache";
import {autoJump} from "./guess.js";
import {btnOpacityAnim, updateButtonRender} from "./submission.js";

export function askNewQues() {
    const btn = document.getElementById("new-question-btn");
    if (!btn) return;

    customListener(btn, setNewQues);
}


export function setNewQues() {
    const question = document.getElementById("question");
    const btn = document.getElementById("guess-button");
    if (!question) return;
    axios.get('/api/question/new')
        .then((res) => {
            const data = res.data;
            if (!data.question || !data.inputs || !data.templates || !data.lives) return;
            question.innerText = "";
            question.innerText = data.question.title;
            const guessContainer = document.getElementById("guess-inputs-container");
            const livesContainer = document.getElementById("lives-container");

            if (!guessContainer || !livesContainer) return;
            guessContainer.innerHTML = "";
            guessContainer.innerHTML = Mustache.render(data.templates.inputs, {
                inputs: data.inputs,
            });
            livesContainer.innerHTML = "";
            livesContainer.innerHTML = Mustache.render(data.templates.lives, {
                lives: data.lives
            })
            btnOpacityAnim(0.3);
            updateButtonRender();
            autoJump();

        })
        .catch((err) => console.log("Error when fetching a new question: ", err))
}
