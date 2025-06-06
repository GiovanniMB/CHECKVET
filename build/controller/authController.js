document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita la recarga de la página
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch("/login/exitoso", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login exitoso");
            window.location.href = "/";
        } else {
            alert("Error en el login: " + (data.message || "Credenciales incorrectas"));
        }
    } catch (error) {
        console.error("Error en autenticación:", error);
    }
});