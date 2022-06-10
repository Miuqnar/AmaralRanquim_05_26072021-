confirmComande();

function confirmComande() {
    let prixTatal = document.querySelector(".totalPrrice");
    let codeCommend = document.querySelector(".codeCommend");

    //recupere la valeur total dans localSotrage
    prixTatal.innerHTML = localStorage.getItem('calcule');
    codeCommend.innerHTML = localStorage.getItem('orderId');

    //effacer les valeur dans localStorage une fois la confirmation
    localStorage.clear();
}
