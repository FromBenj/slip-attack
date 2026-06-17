import axios from "axios";

export function globalSetup() {
    logout();
}

function logout() {
    const btn = document.getElementById("logout");
    if (!btn) return;

    btn.addEventListener('click', () => {
        axios.post("/logout")
            .then((res) => {
                const success = res.data?.success;
                if (success) window.location.href= "/";
            })
            .catch((error) => console.log("Error in logout: ", error))
    })
}
