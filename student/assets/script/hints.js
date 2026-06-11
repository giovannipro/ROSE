function load_hints(){
    
    const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	const user_id = urlParams.get('user_id');
    const task_id = urlParams.get('task_id');

    const predefined_hints = 'assets/content/hints.json'
	const apiEndpoint_hint = 'assets/data/studentHints.json' // https://search.rose.education/api/analytics/adaptive-hints?user_id=${user_id}&task_id=${task_id}`; // 93 20

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
    
    const hint_container_a = document.getElementById('hints_a');
    const hint_container_b = document.getElementById('hints_b');
    const hint_container_c = document.getElementById('hints_c');

    function loaded(predefined,feedback){
        // console.log(feedback)


        const hint_container = document.getElementById('hints')

        let the_language = (i18next.language).toLowerCase()

        const priority_order = feedback.sort((a, b) => a.hint.priority - b.hint.priority);

        let feedback_ids = []
        if (priority_order.length > 0){
            feedback_ids = priority_order.map(item => item.hint.name);
            // feedback_ids = ['s1','s2','s3','s4','c1','c2','c3','c4','o1','o2','o3','w1','w2','w3','d1']
        }
        else {
            feedback_ids = ['d1']
        }

        let output = ''

        let output_a = '';
        let output_b = '';
        let output_c = '';

        // Observation
        // -----------------------------------------------

        output_a += `<span style="margin-bottom: 1rem; display: block;"><strong>${i18next.t('observation')}</strong></span>`;
	    output_a += '<hr/ style="border: 0.1px solid #ccc">'

        output_b += `<span style="margin-bottom: 1rem; display: block;"><strong>${i18next.t('hint')}</strong></span>`;
	    output_b += '<hr/ style="border: 0.1px solid #ccc">'

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

                output_a += `<div class="content ${item_obj.id}">${observation}</div>`
                output_b += `<div class="content">${hint}</div>`
                
            }
            catch (error) {
                console.log(error)
            }
        }

        hint_container_a.innerHTML = output_a;
	    hint_container_b.innerHTML = output_b;
	    // hint_container_c.innerHTML = output_c;

    }
}

function show_hint_error(){
    console.log('Error loading the adaptive hints');

    const hint_container = document.getElementById('hints_message');
    const error_box = document.createElement('div')
    error_box.classList.add('error_box_small');
    error_box.textContent = i18next.t('hints_error_message');
    hint_container.append(error_box)

    const sugg = document.getElementById('sugg');
    sugg.remove();
}