const btnAgregar = document.querySelector("#btn-agregar");
const btnCancelar = document.querySelector('#btnCancelar');
const modal = document.querySelector("#modal");
const modalAdd = document.querySelector('#modal-add');
const inputNombre = modal.querySelector('.input-nombre');
const inputPassword = modal.querySelector('.input-password');
const inputEstado = modal.querySelector('.input-estado');
const inputAcceso = modal.querySelector('.input-acceso');
const grid = document.querySelector('#usuarios-grid');
const btnEliminar = document.querySelector('#btn-eliminar');
const btnEditar = document.querySelector('#btn-editar');

let editMode = false;
let editingRow = null;
let idCounter = Date.now();

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function createUserRow({ nombre, password, estado, acceso }) {
    const row = document.createElement('div');
    row.className = 'usuario-row';
    const userId = `u${idCounter++}`;
    row.dataset.userId = userId;
    row.innerHTML = `
        <div class="col-img">${escapeHtml(nombre)}</div>
        <div class="col-nombre">${escapeHtml(password || '********')}</div>
        <div class="col-estado">${escapeHtml(estado)}</div>
        <div class="col-acceso">${escapeHtml(acceso)}</div>
    `;
    row.addEventListener('click', () => {
        row.classList.toggle('selected');
    });
    return row;
}

function wireExistingRows() {
    document.querySelectorAll('.usuario-row').forEach(row => {
        row.addEventListener('click', () => row.classList.toggle('selected'));
    });
}

// Open modal for adding new user
btnAgregar.addEventListener('click', () => {
    editMode = false;
    editingRow = null;
    modalAdd.textContent = 'Agregar';
    inputNombre.value = '';
    inputPassword.value = '';
    inputEstado.value = '';
    inputAcceso.value = '';
    modal.showModal();
});

// Modal add/save button
modalAdd.addEventListener('click', () => {
    const nombre = inputNombre.value.trim();
    const password = inputPassword.value;
    const estado = inputEstado.value.trim();
    const acceso = inputAcceso.value.trim();
    
    if (!nombre) {
        alert('Ingrese el nombre del usuario');
        return;
    }
    if (!estado) {
        alert('Seleccione un estado');
        return;
    }
    if (!acceso) {
        alert('Seleccione un nivel de acceso');
        return;
    }
    
    if (editMode && editingRow) {
        // Update existing row
        const cols = editingRow.querySelectorAll('div');
        cols[0].textContent = nombre;
        cols[1].textContent = password || '********';
        cols[2].textContent = estado;
        cols[3].textContent = acceso;
    } else {
        // Create new row
        const newRow = createUserRow({ nombre, password, estado, acceso });
        grid.appendChild(newRow);
        newRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    modal.close();
});

// Cancel modal
btnCancelar.addEventListener('click', () => {
    modal.close();
    editMode = false;
    editingRow = null;
});

// Delete selected users
btnEliminar.addEventListener('click', () => {
    const selected = grid.querySelectorAll('.usuario-row.selected');
    if (selected.length === 0) {
        alert('Seleccione al menos un usuario para eliminar');
        return;
    }
    if (!confirm(`Eliminar ${selected.length} usuario(s)?`)) return;
    selected.forEach(row => row.remove());
});

// Edit selected user (requires exactly one selected)
btnEditar.addEventListener('click', () => {
    const selected = grid.querySelectorAll('.usuario-row.selected');
    if (selected.length === 0) {
        alert('Seleccione un usuario para editar');
        return;
    }
    if (selected.length > 1) {
        alert('Seleccione solo un usuario para editar');
        return;
    }
    editingRow = selected[0];
    editMode = true;
    
    // Populate modal with current values
    const cols = editingRow.querySelectorAll('div');
    const nombre = cols[0].textContent;
    const password = cols[1].textContent === '********' ? '' : cols[1].textContent;
    const estado = cols[2].textContent;
    const acceso = cols[3].textContent;
    
    inputNombre.value = nombre;
    inputPassword.value = password;
    inputEstado.value = estado;
    inputAcceso.value = acceso;
    modalAdd.textContent = 'Guardar';
    modal.showModal();
});

// Initialize: wire current rows
wireExistingRows();
