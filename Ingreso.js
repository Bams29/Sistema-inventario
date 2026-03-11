async function loguear() {
    const user = document.getElementById("usuario").value;
    const pass = document.getElementById("clave").value;

    if (!user || !pass) {
        alert("Por favor, ingresa usuario y contraseña.");
        return;
    }

    try {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario: user, clave: pass })
        });
        const data = await res.json();

        if (res.ok) {
            // opcionalmente puedes guardar el rol o token en localStorage
            window.location.href = "Inventario/Inventario.html";
        } else {
            alert(data.message || "Credenciales incorrectas");
        }
    } catch (err) {
        console.error(err);
        alert("No se pudo conectar con el servidor.");
    }
}