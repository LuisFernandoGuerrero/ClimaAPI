const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const kelvinACentigrados = grados => { return parseInt(grados - 273.15) }

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima)
})

function buscarClima(e) {
    e.preventDefault();

    // Validar
    const ciudad = document.querySelector('#ciudad').value
    const pais = document.querySelector('#pais').value;

    if (ciudad === '' || pais === '') {
        // Hubo un error
        mostrarError('Ambos campos son obligatorios');
        return;
    }

    // Consultar API
    consultarAPI(ciudad, pais)
}


function mostrarError(mensaje) {
    const alerta = document.querySelector('.alerta')

    if (!alerta) {
        // Crear alerta
        const divError = document.createElement('DIV');
        divError.classList.add('bg-red-100', 'border-red-400', 'text-red-400',
            'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6',
            'text-center', 'alerta');

        divError.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block">${mensaje}</span>
    `;
        container.appendChild(divError)
        setTimeout(() => {
            divError.remove();
        }, 3000);
    }
}

function consultarAPI(ciudad, pais) {
    const appId = '5c8601ab2ac7992b51cea44426a807d6';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`

    Spinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            limpiarHTML();
            if (datos.cod === '404') {
                mostrarError('Ciudad no encontrada')
                return;
            }

            // Imprime la rta en el html
            mostrarClima(datos);
        })
}

function mostrarClima(datos) {
    const { name, sys: { country }, main: { temp, temp_max, temp_min } } = datos;
    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);
    const nombreCiudad = document.createElement('P')
    nombreCiudad.textContent = `Clima en: ${name}, ${country}`
    nombreCiudad.classList.add('font-bold', 'text-2xl')

    const actual = document.createElement('P')
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl');

    const tempMax = document.createElement('P')
    tempMax.innerHTML = `Temperatura maxima: ${max}&#8451;`
    tempMax.classList.add('text-xl')

    const tempMin = document.createElement('P')
    tempMin.innerHTML = `Temperatura minima: ${min}&#8451;`
    tempMin.classList.add('text-xl')


    const resultadoDiv = document.createElement('DIV');
    resultadoDiv.classList.add('text-center', 'text-white')
    resultadoDiv.appendChild(nombreCiudad)
    resultadoDiv.appendChild(actual)
    resultadoDiv.appendChild(tempMax)
    resultadoDiv.appendChild(tempMin)

    resultado.appendChild(resultadoDiv);
}


function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function Spinner() {
    limpiarHTML();

    const divSpinner = document.createElement('DIV');
    divSpinner.classList.add('spinner');

    divSpinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultado.appendChild(divSpinner);
}