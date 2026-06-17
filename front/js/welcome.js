import gsap from "gsap";
import axios from "axios";

export function choosePlayer() {
    const players = document.getElementById("players-container");
    const profiles = players.querySelectorAll(".profile");
    if (!profiles.length) return;

    [...profiles].forEach((p) => selectProfile(p, profiles));
}

function selectProfile(profile, profiles) {
    if (!profiles.length) return;
    const otherPlayers = [...profiles].filter(player => player !== profile);

    profile.addEventListener("click", () => {
        const id = profile.dataset.id;
        if (!id) return;

        const tl = gsap.timeline();
        tl.to(otherPlayers, {
            opacity: 0,
            duration: 0.3,
            stagger: 0.1,
            ease: "power2.out",
        })
        gsap.to(profile, {
            rotation: 720,
            duration: 2,
            yoyo: true,
            ease: "power3.inOut",
            onComplete: async () => await login(profile),
        })
    })
}

async function login(profile) {
    await axios.post("/login", {
        playerId: profile.dataset.id,
    })
        .then((res) => {
            const success = res.data?.success;
            if (!success) console.log(res.data?.message);
            moveToGame(profile);
        })
        .catch((err) => console.log("Error when login player: ", err))
}

const moveToGame = (profile) => {
    const page = document.getElementById("welcome-page");
    if (!page) return;

    const tl = gsap.timeline();
    tl.to(profile, {
        x: window.innerWidth,
        duration: 0.3
    })
        .to(page, {
            opacity: 0,
            onComplete: () => window.location.href = "/slip"
        })
}

