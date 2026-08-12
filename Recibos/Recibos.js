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
const searchInput = document.querySelector('.Barra-Busqueda');

let editMode = false;
let editingCard = null;
let idCounter = Date.now();
let allRecibos = [];

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
    if (_id) card.dataset.cardId = _id;
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

// --- Server-backed functions (load, search, render) ---
async function loadRecibos() {
    try {
        const res = await fetch('/api/recibos');
        if (!res.ok) throw new Error('Error loading recibos');
        allRecibos = await res.json();
        handleSearch();
    } catch (err) {
        console.error(err);
        alert('Error al cargar recibos');
    }
}

function renderRecibos(recibos) {
    grid.innerHTML = '';
    recibos.forEach(r => grid.appendChild(createCardElement(r)));
}

function filterRecibos(term) {
    if (!term || !term.trim()) return allRecibos;
    const t = term.toLowerCase();
    return allRecibos.filter(r => (
        (r.valor || '').toLowerCase().includes(t) ||
        (r.insumos || '').toLowerCase().includes(t) ||
        (r.empleado || '').toLowerCase().includes(t)
    ));
}

function handleSearch() {
    const term = searchInput ? searchInput.value : '';
    const filtered = filterRecibos(term);
    renderRecibos(filtered);
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
    (async function saveRecibo() {
        try {
            if (editMode && editingCard && editingCard.dataset.cardId) {
                const id = editingCard.dataset.cardId;
                const res = await fetch(`/api/recibos/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ valor, cantidades, empleado: empleados, fecha, insumos })
                });
                if (!res.ok) throw new Error('Error updating recibo');
            } else {
                const res = await fetch('/api/recibos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ valor, cantidades, empleado: empleados, fecha, insumos })
                });
                if (!res.ok) throw new Error('Error creating recibo');
            }
            modal.close();
            await loadRecibos();
        } catch (err) {
            console.error(err);
            alert('Error al guardar recibo');
        }
    })();
});

// modal cancelar
btnCancelar.addEventListener('click', () => {
    modal.close();
    editMode = false;
    editingCard = null;
});

// para eliminar recibos elegdos
btnEliminar.addEventListener('click', () => {
    (async function deleteSelected() {
        const selected = grid.querySelectorAll('.Tarjeta-Recibo.selected');
        if (selected.length === 0) {
            alert('Seleccione al menos un recibo para eliminar');
            return;
        }
        if (!confirm(`Eliminar ${selected.length} recibo(s)?`)) return;
        try {
            for (const c of selected) {
                const id = c.dataset.cardId;
                if (!id) continue;
                const res = await fetch(`/api/recibos/${id}`, { method: 'DELETE' });
                if (!res.ok) throw new Error('Error deleting recibo');
            }
            await loadRecibos();
        } catch (err) {
            console.error(err);
            alert('Error al eliminar recibos');
        }
    })();
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
    const id = editingCard.dataset.cardId;
    // find recibo data from allRecibos
    const recibo = allRecibos.find(r => String(r._id) === String(id));
    if (!recibo) {
        alert('Datos del recibo no encontrados');
        return;
    }
    inputValor.value = recibo.valor || '';
    inputFecha.value = recibo.fecha || '';
    inputInsumos.value = recibo.insumos || '';
    inputCantidades.value = recibo.cantidades || '';
    inputEmpleados.value = recibo.empleado || '';
    modalAdd.textContent = 'Guardar';
    modal.showModal();
});


wireExistingCards();
// Init server-backed list and search wiring
document.addEventListener('DOMContentLoaded', () => {
    if (searchInput) searchInput.addEventListener('input', handleSearch);
    loadRecibos();
});
