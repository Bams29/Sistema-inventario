function escapeHtml(str) {
	return String(str || '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '<')
		.replace(/>/g, '>')
		.replace(/"/g, '"')
		.replace(/'/g, '&#039;');
}

// Function to get avisos from API
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

// Function to render avisos
async function renderAvisos() {
    const grid = document.querySelector('.Tarjetas-Grid');
    if (!grid) return;
    
    // Clear existing cards
    const existingCards = grid.querySelectorAll('.Tarjeta-Aviso');
    existingCards.forEach(card => card.remove());
    
    const avisos = await getAvisos();
    
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
                    <p>ID del Aviso: ${escapeHtml(aviso.aviso_id || aviso._id)}</p>
                </div>
            </div>
        `;
        card.addEventListener('click', () => showAvisoPopup(aviso));
        grid.appendChild(card);
    });
}

// Function to show aviso in popup
function showAvisoPopup(aviso) {
	if ('showModal' in HTMLDialogElement.prototype) {
		const dlg = document.createElement('dialog');
		dlg.className = 'avisos-popup';
		dlg.innerHTML = `
			<form method="dialog" style="padding:20px;max-width:480px">
				<h3 style="margin:0 0 8px 0">Aviso ${escapeHtml(aviso.aviso_id || aviso._id)}</h3>
				<p style="margin:6px 0"><strong>Producto:</strong> ${escapeHtml(aviso.Nombre_producto || 'N/A')}</p>
				<p style="margin:6px 0"><strong>Fecha:</strong> ${escapeHtml(aviso.fecha)}</p>
				<p style="margin:12px 0">${escapeHtml(aviso.mensaje || `Stock bajo para ${aviso.Nombre_producto || 'item'}`)}</p>
				<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px">
					<button id="dlg-close">Cerrar</button>
				</div>
			</form>
		`;
		document.body.appendChild(dlg);
		dlg.showModal();
		const closeBtn = dlg.querySelector('#dlg-close');
		if (closeBtn) closeBtn.addEventListener('click', () => dlg.close());

		dlg.addEventListener('close', () => dlg.remove());
	} else {
		const avisoId = aviso.aviso_id || aviso._id || aviso.id;
		const text = `Aviso ${avisoId}\nProducto: ${aviso.Nombre_producto || 'N/A'}\nFecha: ${aviso.fecha}\n\n${aviso.mensaje || ''}`;
		alert(text);
	}
}

// Original popup logic for the first (static) card
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

document.addEventListener('DOMContentLoaded', () => {
    // First, render avisos from localStorage
    renderAvisos();
    
	const first = document.querySelector('.Tarjeta-Aviso');
	if (!first) return;

	const datos = first.querySelector('.Tarjeta-Datos');
	const ps = datos ? Array.from(datos.querySelectorAll('p')).map(p => p.textContent.trim()) : [];
	const message = ps[0] || '';
	const date = (ps[1] || '').replace(/^Fecha:\s*/i, '');
	const idText = (ps[2] || '').replace(/ID del Aviso:\s*/i, '');


	if ('showModal' in HTMLDialogElement.prototype) {
		const dlg = document.createElement('dialog');
		dlg.className = 'avisos-popup';
		dlg.innerHTML = `
			<form method="dialog" style="padding:20px;max-width:480px">
				<h3 style="margin:0 0 8px 0">Aviso ${escapeHtml(idText)}</h3>
				<p style="margin:6px 0"><strong>Fecha:</strong> ${escapeHtml(date)}</p>
				<p style="margin:12px 0">${escapeHtml(message)}</p>
				<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px">
					<button id="dlg-close">Cerrar</button>
				</div>
			</form>
		`;
		document.body.appendChild(dlg);
		dlg.showModal();
		const closeBtn = dlg.querySelector('#dlg-close');
		if (closeBtn) closeBtn.addEventListener('click', () => dlg.close());

		dlg.addEventListener('close', () => dlg.remove());
	} else {

		const text = `Aviso ${idText}\nFecha: ${date}\n\n${message}`;
		alert(text);
	}
});

