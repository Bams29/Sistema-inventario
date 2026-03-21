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
const searchInput = document.querySelector('.Barra-Busqueda');

let editMode = false;
let editingUser = null;
let allUsers = [];
let idCounter = Date.now();

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function createUserRow(user) {
    const row = document.createElement('div');
    row.className = 'usuario-row';
row.dataset.userId = user._id;
    row.innerHTML = `
        <div class="col-img">${escapeHtml(user.nombre)}</div>
        <div class="col-nombre">${escapeHtml(user.password || '********')}</div>\n        <div class="col-estado">${escapeHtml(user.estado || user.rol || 'N/A')}</div>\n        <div class="col-acceso">${escapeHtml(user.rol)}</div>\n    `;
    row.addEventListener('click', () => {
        row.classList.toggle('selected');
    });
    return row;
}

async function loadUsers() {
    try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Error al cargar usuarios');
        allUsers = await res.json();
        handleSearch();
    } catch (err) {
        console.error(err);
        alert('Error al cargar usuarios');
        renderUsers([{nombre: 'Juanjo', password: '1445', estado: 'Activo', acceso: 'Empleado'}]);
    }
}

function renderUsers(users) {
    grid.innerHTML = '';
    users.forEach(user => {
        const row = createUserRow(user);
        grid.appendChild(row);
    });
}

function filterUsers(searchTerm) {
    if (!searchTerm.trim()) return allUsers;
    const term = searchTerm.toLowerCase();
    return allUsers.filter(user =>
        user.nombre.toLowerCase().includes(term) ||
        (user.estado || '').toLowerCase().includes(term) ||
        (user.acceso || '').toLowerCase().includes(term) ||
        (user.rol || '').toLowerCase().includes(term)
    );
}

function handleSearch() {
    const searchTerm = searchInput.value;
    const filteredUsers = filterUsers(searchTerm);
    renderUsers(filteredUsers);
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
modalAdd.addEventListener('click', async () => {
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

    try {
        const userData = { nombre, password, rol: acceso, estado };
        if (editMode && editingUser) {
            // Update
            const res = await fetch(`/api/users/${editingUser._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            if (!res.ok) throw new Error('Error al actualizar');
        } else {
            // Create
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            if (!res.ok) throw new Error('Error al crear');
        }
        modal.close();
        loadUsers(); // Reload
    } catch (err) {
        console.error(err);
        alert('Error al guardar usuario');
    }
});

// Cancel modal
btnCancelar.addEventListener('click', () => {
    modal.close();
    editMode = false;
    editingUser = null;
});

// Delete selected users
btnEliminar.addEventListener('click', async () => {
    const selected = grid.querySelectorAll('.usuario-row.selected');
    if (selected.length === 0) {
        alert('Seleccione al menos un usuario para eliminar');
        return;
    }
    if (!confirm(`Eliminar ${selected.length} usuario(s)?`)) return;

    try {
        for (const row of selected) {
            const id = row.dataset.userId;
            const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Error al eliminar');
        }
        loadUsers(); // Reload
    } catch (err) {
        console.error(err);
        alert('Error al eliminar usuarios');
    }
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
    const row = selected[0];
    // Find user data from allUsers or use DOM fallback
    const userId = row.dataset.userId;
    editingUser = allUsers.find(u => u._id === userId) || { _id: userId };
    
    editMode = true;
    // Populate from data if available, fallback DOM
    const cols = row.querySelectorAll('div');
    inputNombre.value = cols[0].textContent;
    inputPassword.value = cols[1].textContent === '********' ? '' : cols[1].textContent;
    inputEstado.value = cols[2].textContent;
    inputAcceso.value = cols[3].textContent;
    modalAdd.textContent = 'Guardar';
    modal.showModal();
});

// Search event
if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
}

// Load on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
});
