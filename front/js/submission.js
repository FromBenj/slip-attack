import axios from 'axios';
import gsap from 'gsap';
import {filterGuess, getGuess} from "./guess.js";
import {removeLife} from "./life.js";
import {playerLost} from "./defeat-victory.js";


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
                console.log(res.data)
                const success = res.data?.success;
                const answer = res.data?.answer;
                const defeat = res.data?.defeat;
                if(defeat) {
                    playerLost();
                    return;
                }
                if (!success) {
                    filterGuess(guess, answer);
                    removeLife();
                    return;
                }
                const plate = document.getElementById("fries-plate");
                const page = document.getElementById("game-page");
                console.log("CHECK THIS")
                if (!page || !plate) return;
                const tl = gsap.timeline();
                                tl.to("#game-page > *:not(#game-body)", { opacity: 0, duration: 0.5 })
                                    .to("#fries-plate", { scale: 3, duration: 1 });
                            })
            })
    }

export function updateButtonRender() {
    const button = document.getElementById("guess-button");
    const inputsContainer = document.getElementById("guess-inputs-container");
    const inputs = inputsContainer?.querySelectorAll("input.guess-input");
    if (!inputs.length || !button) return;

    const minOpacity = 0.3;
    const maxOpacity = 1;
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

export function btnOpacityAnim(op){
    const button = document.getElementById("guess-button");
    const opacity = typeof op === 'number' ? op : parseInt(op);
    if (Number.isNaN(opacity) || !button) return;

    gsap.to(button, {
        opacity: opacity,
        duration: 0.3,
        ease: "power2.out",
    })
}
