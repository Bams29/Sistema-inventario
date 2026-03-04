const btnAgregar = document.querySelector("#btn-agregar");
const btnCancelar = document.querySelector('#btnCancelar');
const modal = document.querySelector("#modal");
const modalAdd = document.querySelector('#modal-add');
const inputValor = modal.querySelector('.input-valor');
const inputFecha = modal.querySelector('.input-fecha');
const inputInsumos = modal.querySelector('.input-insumos');
const inputCantidades = modal.querySelector('.input-cantidades');
const inputEmpleados = modal.querySelector('.input-empleados');
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

function createCardElement({ valor, fecha, insumos, cantidades, empleados, imgSrc }) {
    const card = document.createElement('div');
    card.className = 'Tarjeta-Recibo';
    const cardId = `r${idCounter++}`;
    card.dataset.cardId = cardId;
    card.innerHTML = `
        <div class="Tarjeta-Contenido">
            <img src="${imgSrc || '../Images/Recibo.png'}" alt="Imagen Recibo" class="Tarjeta-Imagen">
            <div class="Tarjeta-Datos">
                <h3>Valor: ${escapeHtml(valor)}</h3>
                <p>Fecha: ${escapeHtml(fecha)}</p>
                <p>Insumos: ${escapeHtml(insumos)}</p>
                <p>Cantidad: ${escapeHtml(cantidades)}</p>
                <p>Empleado: ${escapeHtml(empleados)}</p>
            </div>
        </div>
    `;
    card.addEventListener('click', () => {
        card.classList.toggle('selected');
    });
    return card;
}

function wireExistingCards() {
    document.querySelectorAll('.Tarjeta-Recibo').forEach(card => {
        card.addEventListener('click', () => card.classList.toggle('selected'));
    });
}

// Abrir el modar de agregar
btnAgregar.addEventListener('click', () => {
    editMode = false;
    editingCard = null;
    modalAdd.textContent = 'Agregar';
    inputValor.value = '';
    inputFecha.value = '';
    inputInsumos.value = '';
    inputCantidades.value = '';
    inputEmpleados.value = '';
    modal.showModal();
});

// botones guardar agregar
modalAdd.addEventListener('click', () => {
    const valor = inputValor.value.trim();
    const fecha = inputFecha.value.trim();
    const insumos = inputInsumos.value.trim();
    const cantidades = inputCantidades.value.trim();
    const empleados = inputEmpleados.value.trim();
    
    if (!valor) {
        alert('Ingrese el valor del recibo');
        return;
    }
    if (editMode && editingCard) {
        // aca para actualizar tajetas existentes
        const datos = editingCard.querySelector('.Tarjeta-Datos');
        datos.querySelector('h3').textContent = `Valor: ${valor}`;
        const ps = datos.querySelectorAll('p');
        if (ps[0]) ps[0].textContent = `Fecha: ${fecha}`;
        if (ps[1]) ps[1].textContent = `Insumos: ${insumos}`;
        if (ps[2]) ps[2].textContent = `Cantidad: ${cantidades}`;
        if (ps[3]) ps[3].textContent = `Empleado: ${empleados}`;
    } else {
        // crear nueva tarjeta
        const newCard = createCardElement({ valor, fecha, insumos, cantidades, empleados });
        grid.appendChild(newCard);
        newCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    modal.close();
});

// modal cancelar
btnCancelar.addEventListener('click', () => {
    modal.close();
    editMode = false;
    editingCard = null;
});

// para eliminar recibos elegdos
btnEliminar.addEventListener('click', () => {
    const selected = grid.querySelectorAll('.Tarjeta-Recibo.selected');
    if (selected.length === 0) {
        alert('Seleccione al menos un recibo para eliminar');
        return;
    }
    if (!confirm(`Eliminar ${selected.length} recibo(s)?`)) return;
    selected.forEach(c => c.remove());
});

// Editar recibos
btnEditar.addEventListener('click', () => {
    const selected = grid.querySelectorAll('.Tarjeta-Recibo.selected');
    if (selected.length === 0) {
        alert('Seleccione un recibo para editar');
        return;
    }
    if (selected.length > 1) {
        alert('Seleccione solo un recibo para editar');
        return;
    }
    editingCard = selected[0];
    editMode = true;
     
    const datos = editingCard.querySelector('.Tarjeta-Datos');
    const h3 = datos.querySelector('h3').textContent.replace(/^Valor:\s*/i, '');
    const ps = datos.querySelectorAll('p');
    const fecha = (ps[0] && ps[0].textContent.replace(/^Fecha:\s*/i, '')) || '';
    const insumos = (ps[1] && ps[1].textContent.replace(/^Insumos:\s*/i, '')) || '';
    const cantidades = (ps[2] && ps[2].textContent.replace(/^Cantidad:\s*/i, '')) || '';
    const empleados = (ps[3] && ps[3].textContent.replace(/^Empleado:\s*/i, '')) || '';
    
    inputValor.value = h3;
    inputFecha.value = fecha;
    inputInsumos.value = insumos;
    inputCantidades.value = cantidades;
    inputEmpleados.value = empleados;
    modalAdd.textContent = 'Guardar';
    modal.showModal();
});


wireExistingCards();
