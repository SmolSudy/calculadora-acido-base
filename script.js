// Funciones de cálculo
function calcularPhAcidoFuerte(concentracion) {
    return -Math.log10(concentracion);
}

function calcularPhBaseFuerte(concentracion) {
    return 14 + Math.log10(concentracion);
}

function calcularPhAcidoDebil(concentracion, ka) {
    const h_concentracion = Math.sqrt(ka * concentracion);
    return -Math.log10(h_concentracion);
}

function calcularPhBaseDebil(concentracion, kb) {
    const oh_concentracion = Math.sqrt(kb * concentracion);
    return 14 + Math.log10(oh_concentracion);
}

function calcularConcentraciones(ph) {
    const h_concentracion = Math.pow(10, -ph);
    const oh_concentracion = Math.pow(10, -(14-ph));
    return [h_concentracion, oh_concentracion];
}

function interpretarPh(ph) {
    if (ph < 7) {
        return "La solución es ácida (pH < 7)";
    } else if (ph > 7) {
        return "La solución es básica (pH > 7)";
    } else {
        return "La solución es neutra (pH = 7)";
    }
}

function generarPasosCalculo(tipo, fortaleza, concentracion, constante) {
    const pasos = [];
    if (fortaleza === 'fuerte') {
        if (tipo === 'acido') {
            pasos.push(
                `Para un ácido fuerte, [H⁺] = ${concentracion} M`,
                `pH = -log[H⁺]`,
                `pH = -log(${concentracion})`
            );
        } else {
            pasos.push(
                `Para una base fuerte, [OH⁻] = ${concentracion} M`,
                `pOH = -log[OH⁻] = -log(${concentracion})`,
                `pH = 14 - pOH`
            );
        }
    } else {
        if (tipo === 'acido') {
            pasos.push(
                `Ka = ${constante}`,
                `[H⁺] = √(Ka × Ca)`,
                `[H⁺] = √(${constante} × ${concentracion})`,
                `pH = -log[H⁺]`
            );
        } else {
            pasos.push(
                `Kb = ${constante}`,
                `[OH⁻] = √(Kb × Cb)`,
                `[OH⁻] = √(${constante} × ${concentracion})`,
                `pOH = -log[OH⁻]`,
                `pH = 14 - pOH`
            );
        }
    }
    return pasos;
}

// Manejo del formulario
document.getElementById('calculadoraForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const tipo = this.tipo.value;
    const fortaleza = this.fortaleza.value;
    const concentracion = parseFloat(this.concentracion.value);
    const decimales = parseInt(this.decimales.value);
    let constante = this.constante.value ? 
        Number(this.constante.value.replace(/[^0-9e.-]/g, '')) : 
        null;
    
    let ph;
    if (fortaleza === 'fuerte') {
        if (tipo === 'acido') {
            ph = calcularPhAcidoFuerte(concentracion);
        } else {
            ph = calcularPhBaseFuerte(concentracion);
        }
    } else {
        if (!constante) {
            alert('Por favor ingrese un valor de Ka/Kb para sustancias débiles');
            return;
        }
        if (tipo === 'acido') {
            ph = calcularPhAcidoDebil(concentracion, constante);
        } else {
            ph = calcularPhBaseDebil(concentracion, constante);
        }
    }
    
    ph = Number(ph.toFixed(decimales));
    const [h_conc, oh_conc] = calcularConcentraciones(ph);
    
    // Mostrar resultados
    document.getElementById('resultado').style.display = 'block';
    document.getElementById('ph-valor').textContent = ph;
    document.getElementById('h-valor').textContent = h_conc.toExponential(decimales);
    document.getElementById('oh-valor').textContent = oh_conc.toExponential(decimales);
    document.getElementById('interpretacion').textContent = interpretarPh(ph);
    
    // Mostrar pasos
    const pasos = generarPasosCalculo(tipo, fortaleza, concentracion, constante);
    const pasosLista = document.getElementById('pasos-lista');
    pasosLista.innerHTML = '';
    pasos.forEach(paso => {
        const li = document.createElement('li');
        li.textContent = paso;
        pasosLista.appendChild(li);
    });
    document.getElementById('pasos-calculo').style.display = 'block';
    
    // Guardar valores en localStorage
    for (let [key, value] of new FormData(this).entries()) {
        localStorage.setItem(key, value);
    }
});

// Cargar valores guardados
window.addEventListener('load', function() {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        const savedValue = localStorage.getItem(input.name);
        if (savedValue) input.value = savedValue;
    });
});