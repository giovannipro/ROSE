function getLanguageFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang').toLocaleLowerCase();
    console.log(langParam)

    return langParam;
}

// initialization
i18next.init({
    lng: getLanguageFromUrl() || 'en',
    fallbackLng: 'en', // fallback language
    resources: {
        en: {
            translation: {

                "user": "User",
                "class": "Class",
                "stories": "stories",
                "sortBy": "sort by",
                "totalTime": "total time",
                "searchTime": "search time",
                "pagesTime": "page time",
                "name": "name",
                
                "queries": "queries",
                "pages": "pages",

                "uniqueQueries": "unique queries",
                "uniquePages": "unique pages"

            }
        },
        de: {
            translation: {
                
                "user": "Benutzer",
                "class": "Klasse",
                "stories": "Geschichten",
                "sortBy": "sortieren nach",
                "totalTime": "Gesamtzeit",
                "searchTime": "Suchzeit",
                "pagesTime": "Seitenzeit",
                "name": "Name",
                
                "queries": "Abfragen",
                "pages": "Seiten",

                "uniqueQueries": "einzigartige Abfragen",
                "uniquePages": "einzigartige Seiten"
        
            }
        },
        it: {
            translation: {

                "class": "Classe",
                "user": "Utente",
                "stories": "storie",
                "sortBy": "ordina per",
                "totalTime": "tempo totale",
                "searchTime": "tempo di ricerca",
                "pagesTime": "tempo sulle pagine",
                "name": "nome",
                
                "queries": "query",
                "pages": "pagine",

                "uniqueQueries": "query uniche",
                "uniquePages": "pagine uniche"
                
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
    document.getElementById('t_stories').textContent = i18next.t('stories');

    document.getElementById('t_sortBy').textContent = i18next.t('sortBy');
    document.getElementById('t_totalTime').textContent = i18next.t('totalTime');
    document.getElementById('t_searchTime').textContent = i18next.t('searchTime');
    document.getElementById('t_pagesTime').textContent = i18next.t('pagesTime');
    document.getElementById('t_name').textContent = i18next.t('name');
    
}
