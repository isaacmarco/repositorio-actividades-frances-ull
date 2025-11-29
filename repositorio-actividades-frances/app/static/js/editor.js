function cargarActividad(json) {

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
