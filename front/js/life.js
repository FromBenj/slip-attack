import gsap from "gsap";

export function removeLife() {
    const container = document.getElementById("lives-container");
    const chances = container?.querySelectorAll(".life");
    const chance = chances[chances.length - 1];
    gsap.to(chance, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
            chance.remove();
        }
    })
}
