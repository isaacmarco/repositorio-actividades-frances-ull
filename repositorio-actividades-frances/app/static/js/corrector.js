document.getElementById('btn-corregir').addEventListener('click', () => {
    const wrappers = document.querySelectorAll('.component-wrapper');
    let aciertos = 0;
    let total = wrappers.length;

    wrappers.forEach(w => {
        const marcarComoCorrecta = w.dataset.correcta === 'true';
        const respuestaCorrecta = w.dataset.respuesta || '';
        const child = w.firstChild;
        let valorUsuario;
        let acierto = false; 
               
        switch(w.dataset.tipo)
        {
            case "input":
                valorUsuario = child.value;
                acierto = valorUsuario === respuestaCorrecta; 
                break;
            case "boton":
                const estaToggleado = child ? child.classList.contains('active') : false;      
                acierto = estaToggleado === marcarComoCorrecta;
                break;
            case "checkbox":
                valorUsuario = child.checked;
                acierto = valorUsuario === marcarComoCorrecta;
                break;                
        }
            
        if(acierto)
        {
            aciertos++;
            w.style.border = "2px solid green";
        } else {
            w.style.border = "2px solid red";
        }
    });

    // alert(`Has acertado ${aciertos} de ${total}`);
});
