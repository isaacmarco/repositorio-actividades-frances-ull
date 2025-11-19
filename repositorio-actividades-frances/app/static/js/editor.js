// editor_componentes.js
document.addEventListener("DOMContentLoaded", () => {

    let valorMasAltoZindex = 100; // inicializamos

    const canvas = document.getElementById("canvas");
    const toolbox = document.getElementById("toolbox");
    const panel = document.getElementById("properties-panel");

    if (!canvas || !toolbox || !panel) {
        console.warn("Faltan elementos #canvas, #toolbox o #properties-panel en el DOM");
        return;
    }

    // Inputs del panel
    const propiedadTexto = document.getElementById('prop-text');
    const propiedadCorrecta = document.getElementById('prop-correct');
    const propiedadRespuestaCorrecta = document.getElementById('prop-answer');

    // Contenedores de propiedades
    const contPropTexto = document.getElementById('panel-propiedades-texto');
    const contPropCorrecta = document.getElementById('panel-propiedades-correcta');
    const contPropRespuestaCorrecta = document.getElementById('panel-propiedades-respuesta-correcta');

    const propiedadesPorTipo = {
        'texto': { nombre: 'Texto', texto: true, correcta: false, respuesta: false },
        'input': { nombre: 'Escribe', texto: false, correcta: false, respuesta: true },
        'checkbox': { nombre: '☑️', texto: false, correcta: true, respuesta: false },
        'boton': { nombre: 'Botón', texto: true, correcta: true, respuesta: false }
    };

    let selectedComponent = null;

    // ---------------- TOOLBOX ----------------
    const componentes = [
        { tipo: "texto", label: "Texto" },
        { tipo: "input", label: "Respuesta" },
        { tipo: "checkbox", label: "Casilla" },
        { tipo: "boton", label: "Selección" }
    ];

    componentes.forEach(c => {
        const item = document.createElement("div");
        item.className = "toolbox-item";
        item.textContent = c.label;
        item.dataset.tipo = c.tipo;
        item.setAttribute("draggable", "true");

        item.addEventListener("dragstart", ev => {
            ev.dataTransfer.setData("text/plain", c.tipo);
        });

        toolbox.appendChild(item);
    });

    canvas.addEventListener("dragover", ev => ev.preventDefault());
    canvas.addEventListener("drop", ev => {
        ev.preventDefault();
        const tipo = ev.dataTransfer.getData("text/plain");
        if (!tipo)
            return;

        const wrapper = crearWrapper(tipo);
        const rect = canvas.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        wrapper.style.left = `${x}px`;
        wrapper.style.top = `${y}px`;

        canvas.appendChild(wrapper);
        initializeWrapper(wrapper);

        // funciones ?
    });

    // ---------------- CREAR WRAPPER ----------------

    function crearWrapper(tipo) {

        iconos = {
            'mover': '🤏🏼',
            'duplicar': '👯‍♀️',
            'borrar': '❌',
            'componente-respuesta': '✏️', 
            'componente-checkbox': '☑️', 
            'componente-checkbox-falso': '☑️', 
            'componente-checkbox-verdadero': '☑️', 
            'componente-boton': '👆🏻',
            'componente-boton-falso': '👆🏻',
            'componente-boton-verdadero': '👆🏻',
        }

        const wrapper = document.createElement("div");
        wrapper.className = "component-wrapper";
        wrapper.style.position = "absolute";
        wrapper.style.top = "0px";
        wrapper.style.left = "0px";
        wrapper.id = `${tipo}_${Date.now()}`;
        wrapper.dataset.tipo = tipo;
        wrapper.dataset.x = 0;
        wrapper.dataset.y = 0;

        const comp = document.createElement("div");
        comp.className = `component ${tipo}`;
        comp.textContent = propiedadesPorTipo[tipo].nombre;
        const buttons = document.createElement("div");
        buttons.className = "component-buttons";

        const handle = document.createElement("div");
        handle.className = "handle";
        handle.textContent = iconos['mover'];

        const del = document.createElement("div");
        del.className = "delete-handle";
        del.textContent = iconos['borrar'];

        const dup = document.createElement("div");
        dup.className = "duplicate-handle";
        dup.textContent = iconos['duplicar'];

        buttons.appendChild(handle);
        buttons.appendChild(del);
        buttons.appendChild(dup);

        wrapper.appendChild(comp);
        wrapper.appendChild(buttons);

        return wrapper;
    }

    // ---------------- INICIALIZAR WRAPPER ----------------
    function initializeWrapper(wrapper) {
        if (wrapper._initialized) return;
        wrapper._initialized = true;

        // Click en wrapper → abrir panel
        wrapper.addEventListener("click", e => {
            e.stopPropagation();
            mostrarPanel(wrapper);
        });

        // Drag con handle

        if (typeof interact === "function") {
            interact(wrapper).unset();
            interact(wrapper).draggable({
                allowFrom: ".handle",
                listeners: {
                    start(event) {
                        // Al empezar a arrastrar, ponemos el componente encima
                        valorMasAltoZindex++;
                        event.target.style.zIndex = valorMasAltoZindex;
                    },
                    move(event) {
                        const t = event.target;
                        const x = (parseFloat(t.dataset.x) || 0) + event.dx;
                        const y = (parseFloat(t.dataset.y) || 0) + event.dy;
                        t.style.transform = `translate(${x}px, ${y}px)`;
                        t.dataset.x = x;
                        t.dataset.y = y;
                    }
                }
            });

            interact(wrapper.querySelector(".component")).unset();
            interact(wrapper.querySelector(".component")).resizable({
                edges: { left: true, right: true, bottom: true, top: true },
                ignoreFrom: ".component-buttons",
                listeners: {
                    move(event) {
                        const t = event.target;
                        const wrapper = t.parentElement;
                        t.style.width = event.rect.width + "px";
                        t.style.height = event.rect.height + "px";

                        const x = (parseFloat(wrapper.dataset.x) || 0) + event.deltaRect.left;
                        const y = (parseFloat(wrapper.dataset.y) || 0) + event.deltaRect.top;
                        wrapper.style.transform = `translate(${x}px, ${y}px)`;
                        wrapper.dataset.x = x;
                        wrapper.dataset.y = y;
                    }
                },
                modifiers: [interact.modifiers.restrictSize({ min: { width: 40, height: 24 } })],
                inertia: true
            });
        }

        // Borrar
        const delBtn = wrapper.querySelector(".delete-handle");
        if (delBtn) {
            delBtn.addEventListener("mousedown", e => e.stopPropagation());
            delBtn.addEventListener("click", e => {
                e.stopPropagation();
                if (selectedComponent === wrapper) panel.style.display = "none";
                wrapper.remove();
            });
        }

        // Duplicar
        const dupBtn = wrapper.querySelector(".duplicate-handle");
        if (dupBtn) {
            dupBtn.addEventListener("mousedown", e => e.stopPropagation());
            dupBtn.addEventListener("click", e => {
                e.stopPropagation();
                const clone = wrapper.cloneNode(true);
                clone.id = wrapper.id + "_copy_" + Date.now();

                const originalX = parseFloat(wrapper.dataset.x) || 0;
                const originalY = parseFloat(wrapper.dataset.y) || 0;
                const top = parseFloat(wrapper.style.top) || 0;
                const left = parseFloat(wrapper.style.left) || 0;

                // Offset de duplicado
                const offset = 20;

                clone.style.top = top + "px";
                clone.style.left = left + "px";

                clone.dataset.x = originalX;
                clone.dataset.y = originalY + offset;

                // Aplicamos transform para mantener la posición correcta
                clone.style.transform = `translate(${clone.dataset.x}px, ${clone.dataset.y}px)`;

                canvas.appendChild(clone);
                initializeWrapper(clone);
            });
        }
    }

    // ---------------- PANEL DE PROPIEDADES ----------------
    function mostrarPanel(wrapper) {
        selectedComponent = wrapper;
        panel.style.display = "block";

        const compDiv = wrapper.querySelector(".component");
        const tipo = wrapper.dataset.tipo;
        const cfg = propiedadesPorTipo[tipo] || {};

        contPropTexto.style.display = cfg.texto ? "block" : "none";
        contPropCorrecta.style.display = cfg.correcta ? "block" : "none";
        contPropRespuestaCorrecta.style.display = cfg.respuesta ? "block" : "none";

        propiedadTexto.value = compDiv ? compDiv.textContent.trim() : "";
        propiedadCorrecta.checked = wrapper.dataset.correct === "true";
        propiedadRespuestaCorrecta.value = wrapper.dataset.answer || "";
    }

    propiedadTexto.addEventListener("input", () => {
        if (!selectedComponent) return;
        selectedComponent.querySelector(".component").textContent = propiedadTexto.value;
    });

    propiedadCorrecta.addEventListener("change", () => {
        if (!selectedComponent) return;
        selectedComponent.dataset.correct = propiedadCorrecta.checked ? "true" : "false";
    });

    propiedadRespuestaCorrecta.addEventListener("input", () => {
        if (!selectedComponent) return;
        selectedComponent.dataset.answer = propiedadRespuestaCorrecta.value;
    });

    // Click fuera → cerrar panel
    document.body.addEventListener("click", e => {
        if (!e.target.closest(".component-wrapper") &&
            !e.target.closest("#properties-panel")) {
            selectedComponent = null;
            panel.style.display = "none";
        }
    });

    [propiedadTexto, propiedadCorrecta, propiedadRespuestaCorrecta].forEach(input =>
        input.addEventListener("click", e => e.stopPropagation())
    );

    // Inicializar wrappers existentes
    document.querySelectorAll("#canvas .component-wrapper").forEach(w => {
        initializeWrapper(w);
    });

    // cambiar imagen de actividad
    document.getElementById("btn-set-bg").addEventListener("click", () => {
        const url = document.getElementById("canvas-bg-url").value.trim();
        const canvas = document.getElementById("canvas");
        if (!url)
            return;
        canvas.style.backgroundImage = `url("${url}")`;
        canvas.style.backgroundSize = "cover";
        canvas.style.backgroundRepeat = "no-repeat";
        canvas.style.backgroundPosition = "center";
    });

    // forzar la url de la imagen de actividad de debug    
    canvas.style.backgroundImage = `url('actividad.png')`;
    canvas.style.backgroundSize = "cover";
    canvas.style.backgroundRepeat = "no-repeat";
    canvas.style.backgroundPosition = "center";
   
});
