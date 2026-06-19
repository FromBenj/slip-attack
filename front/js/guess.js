import gsap from "gsap";
import {updateButtonRender} from "./submission.js";

const green = "#2a9d8f";
const red = "#e76f51";

export default function guessInputsRender(btnOpacity = true) {
    const inputContainer = document.getElementById("guess-inputs-container");
    const inputs = inputContainer?.querySelectorAll(".guess-input");
    if (!inputs.length) return;

    filledInputStyle();
    autoJump();
    updateButtonRender(btnOpacity);
}

export function getGuess() {
    let guess = '';
    const inputContainer = document.getElementById("guess-inputs-container");
    const inputs = inputContainer?.querySelectorAll(".guess-input");
    if (!inputs.length) return;

    inputs.forEach((input) => {
        guess += input.value;
    })

    return guess;
}

export function renderLetter(input, status) {
    if (!input || typeof status !== 'boolean') return;

    if (status) {
        gsap.to(input, {
            backgroundColor: green,
            duration: 0.5,
            ease: "power2.out",
        });
        return;
    }
    const tl = gsap.timeline();
    tl.to(input, {
        backgroundColor: red,
        duration: 0.5,
        ease: "power2.out",
    })
        .to(input, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
            clearProps: "backgroundColor"
        })
        .to(input, {
            opacity: 1,
            duration: 0.2,
            ease: "power2.in",
            onstart: () => {
                input.value = "";
                guessInputsRender();
            }
        })
}

export function filterGuess(guess, answer) {
    const inputContainer = document.getElementById("guess-inputs-container");
    const inputs = inputContainer?.querySelectorAll(".guess-input");
    if (!inputs.length || !guess.length || typeof guess !== "string" || guess.length !== answer.length) return;

    for (let i = 0; i < inputs.length; i++) {
        const isCorrect = guess[i] === answer[i];
        renderLetter(inputs[i], isCorrect);
    }
}


export function autoJump() {
    const inputContainer = document.getElementById("guess-inputs-container");
    const inputs = inputContainer?.querySelectorAll(".guess-input");
    if (!inputs.length) return;

    inputs.forEach((input) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1) {
                const next = input.nextElementSibling;
                if (next) next.focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value.length) {
                const prev = input.previousElementSibling;
                (prev || input).focus();
            } else {
                input.select();
            }
        });

        input.addEventListener('click', () => {
            input.focus()
        });
    });
}

function filledInputStyle() {
    const inputContainer = document.getElementById("guess-inputs-container");
    const inputs = inputContainer?.querySelectorAll(".guess-input");
    if (!inputs.length) return;

    inputs.forEach((input, i) => {
        input.classList.remove("input-filled");
        input.addEventListener("blur", (e) => {
            if (input.value.trim().length !== 1) {
                input.value = "";
                if (input.classList.contains("input-filled")) input.classList.remove("input-filled");
                return;
            }
            input.classList.add("input-filled");
        })
    })
}
