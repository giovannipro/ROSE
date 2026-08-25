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
                "page_m": "Page",
                "system": "System",
                "modified_query": "modified query",
                "reused_query": "reused query",

                "unknown_action": "Unknown action",

                "show_legend": "Show legend",
                "hide_legend": "Hide legend",

                "domains_pages": "Domains", // and pages

                "search_info": "Navigation actions that occur on a search engine website.",
                "chatbot_info": "Navigation actions that occur on a chatbot.",
                "pages_info": "Navigation actions that occur on a web page within a domain.",
                "system_info": "System actions like start, pause, stop, etc.",

                "new_page": "New page",
                "new_query": "New query",
                "modified_query_m": "Modified query",
                "reused_query_m": "Reused query",
                "new_domain": "New domain",
                "visited_domain": "Visited domain",
                "chatbot": "Chatbot",
                "chatbots": "Chatbots",
                "new_chatbot": "New prompt",
                "visited_chatbot": "Revised prompt",

                "statistics": "Statistics",
                "timeUse" : "Time use",
                "time": "Time",
                "total": "total",
                "total_cap": "Total",
                "total_pages": "total pages",
                "duration": "Duration",
                "shortest": "shortest",
                "average": "average",
                "longest": "longest",
                "new": "new",
                "reused": "reused",
                "modified": "modified",
                "queries": "Queries",
                "search_engines": "Search engines",
                "websites": "Websites",
                "revisited": "revisited domains",
                "new_m": "new domains",
                "no_chatbots": "No chatbots were used.",

                "suggestions": "Suggestions",
                "observation": "Observation",
                "hint": "Hint",

                "error_message" : "Uhm. Unfortunately we got an error with the data loading. Please try again in a moment.",
                "hints_error_message" : "One moment please. Your suggestions are being processed. Thank you for your patience!",

                "date" : "Date",
                "page" : "Page",
                "query" : "Search",
                "domain" : "Domain",
                "system" : "System",

                "already_seen": "already seen"
            }
        },
        de: {
            translation: {
                
                "user": "Benutzer",
                "task": "Aufgabe",
                "normalize_scale": "Normaliziert",
                "fit_scale": "Fit",
                "search": "Suche",
                "searches": "Suchen",
                "domains": "Domänen",
                "pages": "Seiten",
                "page_m" : "Seiten",
                "system": "System",
                "modified_query": "geänderte Query",
                "reused_query": "wiederverwendet Query",

                "unknown_action": "Unbekannte Aktion",
                
                "show_legend": "Legende anzeigen",
                "hide_legend": "Legende ausblenden",

                "domains_pages": "Domänen", //  und Seiten

                "chatbot_info": "Navigationsaktionen, die auf einer Suchmaschinen-Website stattfinden.",
                "domains_pages_info": "Navigationsaktionen, die auf einer einzelnen Domain (nicht einer Suchmaschine) stattfinden.",
                "pages_info": "Navigationsaktionen, die auf einer Webseite innerhalb einer Domäne stattfinden.",
                "system_info": "Systemaktionen wie Starten, Anhalten, Stoppen, etc.",

                "new_page": "Neue Seite",
                "new_query": "Neue Query",
                "modified_query_m": "Geändertes Query",
                "reused_query_m": "Wiederverwendetes Query",
                "new_domain": "Neue Domain",
                "visited_domain": "Besuchte Domain",
                "chatbot": "Chatbot",
                "chatbots": "Chatbots",
                "new_chatbot": "Neue Prompt",
                "visited_chatbot": "Überarbeiteter Prompt",
                
                "statistics": "Statistiken",
                "timeUse" : "Zeitnutzung",
                "time": "Zeiten",
                "total": "Total",
                "total_cap": "Total",
                "total_pages": "Gesamtseitenzahl",
                "duration": "Dauer",
                "shortest": "Kürzest",
                "average": "Durchschnitt",
                "longest": "Längest",
                "new": "Neu",
                "reused": "Wiederverwendet",
                "modified": "Geändert",
                "queries": "Abfragen",
                "search_engines": "Suchmaschinen",
                "websites": "Webseiten",
                "revisited": "Bereits ergriffen",
                "new_m": "Neue",
                "no_chatbots": "Es wurden keine Chatbots verwendet.",
                
                "suggestions": "Vorschläge",
                "observation": "Beobachtung",
                "hint": "Tipp",

                "error_message" : "Ähm… Leider ist beim Laden der Daten ein Fehler aufgetreten. Bitte versuche es in einem Moment erneut.",
                "hints_error_message" : "Uhm. Leider ist beim Laden der Hinweise ein Fehler aufgetreten. Bitte versuchen Sie es in einem Moment noch einmal.",
                
                "date" : "Daten",
                "page" : "Seite",
                "query" : "Suche",
                "domain" : "Domäne",
                "system" : "System",

                "already_seen": "schon gesehen",

                "and" : "und"
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
                "page_m" : "Pagina",
                "system": "Sistema",
                "modified_query": "query modificata",
                "reused_query": "query riusata",

                "unknown_action": "Azione sconosciuta",

                "show_legend": "Mostra legenda",
                "hide_legend": "Nascondi legenda",

                "domains_pages": "Domini", //  e pagine
                
                "search_info": "Azioni di navigazione che avvengono su un motore di ricerca.",
                "chatbot_info": "Azioni di navigazione che avvengono su un singolo dominio (non su un motore di ricerca).",
                "pages_info": "Azioni di navigazione che si verificano su una pagina web all'interno di un dominio.",
                "system_info": "Azioni di sistema come avvio, pausa, arresto, ecc.",

                "new_page": "Nuova pagina",
                "new_query": "Nuova query",
                "modified_query_m": "Query modificata",
                "reused_query_m": "Query riusata",
                "new_domain": "Nuovo dominio",
                "visited_domain": "Dominio visitato",
                "chatbot": "Chatbot",
                "chatbots": "Chatbots",
                "new_chatbot": "Nuovo prompt",
                "visited_chatbot": "Prompt modificato",

                "statistics": "Statistiche",
                "timeUse" : "Uso del tempo",
                "total": "totale",
                "total_cap": "Totale",
                "total_pages": "Pagine totali",
                "duration": "Durata",
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
                "revisited": "già visitati",
                "new_m": "nuovi",
                "no_chatbots": "Non sono stati usati chatbot.",
                
                "suggestions": "Suggerimenti",
                "observation": "Osservazione",
                "hint": "Suggerimento",

                "error_message" : "Ops. Purtroppo si è verificato un errore nel caricamento dei dati. Per favore riprova tra un momento.",
                "hints_error_message" : "Un momento per favore. I suggerimenti per te sono attualmente in fase di elaborazione. Grazie per la tua pazienza!",
                
                "date" : "Data",
                "page" : "Pagina",
                "query" : "Ricerca",
                "domain" : "Dominio",
                "system" : "Sistema",

                "already_seen": "già visto",

                "and" : "e"
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

    document.getElementById('t_timeUse').textContent = i18next.t('timeUse');
    document.getElementById('t_statistics').textContent = i18next.t('statistics');
    document.getElementById('t_suggestions').textContent = i18next.t('suggestions');

    const suggestions_container = document.getElementById('suggestions_container');
    if (suggestions_container.offsetWidth != 0 && suggestions_container.offsetHeight != 0){
        // console.log(suggestions_container.offsetWidth)
        document.getElementById('t_observation').textContent = i18next.t('observation');
        document.getElementById('t_hint').textContent = i18next.t('hint');
    }

    document.getElementById('t_show_legend').textContent = i18next.t('show_legend');

}

// Change language
// function changeLanguage(lng) {
//     i18next.changeLanguage(lng, updateContent);
// }