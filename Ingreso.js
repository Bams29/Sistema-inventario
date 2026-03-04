function loguear() {
    let user = document.getElementById("usuario").value;
    let pass = document.getElementById("clave").value;

    // meu deus
    if (!user || !pass) {
        alert("Por favor, ingresa usuario y contraseña.");
        return;
    }


    if (user === "pedro" && pass === "4321") {
        window.location.href = "Inventario/Inventario.html";
    } else {
        alert("Credenciales incorrectas!!");
    }
}