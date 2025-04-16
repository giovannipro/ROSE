function getLanguageFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    
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
                "task": "task",
                "normalize_scale": "Normalize scale",
                "fit_scale": "Fit scale",
                "search": "Search",
                "searches": "Search",
                "domains": "Domains",
                "pages": "Pages",
                "system": "System",
                "modified_query": "modified query",
                "reused_query": "reused query",

                "statistics": "Statistics",
                "time": "Time",
                "total": "total",
                "total_cap": "Totale",
                "shortest": "shortest",
                "average": "average",
                "longest": "longest",
                "new": "new",
                "reused": "reused",
                "modified": "modified",
                "queries": "Queries",
                "search_engines": "Search engines",
                "websites": "Websites",
                "domains": "Domains",
                "revisited": "revisited",
                "new_m": "new",

                "suggestions": "Suggestions",
                "observation": "Observation",
                "hint": "Hint"
            }
        },
        de: {
            translation: {
                "user": "Benutzer",
                "task": "Aktivitäten",
                "normalize_scale": "Skala normalisieren",
                "fit_scale": "Passformwaage",
                "search": "Suche",
                "searches": "Recherchen",
                "domains": "Domänen",
                "pages": "Seiten",
                "system": "System",
                "modified_query": "geänderte Abfrage",
                "reused_query": "wiederverwendete Abfrage",
                
                "statistics": "Statistiken",
                "time": "Zeiten",
                "total": "Total",
                "total_cap": "Total",
                "shortest": "Kürzer",
                "average": "Medien",
                "longest": "Länger",
                "new": "Neu",
                "reused": "Wiederverwendet",
                "modified": "Geändert",
                "queries": "Abfragen",
                "search_engines": "Suchmaschinen",
                "websites": "Webseiten",
                "domains": "Domänen",
                "revisited": "Bereits ergriffen",
                "new_m": "Neue",
                
                "suggestions": "Vorschläge",
                "observation": "Beobachtung",
                "hint": "Tipp"
            }
        },
        it: {
            translation: {
                "user": "Utente",
                "task": "Attività",
                "normalize_scale": "Normalizza scala",
                "fit_scale": "Adatta scala",
                "search": "Ricerca",
                "searches": "Ricerche",
                "domains": "Domini",
                "pages": "Pagine",
                "system": "Sistema",
                "modified_query": "query modificata",
                "reused_query": "query riusata",

                "statistics": "Statistiche",
                "total": "totale",
                "total_cap": "Totale",
                "time": "Tempi",
                "shortest": "più breve",
                "average": "media",
                "longest": "più lunga",
                "new": "nuove",
                "reused": "riusate",
                "modified": "modificate",
                "queries": "Query",
                "search_engines": "Motori di ricerca",
                "websites": "Siti web",
                "domains": "Domini",
                "revisited": "già visitati",
                "new_m": "nuovi",
                
                "suggestions": "Suggerimenti",
                "observation": "Osservazione",
                "hint": "Suggerimento"
            }
        }
    }
})
.then(function(t) {
    updateContent();
});
  
  // Use translations
function updateContent() {
    console.log('Language changed to:', i18next.language);

    document.getElementById('t_user').textContent = i18next.t('user');
    document.getElementById('t_task').textContent = i18next.t('task');

    document.getElementById('t_normalize_scale').textContent = i18next.t('normalize_scale');
    document.getElementById('t_fit_scale').textContent = i18next.t('fit_scale');

    document.getElementById('t_statistics').textContent = i18next.t('statistics');
    document.getElementById('t_suggestions').textContent = i18next.t('suggestions');

}


// Change language
// function changeLanguage(lng) {
//     i18next.changeLanguage(lng, updateContent);
// }