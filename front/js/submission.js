import axios from 'axios';
import gsap from 'gsap';
import guessInputsRender, {filterGuess, getGuess} from "./guess.js";
import {removeLife} from "./life.js";
import {playerLost, playerWin} from "./defeat-victory.js";

export function submitSolution() {
    const button = document.getElementById("guess-button");
    if (!button) return;

    button.addEventListener('click', () => {
        if (!isGuessFull()) return;

        const guess = getGuess();
        axios.post('/api/guess/validation', {
            guess: guess,
        })
            .then((res) => {
                const success = res.data?.success;
                const answer = res.data?.answer;
                const score = res.data?.score;
                const defeat = res.data?.defeat;
                if (!defeat && !success) {
                    filterGuess(guess, answer);
                    removeLife();
                    return;
                }
                if (defeat) {
                    playerLost();
                } else if (success) {
                    if (typeof score === 'number') {
                        playerWin(score);
                    }
                }
            })
    })
}

export function updateButtonRender(btnOpacity = true) {
    const button = document.getElementById("guess-button");
    const inputsContainer = document.getElementById("guess-inputs-container");
    const inputs = inputsContainer?.querySelectorAll("input.guess-input");
    if (!inputs.length || !button || typeof btnOpacity !== 'boolean') return;

    const minOpacity = 0.3;
    const maxOpacity = 1;
    if (btnOpacity) button.style.opacity = `${minOpacity}`;
    inputs.forEach((input) => {
        input.addEventListener("input", () => {
            if (isGuessFull() && button.style.opacity === `${minOpacity}`) {
                btnOpacityAnim(maxOpacity);
                return;
            }
            if (!isGuessFull() && button.style.opacity !== `${minOpacity}`) {
                btnOpacityAnim(minOpacity);
            }
        })
    })
}

const isGuessFull = () => {
    const inputsContainer = document.getElementById("guess-inputs-container");
    const inputs = inputsContainer?.querySelectorAll("input.guess-input");
    if (!inputs.length) return;

    let fullState = true;
    inputs.forEach((input) => {
        if (input.value.trim() === "") {
            fullState = false;
        }
    })
    return fullState;
}

export function btnOpacityAnim(op) {
    const button = document.getElementById("guess-button");
    const opacity = typeof op === 'number' ? op : parseInt(op);
    if (Number.isNaN(opacity) || !button) return;

    gsap.to(button, {
        opacity: opacity,
        duration: 0.3,
        ease: "power2.out",
    })
}
