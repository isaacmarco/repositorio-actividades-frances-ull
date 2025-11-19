document.getElementById('btn-exportar').addEventListener('click', () => {

    const componentes = document.querySelectorAll('.component-wrapper');

    // --- OBJETO FINAL ---
    const exportData = {
        imagen: document.getElementById("canvas-bg-url").value.trim(),
        componentes: []
    };

    componentes.forEach(comp => {

        // Asegurar lectura correcta del tipo
        const tipo = comp.getAttribute('data-tipo') ||
            comp.getAttribute('tipo') ||
            null;

        const compDiv = comp.querySelector('.component');
        const texto = compDiv ? compDiv.textContent.trim() : '';

        const pos = getAbsolutePosition(comp);

        exportData.componentes.push({
            id: comp.id,
            tipo: tipo,
            x: pos.x,
            y: pos.y,
            width: comp.offsetWidth,
            height: comp.offsetHeight,
            texto: texto,
            correcta: comp.getAttribute('data-correct') === 'true',
            respuesta: comp.getAttribute('data-answer') || null
        });
    });

    console.log("JSON exportado:\n", JSON.stringify(exportData, null, 2));
});

function getAbsolutePosition(wrapper) {
    const dx = parseFloat(wrapper.getAttribute("data-x")) || 0;
    const dy = parseFloat(wrapper.getAttribute("data-y")) || 0;

    return {
        x: wrapper.offsetLeft + dx,
        y: wrapper.offsetTop + dy
    };
}
