document.addEventListener("DOMContentLoaded", function () {
    const risultatiDiv = document.getElementById("risultati");
    const paginaPrecedenteButton = document.getElementById("paginaPrecedente");
    const paginaSuccessivaButton = document.getElementById("paginaSuccessiva");
    const searchInput = document.getElementById("search");
    let paginaCorrente = 1;
    const libriPerPagina = 5;
    let datiLibri = []; 

    function visualizzaLibri(data, pagina) {
        const inizio = (pagina - 1) * libriPerPagina;
        const fine = pagina * libriPerPagina;
        const libriPagina = data.slice(inizio, fine);

        const listaLibri = libriPagina
        .map(
            (libro) => `
            <div class="libro" style="display: flex; align-items: center;">
                <div class="libro-info" style="flex: 1;">
                    <h2>${libro.title}</h2>
                    <p><strong>Autore:</strong> ${getAuthorNames(libro.authors)}</p>
                    <p><strong>Lingue disponibili:</strong> ${getLanguages(libro.languages)}</p>
                </div>
            </div>
        `
        )
        .join("");
    risultatiDiv.innerHTML = listaLibri;
}

    function getLanguages(languages) {
        if (languages && languages.length > 0) {
            // Se ci sono lingue disponibili, le unisce in una stringa separata da virgole
            return languages.join(', ');
        } else {
            return "Lingua sconosciuta";
        }
    }

    function getAuthorNames(authors) {
        // Estrai i nomi degli autori dall'array e concatenali in una stringa
        const authorNames = authors.map(author => author.name).join(', ');
        return authorNames;
    }

    function caricaDati(pagina) {
        const searchTerm = searchInput.value.toLowerCase();
        // Effettua una richiesta GET all'API Gutendex con il termine di ricerca
        fetch(`https://gutendex.com/books?search=${searchTerm}`)
            .then((response) => response.json())
            .then((data) => {
                datiLibri = data.results; // Memorizza i dati globalmente

                // Calcola il numero di pagine necessarie
                const numeroPagine = Math.ceil(data.count / libriPerPagina);

                // Gestisci il ciclo tra la prima e l'ultima pagina
                if (pagina < 1) {
                    pagina = numeroPagine;
                } else if (pagina > numeroPagine) {
                    pagina = 1;
                }

                // Mostra i libri per la pagina corrente
                visualizzaLibri(data.results, pagina);

                // Aggiorna la variabile paginaCorrente
                paginaCorrente = pagina;

                // Gestisci la visibilità dei pulsanti di paginazione
                if (paginaCorrente === 1) {
                    paginaPrecedenteButton.style.display = "none";
                } else {
                    paginaPrecedenteButton.style.display = "inline-block";
                }

                if (paginaCorrente === numeroPagine) {
                    paginaSuccessivaButton.style.display = "none";
                } else {
                    paginaSuccessivaButton.style.display = "inline-block";
                }
            })
            .catch((error) => {
                console.error("Si è verificato un errore nella richiesta:", error);
            });
    }

    // Carica i dati per la prima pagina quando la pagina viene caricata
    caricaDati(paginaCorrente);

    // Aggiungi gestori di eventi per i pulsanti di paginazione
    paginaPrecedenteButton.addEventListener("click", function () {
        caricaDati(paginaCorrente - 1);
    });

    paginaSuccessivaButton.addEventListener("click", function () {
        caricaDati(paginaCorrente + 1);
    });

    // Aggiungi un gestore di eventi per l'input di ricerca
    searchInput.addEventListener("input", function () {
        caricaDati(1); // Ricarica i dati dalla prima pagina quando cambia il termine di ricerca
    });
});
