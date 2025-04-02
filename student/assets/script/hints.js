function load_hints(){
    
    const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	const user_id = urlParams.get('user_id');
    const task_id = urlParams.get('task_id');
    const lang_ = urlParams.get('lang');
    const the_language = lang_.toLocaleLowerCase();
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
        loaded(predefined,student_hints)
    })
    .catch(function(error) {
        console.error("Error loading JSON files:", error);
    });
    
    const container = document.getElementById('hints');

    function loaded(predefined,feedback){
        console.log(feedback)

        const priority_order = feedback.sort((a, b) => a.hint.priority - b.hint.priority);
        // console.log(priority_order)

        // get the feedback ids
        const feedback_ids = priority_order.map(item => item.hint.name);
        // const feedback_ids = ['s1','s2','s3','s4','c1','c2','c3','c4','o1','o2','o3','w1','w2','w3','d1']
        // console.log(feedback_ids);

        let output = ''
        output += `
            <div>
                <div class="hint_label">Observation</div>
                <div class="hint_label">Hint</div>
                <div class="hint_label"></div>
            </div>
        `
        // get the feedback text
        for (let x = 0; x < feedback_ids.length; x++){ // 
            // console.log(feedback_ids[x])

            try {
                const item_obj = getObjectById(predefined,feedback_ids[x])

                // observation
                if (the_language === 'de'){
                    observation = item_obj.observation.de
                }
                else if (the_language === 'it'){
                    observation = item_obj.observation.it
                }
                else {
                    observation = item_obj.observation.en
                }

                // hint
                if (the_language === 'de'){
                    hint = item_obj.hint.de
                }
                else if (the_language === 'it'){
                    hint = item_obj.hint.it
                }
                else {
                    hint = item_obj.hint.en
                }
                
                // 
                output += `
                    <div class="${item_obj.id}">
                        <div class="content">
                            ${observation}   
                        </div>
                        <div class="content">
                            ${hint}
                            <div class="like">
                                👍  👎
                            </div>
                        </div>
                        <div class="content"></div>
                    </div>
                `
            }
            catch (error) {
                console.log(error)
            }
        }

        container.innerHTML = output;
    }
}