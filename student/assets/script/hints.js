function load_hints(){
    
    const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	const user_id = urlParams.get('user_id');
    const task_id = urlParams.get('task_id');

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
        console.log(predefined)

        // get the feedback ids
        const feedback_ids = feedback.map(item => item.hint.name);
        // console.log(feedback_ids.length);

        let output = ''

        console.log(getObjectById(predefined,feedback_ids[0]))

        // get the feedback text
        for (let x = 0; x < feedback_ids.length; x++){ // 
            // console.log(feedback_ids[x])

            try{
                const item_obj = getObjectById(predefined,feedback_ids[x])
                // console.log(item_obj)

                // 
                output += `
                    <div class="${item_obj.id}">
                        <p>
                            ${item_obj.observation.en}   
                        </p>
                        <p>
                            ${item_obj.hint.en}
                            <br/><br/>
                            👍  👎
                        </p>
                        <p></p>

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