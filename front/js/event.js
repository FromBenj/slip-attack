export default function customListener(el, callBack) {
    const types = ["click", "touchstart"];
    types.forEach((t) => {
        el.addEventListener(t, callBack);
    })
    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            callBack(e);
        }
    });
}
