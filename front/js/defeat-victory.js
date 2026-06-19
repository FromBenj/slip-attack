import gsap from "gsap";
import {setNewQues} from "./game.js";

export function playerLost() {
    const page = document.getElementById("game-page");
    const container = document.getElementById("slips-container");
    const slips = document.getElementsByClassName("slip");
    const message = document.getElementById("defeat-message");
    if (!page || !container || !slips) return;

    container.innerHTML = container.innerHTML.repeat(2);

    const tlOpacity = gsap.timeline();
    tlOpacity.to(page, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
    })
        .to([container, message], {
            opacity: 1,
            duration: 0.6,
            ease: "power2.in",
            onStart: () => {
                container.style.display = "flex";
                message.style.display = "block";
            },
            onComplete: () => {
                setNewQues();
            }
        })

    const tlBg = gsap.timeline({repeat: -1, yoyo: true});
    tlBg.to(container, {backgroundColor: "#ff6b6b", duration: 0.4, ease: "power2.inOut"})
        .to(container, {backgroundColor: "#e9c46a", duration: 0.4, ease: "power2.inOut"})
        .to(container, {backgroundColor: "#264653", duration: 0.4, ease: "power2.inOut"});

    const tlSlip = gsap.timeline();
    tlSlip.set(slips, {y: "-200vh", opacity: 1})
        .to(slips, {
            y: "100vh",
            ease: "bounce.out",
            duration: 2,
            scale: 1.5,
            stagger: 0.3,
            onComplete: () => {
                tlBg.kill();
                page.style.opacity = "1";
                container.style.opacity = "0";
                container.style.display = "none";
                message.style.opacity = "0";
                message.style.display = "0";
            }
        });
}


export function playerWin(score) {
    const plate = document.getElementById("fries-plate");
    const page = document.getElementById("game-page");
    const btn = document.getElementById("guess-button");
    if (!page || !plate || !btn) return;

    const vanishElements = [
        "#game-page > :not(#game-body",
        "#question", "#lives-container",
        "#guess-inputs-container",
    ];


    const tl = gsap.timeline();
    tl.to(plate, {
        top: "-50%",
        yPercent: 50,
        duration: 0.2,
        ease: "power2.out"
    })
        .to(vanishElements,
            {
                opacity: 0,
                duration: 0.4,
            })
        .to(btn, {
            opacity: 0,
            duration: 0.4,
        })
        .to(plate,
            {
                scale: 3,
                rotate: 360,
                duration: 1,
                repeat: 2,
                yoyo: true,
                ease: "elastic.out(1, 0.7)"
            })
        .to(plate, {
            top: 0,
            yPercent: 0,
            duration: 0.2,
            ease: "power2.out"
        })
        .to([...vanishElements, plate],
            {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                onStart: () => {
                    setNewQues(false);
                    setNewScore(score);
                }
            })
        .to(btn,
            {
                opacity: 0.3,
                scale: 1,
                duration: 0.4,
                onComplete: () => tl.kill()
            })
}

const setNewScore = (score) => {
    const scoreArea = document.getElementById("score");
    if (!scoreArea || typeof score !== "number") return;

    scoreArea.innerText = score;
}
