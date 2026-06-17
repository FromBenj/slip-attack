import gsap from "gsap";

export function rotateFries() {
    const fries = document.getElementById("fries-plate");
    if (!fries) return;

    gsap.to(fries, {
        rotation: 360,
        duration: 14,
        repeat: -1,
        yoyo: true,
        ease: "elastic.inOut"
    });
}
