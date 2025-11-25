function getLanguageFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang').toLocaleLowerCase();
    // console.log(langParam)

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
                "task": "Task",
                "normalize_scale": "Normalize",
                "fit_scale": "Fit",
                "search": "Search",
                "searches": "Searches",
                "domains": "Domains",
                "pages": "Pages",
                "system": "System",
                "modified_query": "modified query",
                "reused_query": "reused query",

                "unknown_action": "Unknown action",

                "show_legend": "Show legend",
                "hide_legend": "Hide legend",

                "domains_pages": "Domains and pages",

                "search_info": "Navigation actions that occur on a search engine website.",
                "domains_pages_info": "Navigation actions that occur on a single domain (not a search engine).",
                "pages_info": "Navigation actions that occur on a web page in within a domain.",
                "system_info": "System actions like start, pause, stop, etc.",

                "new_page": "New page",
                "new_query": "New query",
                "modified_query_m": "Modified query",
                "reused_query_m": "Reused query",
                "new_domain": "New domain",
                "visited_domain": "Visited domain",
                "chatbot": "Chatbot",

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
                "hint": "Hint",

                "error_message" : "Uhm. Unfortunately we got an error with the data loading. Please try again in a moment.",
                "hints_error_message" : "Uhm. Unfortunately we got an error with the hints loading. Please try again in a moment."

            }
        },
        de: {
            translation: {
                
                "user": "Benutzer:in",
                "task": "Aufgabe",
                "normalize_scale": "Normaliziert",
                "fit_scale": "Fit",
                "search": "Suche",
                "searches": "Suchen",
                "domains": "Domänen",
                "pages": "Seiten",
                "system": "System",
                "modified_query": "geänderte Query",
                "reused_query": "wiederverwendet Query",

                "unknown_action": "Unbekannte Aktion",
                
                "show_legend": "Legende anzeigen",
                "hide_legend": "Legende ausblenden",

                "domains_pages": "Domänen und Seiten",

                "search_info": "Navigationsaktionen, die auf einer Suchmaschinen-Website stattfinden.",
                "domains_pages_info": "Navigationsaktionen, die auf einer einzelnen Domain (nicht einer Suchmaschine) stattfinden.",
                "pages_info": "Navigationsaktionen, die auf einer Webseite innerhalb einer Domäne stattfinden.",
                "system_info": "Systemaktionen wie Starten, Anhalten, Stoppen, etc.",

                "new_page": "Neue Seite",
                "new_query": "Neues Query",
                "modified_query_m": "Geändertes Query",
                "reused_query_m": "Wiederverwendetes Query",
                "new_domain": "Neue Domain",
                "visited_domain": "Besuchte Domain",
                "chatbot": "Chatbot",
                
                "statistics": "Statistiken",
                "time": "Zeiten",
                "total": "Total",
                "total_cap": "Total",
                "shortest": "Kürzest",
                "average": "Durchschnitt",
                "longest": "Längest",
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
                "hint": "Tipp",

                "error_message" : "Ähm… Leider ist beim Laden der Daten ein Fehler aufgetreten. Bitte versuche es in einem Moment erneut.",
                "hints_error_message" : "Uhm. Leider ist beim Laden der Hinweise ein Fehler aufgetreten. Bitte versuchen Sie es in einem Moment noch einmal."
            }
        },
        it: {
            translation: {

                "user": "Utente",
                "task": "Attività",
                "normalize_scale": "Normalizza",
                "fit_scale": "Adatta",
                "search": "Ricerca",
                "searches": "Ricerche",
                "domains": "Domini",
                "pages": "Pagine",
                "system": "Sistema",
                "modified_query": "query modificata",
                "reused_query": "query riusata",

                "unknown_action": "Azione sconosciuta",

                "show_legend": "Mostra legenda",
                "hide_legend": "Nascondi legenda",

                "domains_pages": "Domini e pagine",
                
                "search_info": "Azioni di navigazione che avvengono su un motore di ricerca.",
                "domains_pages_info": "Azioni di navigazione che avvengono su un singolo dominio (non su un motore di ricerca).",
                "pages_info": "Azioni di navigazione che si verificano su una pagina web all'interno di un dominio.",
                "system_info": "Azioni di sistema come avvio, pausa, arresto, ecc.",

                "new_page": "Nuova pagina",
                "new_query": "Nuova query",
                "modified_query_m": "Query modificata",
                "reused_query_m": "Query riusata",
                "new_domain": "Nuovo dominio",
                "visited_domain": "Dominio visitato",
                "chatbot": "Chatbot",

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
                "hint": "Suggerimento",

                "error_message" : "Ops. Purtroppo si è verificato un errore nel caricamento dei dati. Per favore riprova tra un momento.",
                "hints_error_message" : "Ops. Purtroppo si è verificato un errore nel caricamento dei suggerimenti. Per favore riprova tra un momento."
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

    document.getElementById('t_user').textContent = i18next.t('user');
    document.getElementById('t_task').textContent = i18next.t('task');

    document.getElementById('t_normalize_scale').textContent = i18next.t('normalize_scale');
    document.getElementById('t_fit_scale').textContent = i18next.t('fit_scale');

    document.getElementById('t_statistics').textContent = i18next.t('statistics');
    document.getElementById('t_suggestions').textContent = i18next.t('suggestions');

    const suggestions_container = document.getElementById('suggestions_container');
    if (suggestions_container.offsetWidth != 0 && suggestions_container.offsetHeight != 0){
        console.log(suggestions_container.offsetWidth)
        document.getElementById('t_observation').textContent = i18next.t('observation');
        document.getElementById('t_hint').textContent = i18next.t('hint');
    }

    document.getElementById('t_show_legend').textContent = i18next.t('show_legend');

}

// Change language
// function changeLanguage(lng) {
//     i18next.changeLanguage(lng, updateContent);
// }