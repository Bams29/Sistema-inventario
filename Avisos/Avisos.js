
function escapeHtml(str) {
	return String(str || '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
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

