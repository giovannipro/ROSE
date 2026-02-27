function display_hints(class_hints, predefined){
    // console.log(class_hints)
    // console.log(predefined)
    
    const visible_hints = class_hints.filter((a) => a.num_users_visible > 0)

    const sorted = visible_hints.sort((a, b) => {
        if (b.num_users_visible !== a.num_users_visible) {
            return b.num_users_visible - a.num_users_visible; // descending
        }
        return b.hint.priority - a.hint.priority; // descending
    });

    // - num_users_visible = number of users in the class where the hint was triggered and visible 
    // - num_users_invisible = number of users in the class where the hint was triggered but not visible (likely because hints with higher priority were selected)

    let output = ''

    output += `<div class="">
        <span id="t_sortBy" class="column_header">
            ${i18next.t('observations')}
        </span>
        <hr style="border: 0.1px solid #ccc; margin-bottom: 0;">
        <table id="hintTable" class="table_counters">
    `

    for (item of sorted){
        // console.log(item.hint.name, item.hint.priority)

        let hint = getObjectById(predefined,item.hint.name)
        let the_language = (i18next.language).toLowerCase()

        let hint_text = ""
        
        if (the_language == 'it'){
            hint_text = hint.observation.it
        }
        else if (the_language == 'de'){
            hint_text = hint.observation.de
        }
        else {
            hint_text = hint.observation.en
        }

        output += `<tr>
                <td style="width: 10%;">
                    <span class="tooltip">
                        <span style="padding: 0.25rem">&#9432</span>
                        <span class="tooltip-text">${hint.hint.en}</span>
                    </span>
                </td>
                <td style="width: 80%; text-align: left;">
                    ${hint_text}
                </td>
                <td style="text-align: right;">
                    ${item.num_users_visible}
                </td>
            </tr>`;
                
            }
            
            // <span class="tooltip">x</button>${hint_text}</td>
    output += `</table></div>`
    // {hint.hint.en}


    return output
}
