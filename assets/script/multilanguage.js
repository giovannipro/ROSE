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
                "domains": "Domains",
                "pages": "Pages",
                "system": "System",
                "modified_query": "modified query",
                "reused_query": "reused query",
                "total": "total",
                "total_cap": "Totale",
                "statistics": "Statistics",
                "suggestions": "Suggestions",
                "time": "Time",
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
                "domains": "Domänen",
                "pages": "Seiten",
                "system": "System",
                "modified_query": "geänderte Abfrage",
                "reused_query": "wiederverwendete Abfrage",
                "total": "total",
                "total_cap": "Total",
                "statistics": "Statistiken",
                "suggestions": "Vorschläge",
                "time": "Zeiten",
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
                "domains": "Domini",
                "pages": "Pagine",
                "system": "Sistema",
                "modified_query": "query modificata",
                "reused_query": "query riusata",
                "total": "totale",
                "total_cap": "Totale",
                "statistics": "Statistiche",
                "suggestions": "Suggerimenti",
                "time": "Tempi",
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