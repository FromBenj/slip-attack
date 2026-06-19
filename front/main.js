import './main.scss';
import guessInputsRender from "./js/guess.js";
// import {rotateFries} from "./js/fries.js";
import {submitSolution} from "./js/submission.js";
import {globalSetup} from "./js/global.js";
import {choosePlayer} from "./js/welcome.js";
import {askNewQues} from "./js/game.js";

const welcome = document.getElementById("welcome-page");
const game = document.getElementById("game-page");
document.addEventListener("DOMContentLoaded", () => {
    document.documentElement.style.visibility = 'visible';
    if (welcome) {
        choosePlayer();
    }
    if (game) {
        // Fries animation stopped for dev
        // rotateFries();
        globalSetup();
        guessInputsRender();
        submitSolution();
        askNewQues();
    }
})

console.log("Main is working 🔥")
