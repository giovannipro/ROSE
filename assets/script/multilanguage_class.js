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
                "stories": "stories"
               
            }
        },
        de: {
            translation: {
                

                "user": "Benutzer",
                "class": "Klasse",
                "stories": "Geschichten"
                
            }
        },
        it: {
            translation: {

                "class": "Classe",
                "user": "Utente",
                "stories": "storie"
                
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
}
