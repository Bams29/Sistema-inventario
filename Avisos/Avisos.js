function escapeHtml(str) {
	return String(str || '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '<')
		.replace(/>/g, '>')
		.replace(/"/g, '"')
		.replace(/'/g, '&#039;');
}

let allAvisos = [];

// Get avisos from API
async function getAvisos() {
    try {
        const res = await fetch('/api/avisos');
        if (!res.ok) return [];
        return await res.json();
    } catch (err) {
        console.error('Error fetching avisos:', err);
        return [];
    }
}

// Render avisos
function renderAvisos(avisos = allAvisos) {
    const grid = document.querySelector('.Tarjetas-Grid');
    if (!grid) return;
    
    grid.innerHTML = ''; // Clear all
    
    if (avisos.length === 0) return;
    
    avisos.forEach(aviso => {
        const card = document.createElement('div');
        card.className = 'Tarjeta-Aviso';
        card.innerHTML = `
            <div class="Tarjeta-Contenido">
                <img src="../Images/Advertencia.png" alt="Imagen Aviso" class="Tarjeta-Imagen">
                <div class="Tarjeta-Datos">
                    <p>${escapeHtml(aviso.mensaje || `Producto: ${aviso.Nombre_producto} en fecha ${aviso.fecha}`)}</p>
                    <p>Fecha: ${escapeHtml(aviso.fecha)}</p>
                    <p>ID: ${escapeHtml(aviso.aviso_id || aviso._id)}</p>
                </div>
            </div>
        `;
        card.addEventListener('click', () => showAvisoPopup(aviso));
        grid.appendChild(card);
    });
}

// Filter
function filterAvisos(searchTerm) {
    if (!searchTerm.trim()) return allAvisos;
    const term = searchTerm.toLowerCase();
    return allAvisos.filter(aviso =>
        aviso.mensaje.toLowerCase().includes(term) ||
        (aviso.Nombre_producto || '').toLowerCase().includes(term) ||
        (aviso.fecha || '').includes(term) ||
        (aviso.aviso_id || aviso._id || '').toLowerCase().includes(term)
    );
}

// Handle search
function handleSearch() {
    const searchInput = document.querySelector('.Barra-Busqueda');
    if (!searchInput) return;
    const filtered = filterAvisos(searchInput.value);
    renderAvisos(filtered);
}

// Load
async function loadAvisos() {
    allAvisos = await getAvisos();
    renderAvisos();
}

// Show popup
function showAvisoPopup(aviso) {
	if ('showModal' in HTMLDialogElement.prototype) {
		const dlg = document.createElement('dialog');
		dlg.className = 'avisos-popup';
		dlg.innerHTML = `
			<form method="dialog" style="padding:20px;max-width:480px">
				<h3>Aviso ${escapeHtml(aviso.aviso_id || aviso._id)}</h3>
				<p><strong>Producto:</strong> ${escapeHtml(aviso.Nombre_producto || 'N/A')}</p>
				<p><strong>Fecha:</strong> ${escapeHtml(aviso.fecha)}</p>
				<p>${escapeHtml(aviso.mensaje)}</p>
				<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px">
					<button id="dlg-close">Cerrar</button>
				</div>
			</form>
		`;
		document.body.appendChild(dlg);
		dlg.showModal();
		dlg.querySelector('#dlg-close').onclick = () => dlg.close();
		dlg.onclose = () => dlg.remove();
	} else {
		alert(`Aviso ${aviso.aviso_id}\n${aviso.mensaje}`);
	}
}

// Hide usuarios link
function hideUsuariosLink() {
    const rol = localStorage.getItem('rol');
    if (rol !== 'admin') {
        const link = document.getElementById('link-usuarios');
        if (link) link.style.display = 'none';
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    hideUsuariosLink();
    loadAvisos();
    const searchInput = document.querySelector('.Barra-Busqueda');
    if (searchInput) searchInput.addEventListener('input', handleSearch);
});
// (mobile nav handled inline in the HTML for this legacy page)
