const btnAgregar = document.querySelector("#btn-agregar");
const btnCancelar = document.querySelector('#btnCancelar');
const modal = document.querySelector("#modal");
const modalAdd = document.querySelector('#modal-add');
const inputNombre = modal.querySelector('.input-nombre');
const inputCantidad = modal.querySelector('.input-cantidad');
const inputCantidadMinima = modal.querySelector('.input-cantidad-minima');
const grid = document.querySelector('.Tarjetas-Grid');
const btnEliminar = document.querySelector('#btn-eliminar');
const btnEditar = document.querySelector('#btn-editar');

let editMode = false;
let editingCard = null;
let idCounter = Date.now();

// Function to get avisos from localStorage
function getAvisos() {
    const avisos = localStorage.getItem('avisos');
    return avisos ? JSON.parse(avisos) : [];
}

// Function to save avisos to localStorage
function saveAvisos(avisos) {
    localStorage.setItem('avisos', JSON.stringify(avisos));
}

// Function to create an aviso when quantity drops below minimum
function crearAviso(nombreInsumo, cantidadActual, cantidadMinima) {
    const avisos = getAvisos();
    const today = new Date();
    const fecha = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    const idAviso = `AV${String(avisos.length + 1).padStart(3, '0')}`;
    
    const nuevoAviso = {
        id: idAviso,
        mensaje: `El insumo ${nombreInsumo} llegó a una cantidad debajo del mínimo establecido!!`,
        fecha: fecha,
        insumo: nombreInsumo,
        cantidadActual: cantidadActual,
        cantidadMinima: cantidadMinima
    };
    
    avisos.push(nuevoAviso);
    saveAvisos(avisos);
    console.log('Aviso creado:', nuevoAviso);
}

// Function to check if quantity is below minimum and create aviso
function verificarCantidad(nombreInsumo, cantidad, cantidadMinima) {
    const cantActual = parseInt(cantidad);
    const cantMinima = parseInt(cantidadMinima);
    
    if (!isNaN(cantActual) && !isNaN(cantMinima) && cantActual < cantMinima) {
        crearAviso(nombreInsumo, cantActual, cantMinima);
    }
}

function escapeHtml(str) {
    const map = {
        '&': '&amp;',
        '<': '<',
        '>': '>',
        '"': '"',
        "'": '&#039;'
    };
    return String(str).replace(/[&<>"']/g, m => map[m]);
}

function createCardElement({ name, id, cantidad, cantidadMinima, imgSrc }) {
    const card = document.createElement('div');
    card.className = 'Tarjeta-Insumo';
    const cardId = id || `c${idCounter++}`;
    card.dataset.cardId = cardId;
    const cantidadMostrar = cantidadMinima ? `${cantidad}/${cantidadMinima}` : cantidad;
    card.innerHTML = `
        <div class="Tarjeta-Contenido">
            <img src="${imgSrc || '../Images/klipartz.com (1).png'}" alt="Imagen Insumo" class="Tarjeta-Imagen">
            <div class="Tarjeta-Datos">
                <h3>Nombre: ${escapeHtml(name)}</h3>
                <p>ID: ${escapeHtml(cardId)}</p>
                <p>Cantidad: ${escapeHtml(cantidadMostrar)}</p>
            </div>
        </div>
    `;
    card.addEventListener('click', (e) => {
        card.classList.toggle('selected');
    });
    return card;
}

function wireExistingCards() {
    document.querySelectorAll('.Tarjeta-Insumo').forEach(card => {
        card.addEventListener('click', () => card.classList.toggle('selected'));
    });
}

btnAgregar.addEventListener('click', () => {
    editMode = false;
    editingCard = null;
    modalAdd.textContent = 'Agregar';
    inputNombre.value = '';
    inputCantidad.value = '';
    inputCantidadMinima.value = '';
    modal.showModal();
});

modalAdd.addEventListener('click', () => {
    const name = inputNombre.value.trim();
    const cantidad = inputCantidad.value.trim();
    const cantidadMinima = inputCantidadMinima.value.trim();
    
    if (!name) {
        alert('Ingrese el nombre del insumo');
        return;
    }
    
    if (cantidad && cantidadMinima) {
        verificarCantidad(name, cantidad, cantidadMinima);
    }
    
    if (editMode && editingCard) {
        const datos = editingCard.querySelector('.Tarjeta-Datos');
        datos.querySelector('h3').textContent = `Nombre: ${name}`;
        const ps = datos.querySelectorAll('p');
        if (ps[1]) {
            const cantidadMostrar = cantidadMinima ? `${cantidad}/${cantidadMinima}` : cantidad;
            ps[1].textContent = `Cantidad: ${cantidadMostrar}`;
        }
    } else {
        const newCard = createCardElement({ name, cantidad, cantidadMinima });
        grid.appendChild(newCard);
        newCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    modal.close();
});

btnCancelar.addEventListener('click', () => {
    modal.close();
    editMode = false;
    editingCard = null;
});

btnEliminar.addEventListener('click', () => {
    const selected = grid.querySelectorAll('.Tarjeta-Insumo.selected');
    if (selected.length === 0) {
        alert('Seleccione al menos una tarjeta para eliminar');
        return;
    }
    if (!confirm(`Eliminar ${selected.length} elemento(s)?`)) return;
    selected.forEach(c => c.remove());
});

btnEditar.addEventListener('click', () => {
    const selected = grid.querySelectorAll('.Tarjeta-Insumo.selected');
    if (selected.length === 0) {
        alert('Seleccione una tarjeta para editar');
        return;
    }
    if (selected.length > 1) {
        alert('Seleccione solo una tarjeta para editar');
        return;
    }
    editingCard = selected[0];
    editMode = true;
    const datos = editingCard.querySelector('.Tarjeta-Datos');
    const nombre = datos.querySelector('h3').textContent.replace(/^Nombre:\s*/i, '');
    const ps = datos.querySelectorAll('p');
    const cantidadCompleta = (ps[1] && ps[1].textContent.replace(/^Cantidad:\s*/i, '')) || '';
    
    let cantidad = cantidadCompleta;
    let cantidadMinima = '';
    if (cantidadCompleta.includes('/')) {
        const partes = cantidadCompleta.split('/');
        cantidad = partes[0];
        cantidadMinima = partes[1];
    }
    
    inputNombre.value = nombre;
    inputCantidad.value = cantidad;
    inputCantidadMinima.value = cantidadMinima;
    modalAdd.textContent = 'Guardar';
    modal.showModal();
});

wireExistingCards();

