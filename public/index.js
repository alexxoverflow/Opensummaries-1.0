
async function caricaRiassunti() {
    /* Setting the current container where to output the summaries */
    let currentExamContainer= document.getElementById("archDiv");
    /* Fetching data from the url below */
    let response= await fetch('/riassunti/architettura', {method: 'GET'});
    let data= await response.json();    // Converting the response in json
    mostraRiassunti(data, currentExamContainer);    // Showing the summaries
    /* Setting the next container */
    currentExamContainer= document.getElementById('mat1Div');
    response= await fetch('/riassunti/matematica1', {method: 'GET'});
    data= await response.json();
    mostraRiassunti(data, currentExamContainer);
    currentExamContainer= document.getElementById("prog1Div");
    response= await fetch('/riassunti/programmazione1', {method: 'GET'});
    data= await response.json();
    mostraRiassunti(data, currentExamContainer);
    currentExamContainer= document.getElementById("prog2Div");
    response= await fetch('/riassunti/programmazione2', {method: 'GET'});
    data= await response.json();
    mostraRiassunti(data, currentExamContainer);
    currentExamContainer= document.getElementById("fisicaDiv");
    response= await fetch('/riassunti/fisica', {method: 'GET'});
    data= await response.json();
    mostraRiassunti(data, currentExamContainer);
    currentExamContainer= document.getElementById("engDiv");
    response= await fetch('/riassunti/inglese', {method: 'GET'});
    data= await response.json();
    mostraRiassunti(data, currentExamContainer);
}


function mostraRiassunti(riassunti, containerEsame)
{
    /* For each data extracted...*/
    riassunti.forEach(riassunto =>
    {
        /* Creating new div and adding it to the class 'riassunto' */
        const riassuntoDiv = document.createElement('div');
        riassuntoDiv.classList.add('riassunto');
        /* Creating new h2 element and assigning to the name of the current summary it  */
        const titolo = document.createElement('h2');
        titolo.textContent = riassunto.nome;
        /* Creating new p element and assigning the author of the summary to it */
        const autore = document.createElement('p');
        autore.textContent = riassunto.autore;
        /* Creating a new a element and assigning an url to it, by passing the file name in the query part */
        const link= document.createElement('a');
        link.href= '/fileDownload?name=' + riassunto.nomeFile;
        link.textContent='Scarica il file';

        /* Appending all the new elements to riassuntoDiv and then appending it to the currentExamContainer */
        riassuntoDiv.appendChild(titolo);
        riassuntoDiv.appendChild(autore);
        riassuntoDiv.appendChild(link);
        containerEsame.appendChild(riassuntoDiv);
    });
}



