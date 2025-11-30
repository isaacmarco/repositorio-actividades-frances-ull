document.addEventListener("DOMContentLoaded", () => {

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
        'texto': { texto: true, correcta: false, respuesta: false },
        'input': { texto: false, correcta: false, respuesta: true },
        'checkbox': { texto: false, correcta: true, respuesta: false }
    };

    let selectedComponent = null;

    // ---------------- TOOLBOX ----------------
    const componentes = [
        { tipo: "texto", label: "Texto" },
        { tipo: "input", label: "Input" },
        { tipo: "checkbox", label: "Checkbox" },
        { tipo: "boton", label: "Selector" },
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
        if (!tipo) return;

        const wrapper = crearWrapper(tipo);
        const rect = canvas.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        wrapper.style.left = `${x}px`;
        wrapper.style.top = `${y}px`;

        canvas.appendChild(wrapper);
        initializeWrapper(wrapper);
    });

    // ---------------- CREAR WRAPPER ----------------
    function crearWrapper(tipo) {
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

        const etiquetas = {
            texto: "Texto",
            input: "Completar",
            checkbox: "✅",
            boton: "Selector",
        };

        comp.textContent = etiquetas[tipo];

        const buttons = document.createElement("div");
        buttons.className = "component-buttons";

        const handle = document.createElement("div");
        handle.className = "handle";
        handle.textContent = "🖐️";

        /*
        const del = document.createElement("div");
        del.className = "delete-handle";
        del.textContent = "✖";

        const dup = document.createElement("div");
        dup.className = "duplicate-handle";
        dup.textContent = "⎘";
        */

        buttons.appendChild(handle);
        //buttons.appendChild(del);
        //buttons.appendChild(dup);

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
                    move(event) {
                        const t = event.target;
                        const x = (parseFloat(t.dataset.x) || 0) + event.dx;
                        const y = (parseFloat(t.dataset.y) || 0) + event.dy;
                        t.style.transform = `translate(${x}px, ${y}px)`;
                        t.dataset.x = x;
                        t.dataset.y = y;
                    }
                },
                /*
                modifiers: [
                    interact.modifiers.snap({
                        targets: [interact.snappers.grid({ x: 20, y: 20 })],  // tamaño del grid
                        range: Infinity,
                    })
                ],
                */
            });

            interact(wrapper.querySelector(".component")).unset();
            interact(wrapper.querySelector(".component")).resizable({
                edges: { left: true, right: true, bottom: true, top: true },
                ignoreFrom: ".component-buttons",
                listeners: {
                    move(event) {
                        const t = event.target;
                        const _wrapper = t.parentElement;
                        t.style.width = event.rect.width + "px";
                        t.style.height = event.rect.height + "px";

                        const x = (parseFloat(wrapper.dataset.x) || 0) + event.deltaRect.left;
                        const y = (parseFloat(wrapper.dataset.y) || 0) + event.deltaRect.top;
                        _wrapper.style.transform = `translate(${x}px, ${y}px)`;
                        _wrapper.dataset.x = x;
                        _wrapper.dataset.y = y;
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
                const top = parseFloat(wrapper.style.top) || 0;
                const left = parseFloat(wrapper.style.left) || 0;
                clone.style.top = top + 20 + "px";
                clone.style.left = left + "px";
                clone.dataset.x = 0;
                clone.dataset.y = 0;
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
         selectedComponent.querySelector(".component").textContent = propiedadRespuestaCorrecta.value;
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


    window.crearWrapper = crearWrapper;
    window.initializeWrapper = initializeWrapper;
    window.canvas = canvas;
    window.mostrarPanel = mostrarPanel; // opcional, pero útil
    window.selectedComponent = selectedComponent;

    document.getElementById("btn-delete-selected").addEventListener("click", () => {
        if (!selectedComponent) {
            alert("No hay ningún componente seleccionado.");
            return;
        }
        selectedComponent.remove();
        selectedComponent = null;
        panel.style.display = "none";
    });

    document.getElementById("btn-duplicate-selected").addEventListener("click", () => {
        if (!selectedComponent) {
            alert("No hay ningún componente seleccionado.");
            return;
        }
            const clone = selectedComponent.cloneNode(true);
                clone.id = selectedComponent.id + "_copy_" + Date.now();
                const top = parseFloat(selectedComponent.style.top) || 0;
                const left = parseFloat(selectedComponent.style.left) || 0;
                clone.style.top = top + 20 + "px";
                clone.style.left = left + "px";
                clone.dataset.x = 0;
                clone.dataset.y = 0;
                canvas.appendChild(clone);
                initializeWrapper(clone);


    });



});

function cargarDesdeJSON(lista) {


    lista.forEach(item => {
        const wrapper = crearWrapper(item.tipo);

        // Posición
        wrapper.style.left = item.x + "px";
        wrapper.style.top = item.y + "px";

        wrapper.dataset.x = 0;
        wrapper.dataset.y = 0;

        // Tamaño del componente interno
        const comp = wrapper.querySelector(".component");
        if (item.ancho) comp.style.width = item.ancho + "px";
        if (item.alto) comp.style.height = item.alto + "px";

        // PROPIEDADES
        if (item.texto) comp.textContent = item.texto;

        if (item.correcta !== undefined)
            wrapper.dataset.correct = item.correcta ? "true" : "false";

        if (item.respuesta !== undefined)
            wrapper.dataset.answer = item.respuesta;

        // Insertarlo en el canvas
        canvas.appendChild(wrapper);

        // IMPORTANTÍSIMO → activar drag, resize, duplicado, borrado, panel…
        initializeWrapper(wrapper);
    });


}
