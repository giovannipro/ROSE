function load_hints(){
    
    const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	const user_id = urlParams.get('user_id');
    const task_id = urlParams.get('task_id');
    // const lang_ = urlParams.get('lang');
    // const the_language = lang_.toLocaleLowerCase();
    // console.log(the_language);

	// const apiEndpoint_hint = `assets/data/hints_${user_id}_${task_id}.json`
    const predefined_hints = 'assets/content/hints.json'
	const apiEndpoint_hint = `https://search.rose.education/api/analytics/adaptive-hints?user_id=${user_id}&task_id=${task_id}`; // 93 20
	// console.log(user_id,task_id)

    Promise.all([
        d3.json(predefined_hints),
        d3.json(apiEndpoint_hint)
    ])
    .then(function([predefined, student_hints]) {
        // console.log(student_hints)

       loaded(predefined,student_hints)
       
    })
    .catch(function(error) {
        show_hint_error()
    });
    
    function loaded(predefined,feedback){
        // console.log(feedback)

        const hint_container = document.getElementById('hints')

        let the_language = (i18next.language).toLowerCase()
        // console.log(the_language)

        const priority_order = feedback.sort((a, b) => a.hint.priority - b.hint.priority);
        // console.log(priority_order)

        let feedback_ids = []
        if (priority_order.length > 0){
            feedback_ids = priority_order.map(item => item.hint.name);
            // feedback_ids = ['s1','s2','s3','s4','c1','c2','c3','c4','o1','o2','o3','w1','w2','w3','d1']
        }
        else {
            feedback_ids = ['d1']
        }

        let output = ''
        output += `
            <div>
                <div class="hint_label" id="t_observation">${i18next.t('observation')}</div>
                <div class="hint_label" id="t_hint">${i18next.t('hint')}</div>
                <div class="hint_label"></div>
            </div>
        `

        // get the feedback text
        for (let x = 0; x < feedback_ids.length; x++){

            try {
                const item_obj = getObjectById(predefined,feedback_ids[x])

                // observation
                if (the_language === 'de'){
                    observation = item_obj.observation.de
                    hint = item_obj.hint.de
                }
                else if (the_language === 'it'){
                    observation = item_obj.observation.it
                    hint = item_obj.hint.it
                }
                else {
                    observation = item_obj.observation.en
                    hint = item_obj.hint.en
                }
                
                output += `
                    <div class="${item_obj.id}">
                        <div class="content">
                            ${observation}   
                        </div>
                        <div class="content">
                            ${hint}
                        </div>
                        <div class="content"></div>
                    </div>
                `
            }
            catch (error) {
                console.log(error)
            }
        }

        hint_container.innerHTML = output;
    }
}

function show_hint_error(){
    console.log('Error loading the adaptive hints');

    const hint_container = document.getElementById('hints_message');
    const error_box = document.createElement('div')
    error_box.classList.add('error_box_small');
    error_box.textContent = i18next.t('hints_error_message');
    hint_container.prepend(error_box)
}