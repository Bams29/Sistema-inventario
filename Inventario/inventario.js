const btnAgregar = document.querySelector("#btn-agregar");
const btnCancelar = document.querySelector('#btnCancelar');
const modal = document.querySelector("#modal");
const modalAdd = document.querySelector('#modal-add');
const inputNombre = modal.querySelector('.input-nombre');
const inputCantidad = modal.querySelector('.input-cantidad');
const grid = document.querySelector('.Tarjetas-Grid');
const btnEliminar = document.querySelector('#btn-eliminar');
const btnEditar = document.querySelector('#btn-editar');

let editMode = false;
let editingCard = null;
let idCounter = Date.now();

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function createCardElement({ name, id, cantidad, imgSrc }) {
    const card = document.createElement('div');
    card.className = 'Tarjeta-Insumo';
    const cardId = id || `c${idCounter++}`;
    card.dataset.cardId = cardId;
    card.innerHTML = `
        <div class="Tarjeta-Contenido">
            <img src="${imgSrc || '../Images/klipartz.com (1).png'}" alt="Imagen Insumo" class="Tarjeta-Imagen">
            <div class="Tarjeta-Datos">
                <h3>Nombre: ${escapeHtml(name)}</h3>
                <p>ID: ${escapeHtml(cardId)}</p>
                <p>Cantidad: ${escapeHtml(cantidad)}</p>
            </div>
        </div>
    `;
    card.addEventListener('click', (e) => {
        // para poder elegir cards
        card.classList.toggle('selected');
    });
    return card;
}

function wireExistingCards() {
    document.querySelectorAll('.Tarjeta-Insumo').forEach(card => {
        card.addEventListener('click', () => card.classList.toggle('selected'));
    });
}

// para abrir el modal al agrefar
btnAgregar.addEventListener('click', () => {
    editMode = false;
    editingCard = null;
    modalAdd.textContent = 'Agregar';
    inputNombre.value = '';
    inputCantidad.value = '';
    modal.showModal();
});

// Modal add/save button
modalAdd.addEventListener('click', () => {
    const name = inputNombre.value.trim();
    const cantidad = inputCantidad.value.trim();
    if (!name) {
        alert('Ingrese el nombre del insumo');
        return;
    }
    if (editMode && editingCard) {
        const datos = editingCard.querySelector('.Tarjeta-Datos');
        datos.querySelector('h3').textContent = `Nombre: ${name}`;
        const ps = datos.querySelectorAll('p');
        if (ps[1]) ps[1].textContent = `Cantidad: ${cantidad}`;
    } else {
        const newCard = createCardElement({ name, cantidad });
        grid.appendChild(newCard);
        // scrolear
        newCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    modal.close();
});

// Cancelar moda
btnCancelar.addEventListener('click', () => {
    modal.close();
    editMode = false;
    editingCard = null;
});

// Deletetear cards
btnEliminar.addEventListener('click', () => {
    const selected = grid.querySelectorAll('.Tarjeta-Insumo.selected');
    if (selected.length === 0) {
        alert('Seleccione al menos una tarjeta para eliminar');
        return;
    }
    if (!confirm(`Eliminar ${selected.length} elemento(s)?`)) return;
    selected.forEach(c => c.remove());
});

// Editar cartass escogidas
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
    const cantidad = (ps[1] && ps[1].textContent.replace(/^Cantidad:\s*/i, '')) || '';
    inputNombre.value = nombre;
    inputCantidad.value = cantidad;
    modalAdd.textContent = 'Guardar';
    modal.showModal();
});




wireExistingCards();
