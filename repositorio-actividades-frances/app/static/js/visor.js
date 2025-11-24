function cargarVisor(json) {

    // obtener  el canvas desde el html
    const visor = document.getElementById("canvas");

    // configurar la imagen de fondo de la actividad
    visor.innerHTML = "";
    visor.style.backgroundImage = `url(${json.imagen})`;
    visor.style.backgroundSize = "cover";
    visor.style.backgroundRepeat = "no-repeat";
    visor.style.backgroundPosition = "center";

    // obtener los componentes y procesarlos
const componentes = json.componentes || [];

  componentes.forEach(comp => {
    const wrapper = document.createElement("div");
    wrapper.className = "component-wrapper";
    wrapper.style.left = comp.x + "px";
    wrapper.style.top = comp.y + "px";
    wrapper.style.width = comp.width + "px";
    wrapper.style.height = comp.height + "px";
    wrapper.dataset.tipo = comp.tipo;

    let elemento;

    switch (comp.tipo) {
      case "input":
        elemento = document.createElement("input");
        elemento.type = "text";
        elemento.value = "";
        break;
      case "checkbox":
        elemento = document.createElement("input");
        elemento.type = "checkbox";
        break;
      case "texto":
        elemento = document.createElement("div");
        elemento.textContent = comp.texto;
        break;
      case "boton":
        elemento = document.createElement("button");
        elemento.type = "button";
        elemento.textContent = comp.texto;
        elemento.classList.add("toggle-btn");
        elemento.classList.toggle("active", false);
        elemento.addEventListener("click", () => {
          elemento.classList.toggle("active");
        });       
        break;
      default:
        elemento = document.createElement("div");
        elemento.textContent = comp.texto || "";
    }

    elemento.style.width = comp.width + "px";
    elemento.style.height = comp.height + "px";

    wrapper.appendChild(elemento);
    wrapper.dataset.correcta = comp.correcta;
    wrapper.dataset.respuesta = comp.respuesta || "";

    visor.appendChild(wrapper);

  });
}

const json = {
  "imagen": "/media/actividades/teide.PNG",
  "componentes": [
    {
      "id": "checkbox_1763306975286",
      "tipo": "checkbox",
      "x": 60,
      "y": 289,
      "width": 40,
      "height": 24,
      "texto": "☑️",
      "correcta": false,
      "respuesta": null
    },
    {
      "id": "boton_1763307163090",
      "tipo": "boton",
      "x": 60,
      "y": 556,
      "width": 109,
      "height": 27,
      "texto": "verdadero",
      "correcta": true,
      "respuesta": null
    },
    {
      "id": "boton_1763307163090_copy_1763307216402",
      "tipo": "boton",
      "x": 60,
      "y": 528,
      "width": 109,
      "height": 27,
      "texto": "palabra",
      "correcta": false,
      "respuesta": null
    },
    {
      "id": "boton_1763307163090_copy_1763307216402_copy_1763307219721",
      "tipo": "boton",
      "x": 59,
      "y": 585,
      "width": 109,
      "height": 27,
      "texto": "palabra",
      "correcta": false,
      "respuesta": null
    },
    {
      "id": "input_1763307247060",
      "tipo": "input",
      "x": 105,
      "y": 162,
      "width": 51,
      "height": 24,
      "texto": "Escribe",
      "correcta": false,
      "respuesta": "sabe"
    },
    {
      "id": "input_1763307247060_copy_1763307254538",
      "tipo": "input",
      "x": 98,
      "y": 193,
      "width": 53,
      "height": 24,
      "texto": "Escribe",
      "correcta": false,
      "respuesta": "cantaba"
    },
    {
      "id": "checkbox_1763306975286_copy_1763307313267",
      "tipo": "checkbox",
      "x": 60,
      "y": 320,
      "width": 40,
      "height": 24,
      "texto": "☑️",
      "correcta": false,
      "respuesta": null
    },
    {
      "id": "checkbox_1763306975286_copy_1763307313267_copy_1763307316435",
      "tipo": "checkbox",
      "x": 59,
      "y": 352,
      "width": 40,
      "height": 24,
      "texto": "☑️",
      "correcta": true,
      "respuesta": null
    }
  ]
};