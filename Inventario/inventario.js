const btnAgregar = document.querySelector("#btn-agregar");
const btnCancelar = document.querySelector('#btnCancelar');
const modal = document.querySelector("#modal");
const modalAdd = document.querySelector('#modal-add');
const inputNombre = modal.querySelector('.input-nombre');
const inputCantidad = modal.querySelector('.input-cantidad');
const inputCantidadMinima = modal.querySelector('.input-cantidad-minima');
const inputMedida = modal.querySelector('.input-medida');
const grid = document.querySelector('.Tarjetas-Grid');
const btnEliminar = document.querySelector('#btn-eliminar');
const btnEditar = document.querySelector('#btn-editar');
const searchInput = document.querySelector('.Barra-Busqueda');

let editMode = false;
let editingInsumo = null;
let allInsumos = []; // Store all insumos for filtering

// Fetch and display insumos
async function loadInsumos() {
    try {
        const res = await fetch('/api/insumos');
        if (!res.ok) throw new Error('Error al cargar insumos');
        allInsumos = await res.json();
        handleSearch(); // Apply current search filter
    } catch (err) {
        console.error(err);
        alert('Error al cargar insumos');
    }
}

function renderInsumos(insumos) {
    grid.innerHTML = '';
    insumos.forEach(insumo => {
        const card = createCardElement(insumo);
        grid.appendChild(card);
    });
}

// Filter insumos based on search term
function filterInsumos(searchTerm) {
    if (!searchTerm.trim()) {
        return allInsumos;
    }
    const term = searchTerm.toLowerCase();
    return allInsumos.filter(insumo =>
        insumo.nombre.toLowerCase().includes(term)
    );
}

// Handle search input
function handleSearch() {
    const searchTerm = searchInput.value;
    const filteredInsumos = filterInsumos(searchTerm);
    renderInsumos(filteredInsumos);
}

function createCardElement(insumo) {
    const card = document.createElement('div');
    card.className = 'Tarjeta-Insumo';
    card.dataset.insumoId = insumo._id;
    card.innerHTML = `
        <div class="Tarjeta-Contenido">
            <img src="../Images/klipartz.com (1).png" alt="Imagen Insumo" class="Tarjeta-Imagen">
            <div class="Tarjeta-Datos">
                <h3>Nombre: ${escapeHtml(insumo.nombre)}</h3>
                <p>ID: ${insumo._id}</p>
                <p>Cantidad: ${insumo.cantidad}/${insumo.cantidadMinima} ${insumo.medida}</p>
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
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(str).replace(/[&<>"']/g, m => map[m]);
}

// Add new insumo
btnAgregar.addEventListener('click', () => {
    editMode = false;
    editingInsumo = null;
    modalAdd.textContent = 'Agregar';
    inputNombre.value = '';
    inputCantidad.value = '';
    inputCantidadMinima.value = '';
    inputMedida.value = '';
    modal.showModal();
});

modalAdd.addEventListener('click', async () => {
    const nombre = inputNombre.value.trim();
    const cantidad = parseInt(inputCantidad.value);
    const cantidadMinima = parseInt(inputCantidadMinima.value);
    const medida = inputMedida.value.trim();

    if (!nombre || isNaN(cantidad) || isNaN(cantidadMinima) || !medida) {
        alert('Todos los campos son requeridos');
        return;
    }

    try {
        if (editMode && editingInsumo) {
            // Update
            const res = await fetch(`/api/insumos/${editingInsumo._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, cantidad, cantidadMinima, medida })
            });
            if (!res.ok) throw new Error('Error al actualizar');
        } else {
            // Create
            const res = await fetch('/api/insumos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, cantidad, cantidadMinima, medida })
            });
            if (!res.ok) throw new Error('Error al crear');
        }
        modal.close();
        loadInsumos(); // Reload list
    } catch (err) {
        console.error(err);
        alert('Error al guardar insumo');
    }
});

btnCancelar.addEventListener('click', () => {
    modal.close();
    editMode = false;
    editingInsumo = null;
});

// Delete selected insumos
btnEliminar.addEventListener('click', async () => {
    const selected = grid.querySelectorAll('.Tarjeta-Insumo.selected');
    if (selected.length === 0) {
        alert('Seleccione al menos un insumo para eliminar');
        return;
    }
    if (!confirm(`Eliminar ${selected.length} insumo(s)?`)) return;

    try {
        for (const card of selected) {
            const id = card.dataset.insumoId;
            const res = await fetch(`/api/insumos/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Error al eliminar');
        }
        loadInsumos(); // Reload list
    } catch (err) {
        console.error(err);
        alert('Error al eliminar insumos');
    }
});

// Edit selected insumo
btnEditar.addEventListener('click', () => {
    const selected = grid.querySelectorAll('.Tarjeta-Insumo.selected');
    if (selected.length === 0) {
        alert('Seleccione un insumo para editar');
        return;
    }
    if (selected.length > 1) {
        alert('Seleccione solo un insumo para editar');
        return;
    }
    const card = selected[0];
    const id = card.dataset.insumoId;
    // Find the insumo data (assuming we have it, or fetch individually)
    // For simplicity, populate from DOM
    const datos = card.querySelector('.Tarjeta-Datos');
    const nombre = datos.querySelector('h3').textContent.replace('Nombre: ', '');
    const cantidadText = datos.querySelectorAll('p')[1].textContent.replace('Cantidad: ', '');
    const parts = cantidadText.split('/');
    const cantidad = parts[0];
    const cantidadMinima = parts[1].split(' ')[0];
    const medida = parts[1].split(' ')[1];

    editingInsumo = { _id: id };
    editMode = true;
    inputNombre.value = nombre;
    inputCantidad.value = cantidad;
    inputCantidadMinima.value = cantidadMinima;
    inputMedida.value = medida;
    modalAdd.textContent = 'Guardar';
    modal.showModal();
});

// Load insumos on page load
document.addEventListener('DOMContentLoaded', loadInsumos);

// Add search functionality
searchInput.addEventListener('input', handleSearch);

function hideUsuariosLink() {
    const rol = localStorage.getItem('rol');
    if (rol !== 'admin') {
        const link = document.getElementById('link-usuarios');
        if (link) link.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    hideUsuariosLink();
});

