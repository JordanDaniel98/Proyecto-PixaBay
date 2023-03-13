const resultado = document.querySelector("#resultado");
const form = document.querySelector("#formulario");
const termino = document.querySelector("#termino");
const pagination = document.querySelector("#paginacion");

const amount = 40;
let totalPages;
let iterator;
let pageCurrently = 1;

initEvents();

function initEvents() {
    form.addEventListener("submit", validateForm);
}

function validateForm(e) {
    e.preventDefault();
    cleanHTML();
    const searchTerm = termino.value;
    if (searchTerm === "") {
        showAlertHTML("Agregar un término de búsqueda");
        return;
    }

    getArrayPixabay();
}

function getArrayPixabay() {
    const searchTerm = termino.value;
    const key = "34344225-961f627a9138d9c237a5ad793";
    //const amount = 40;
    const url = `https://pixabay.com/api/?key=${key}&q=${searchTerm}&per_page=${amount}&page=${pageCurrently}`;
    fetch(url)
        .then((result) => result.json())
        .then((terms) => {
            totalPages = calculatePages(terms.totalHits);
            generateHTMLPixabay(terms);
        });
}

// Generador
function* createPager(total) {
    for (let i = 1; i <= total; i++) {
        yield i; // los yield -> son variables en las cuales se pueden iterar
    }
}

function calculatePages(total) {
    return parseInt(Math.ceil(total / amount));
}

function generateHTMLPixabay(terms) {
    cleanHTML();
    const { hits, totalHits } = terms;

    hits.forEach((img) => {
        const { previewURL, likes, views, largeImageURL } = img;
        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 px-2 py-4 ">
                <div class="border-pix">
                    <img class="w-full" src="${previewURL}"></img>
                    <div class="bg-white">
                        <p><strong class="font-bold pl-4 pr-1 text-black">${likes}</strong> <span>Me Gusta</span> </p>
                        <p><strong class="font-bold pl-4 pr-1 text-black">${views}</strong> <span>Veces Vista</span> </p>
                    </div>
                </div> 
                <a class="btn-imagen" href="${largeImageURL}" target="_blank">Ver Imagen</a> 
            </div>
           
        `;
    });

    cleanPaginator();

    printIterator();
}

function cleanPaginator() {
    while (pagination.firstChild) {
        pagination.removeChild(pagination.firstChild);
    }
}
function printIterator() {
    iterator = createPager(totalPages);
    while (true) {
        const { value, done } = iterator.next();
        if (done) {
            return;
        }
        const button = document.createElement("a");
        button.href = "#";
        button.dataset.pagina = value;
        button.textContent = value;
        button.classList.add(
            "siguiente",
            "bg-yellow-400",
            "px-4",
            "py-1",
            "mr-2",
            "font-bold",
            "mb-10",
            "uppercase",
            "rounded"
        );
        button.onclick = () => {
            pageCurrently = value;
            getArrayPixabay();
        };
        pagination.appendChild(button);
    }
}

function cleanHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}
function showAlertHTML(mensaje) {
    const existAlert = document.querySelector(".bg-red-100");
    if (existAlert) {
        return;
    }
    const alert = document.createElement("p");
    alert.classList.add(
        "bg-red-100", // Color de fondo
        "border-red-100", // Color de borde
        "w-full", // Ocupa tod el espacio de su contenido
        "text-red-700", // Color de texto
        "rounded", // Redondeado en los bordes
        "px-4", // padding X
        "py-3", // padding Y
        "mx-auto", // Centra el componente
        "text-center", // Centra el texto
        "mt-6" // margin top
    );
    alert.innerHTML = `
        <strong class="font-bold">Error !!!</strong>
        <span class="block">${mensaje}</span>
    `;
    resultado.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 3000);
}
