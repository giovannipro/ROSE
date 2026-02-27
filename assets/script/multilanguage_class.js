function getLanguageFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);

    let langParam = 'en'
    if (urlParams.get('lang') !== null){
        langParam = urlParams.get('lang').toLocaleLowerCase();
    }

    return langParam;
}

// initialization
i18next.init({
    lng: getLanguageFromUrl() || 'en',
    fallbackLng: 'en', // fallback language
    resources: {
        en: {
            translation: {
                "date" : "Date",
                "user": "User",
                "task": "Task",
                "class": "Class",
                "stories": "timelines",
                "sortBy": "sort by",
                "totalTime": "total time",
                "searchTime": "search time",
                "pagesTime": "page time",
                "name": "name",
                
                "queries": "queries",
                "pages": "pages",

                "uniqueQueries": "unique queries",
                "uniquePages": "unique pages",

                "searches": "Searches",
                "pages_m": "Pages",
                "queries_m": "Queries",
                "domains": "Domains",
                "statistics": "Class statistics",
                "t_searchPages": "Searches and domains",

                "count": "hit",
                "domain": "domain",
                "query": "query",
                "alphabeticalOrder":  "alphabetical order",
                "totalTime": "total time",
                "averageTime": "average time",
                "uniqueUsers": "unique users",
                "observations" : "Observations"
            }
        },
        de: {
            translation: {
                "date" : "Daten",
                "user": "Benutzer:in",
                "task": "Aufgabe",
                "class": "Klasse",
                "stories": "Timelines",
                "sortBy": "sortieren nach",
                "totalTime": "Gesamtzeit",
                "searchTime": "Suchzeit",
                "pagesTime": "Seitenzeit",
                "name": "Name",
                
                "queries": "Queries",
                "pages": "Seiten",
                "pages_m": "Seiten",

                "uniqueQueries": "einzigartige Query",
                "uniquePages": "einzigartige Seiten",

                "searches": "Suchen",
                "queries_m": "Queries",
                "domains": "Domänen",
                "statistics": "Klassenstatistiken",
                "t_searchPages" : "Suchen und Domänen",

                "count": "Zählung",
                "domain" : "Domäne",
                "query" : "Query",
                "alphabeticalOrder" : "alphabetische Reihenfolge",
                "totalTime" : "Gesamtzeit",
                "averageTime" : "Durchschnittszeit",
                "uniqueUsers": "einzigartige Benutzer",
                "observations" : "Beobachtungen"
            }
        },
        it: {
            translation: {
                "date" : "Data",
                "class": "Classe",
                "task": "Attività",
                "user": "Utente",
                "stories": "timeline",
                "sortBy": "ordina per",
                "totalTime": "tempo totale",
                "searchTime": "tempo di ricerca",
                "pagesTime": "tempo sulle pagine",
                "name": "nome",
                
                "queries": "query",
                "pages": "pagine",

                "uniqueQueries": "query uniche",
                "uniquePages": "pagine uniche",

                "searches": "Ricerche",
                "queries_m": "Query",
                "pages_m": "Pagine",
                "domains": "Domini",
                "statistics": "Statistiche della classe",
                "t_searchPages" : "Ricerche e domini",

                "count": "conteggio",
                "domain" : "dominio",
                "query" : "query",
                "alphabeticalOrder" : "ordine alfabetico",
                "totalTime" : "tempo totale",
                "averageTime" : "tempo medio",
                "uniqueUsers": "utenti unici",
                "observations" : "Osservazioni"
            }
        }
    }
})
.then(function(t) {
    updateContent();
});
  
// Use translations
function updateContent() {
    // console.log(i18next.language);

    document.getElementById('t_class').textContent = i18next.t('class');
    document.getElementById('t_task').textContent = i18next.t('task');
    document.getElementById('t_date').textContent = i18next.t('date');

    document.getElementById('t_stories').textContent = i18next.t('stories');
    document.getElementById('t_sortBy').textContent = i18next.t('sortBy');
    document.getElementById('t_totalTime').textContent = i18next.t('totalTime');
    document.getElementById('t_searchTime').textContent = i18next.t('searchTime');
    document.getElementById('t_pagesTime').textContent = i18next.t('pagesTime');
    document.getElementById('t_name').textContent = i18next.t('name');

    document.getElementById('t_statistics').textContent = i18next.t('statistics');

    
}
