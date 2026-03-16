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
let editingRecibo = null;
let allRecibos = []; // Store all recibos for filtering

// Fetch and display recibos
async function loadRecibos() {
    try {
        const res = await fetch('/api/recibos');
        if (!res.ok) throw new Error('Error al cargar recibos');
        allRecibos = await res.json();
        handleSearch(); // Apply current search filter
    } catch (err) {
        console.error(err);
        alert('Error al cargar recibos');
    }
}

function renderRecibos(recibos) {
    grid.innerHTML = '';
    recibos.forEach(recibo => {
        const card = createCardElement(recibo);
        grid.appendChild(card);
    });
}

// Filter recibos based on search term (valor, insumos, empleado)
function filterRecibos(searchTerm) {
    if (!searchTerm.trim()) {
        return allRecibos;
    }
    const term = searchTerm.toLowerCase();
    return allRecibos.filter(recibo =>
        recibo.valor.toLowerCase().includes(term) ||
        recibo.insumos.toLowerCase().includes(term) ||
        (recibo.empleado || '').toLowerCase().includes(term)
    );
}

// Handle search input
function handleSearch() {
    const searchTerm = searchInput.value;
    const filteredRecibos = filterRecibos(searchTerm);
    renderRecibos(filteredRecibos);
}

function createCardElement(recibo) {
    const card = document.createElement('div');
    card.className = 'Tarjeta-Recibo';
    card.dataset.reciboId = recibo._id;
    card.innerHTML = `
        <div class="Tarjeta-Contenido">
            <img src="../Images/Recibo.png" alt="Imagen Recibo" class="Tarjeta-Imagen">
            <div class="Tarjeta-Datos">
                <h3>Valor: ${escapeHtml(recibo.valor)}</h3>
                <p>ID: ${recibo._id}</p>
                <p>Fecha: ${escapeHtml(recibo.fecha)}</p>
                <p>Insumos: ${escapeHtml(recibo.insumos)}</p>
                <p>Cantidades: ${escapeHtml(recibo.cantidades)}</p>
                <p>Empleado: ${escapeHtml(recibo.empleado)}</p>
            </div>
        </div>
    `;
    card.addEventListener('click', () => {
        card.classList.toggle('selected');
    });
    return card;
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

// Add new recibo
btnAgregar.addEventListener('click', () => {
    editMode = false;
    editingRecibo = null;
    modalAdd.textContent = 'Agregar';
    inputValor.value = '';
    inputFecha.value = '';
    inputInsumos.value = '';
    inputCantidades.value = '';
    inputEmpleados.value = '';
    modal.showModal();
});

modalAdd.addEventListener('click', async () => {
    const valor = inputValor.value.trim();
    const fecha = inputFecha.value.trim();
    const insumos = inputInsumos.value.trim();
    const cantidades = inputCantidades.value.trim();
    const empleado = inputEmpleados.value.trim();

    if (!valor || !fecha || !insumos || !cantidades || !empleado) {
        alert('Todos los campos son requeridos');
        return;
    }

    try {
        if (editMode && editingRecibo) {
            // Update
            const res = await fetch(`/api/recibos/${editingRecibo._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ valor, cantidades, empleado, fecha, insumos })
            });
            if (!res.ok) throw new Error('Error al actualizar');
        } else {
            // Create
            const res = await fetch('/api/recibos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ valor, cantidades, empleado, fecha, insumos })
            });
            if (!res.ok) throw new Error('Error al crear');
        }
        modal.close();
        loadRecibos(); // Reload list
    } catch (err) {
        console.error(err);
        alert('Error al guardar recibo');
    }
});

btnCancelar.addEventListener('click', () => {
    modal.close();
    editMode = false;
    editingRecibo = null;
});

// Delete selected recibos
btnEliminar.addEventListener('click', async () => {
    const selected = grid.querySelectorAll('.Tarjeta-Recibo.selected');
    if (selected.length === 0) {
        alert('Seleccione al menos un recibo para eliminar');
        return;
    }
    if (!confirm(`Eliminar ${selected.length} recibo(s)?`)) return;

    try {
        for (const card of selected) {
            const id = card.dataset.reciboId;
            const res = await fetch(`/api/recibos/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Error al eliminar');
        }
        loadRecibos(); // Reload list
    } catch (err) {
        console.error(err);
        alert('Error al eliminar recibos');
    }
});

// Edit selected recibo
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
    const card = selected[0];
    const id = card.dataset.reciboId;
    const datos = card.querySelector('.Tarjeta-Datos');
    const h3Text = datos.querySelector('h3').textContent.replace('Valor: ', '');
    const pTexts = Array.from(datos.querySelectorAll('p')).map(p => p.textContent);
    const fecha = pTexts.find(t => t.startsWith('Fecha:')).replace('Fecha: ', '');
    const insumos = pTexts.find(t => t.startsWith('Insumos:')).replace('Insumos: ', '');
    const cantidades = pTexts.find(t => t.startsWith('Cantidades:')).replace('Cantidades: ', '');
    const empleado = pTexts.find(t => t.startsWith('Empleado:')).replace('Empleado: ', '');

    editingRecibo = { _id: id };
    editMode = true;
    inputValor.value = h3Text;
    inputFecha.value = fecha;
    inputInsumos.value = insumos;
    inputCantidades.value = cantidades;
    inputEmpleados.value = empleado;
    modalAdd.textContent = 'Guardar';
    modal.showModal();
});

// Load recibos on page load
document.addEventListener('DOMContentLoaded', loadRecibos);

// Search functionality
if (searchInput) searchInput.addEventListener('input', handleSearch);

// Wire static cards if any (for initial load)
function wireExistingCards() {
    document.querySelectorAll('.Tarjeta-Recibo').forEach(card => {
        card.addEventListener('click', () => card.classList.toggle('selected'));
    });
}
function hideUsuariosLink() {
    const rol = localStorage.getItem('rol');
    if (rol !== 'admin') {
        const link = document.getElementById('link-usuarios');
        if (link) link.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    hideUsuariosLink();
    wireExistingCards();
});
