function load_hints(){

    const predefined_hints = 'assets/content/hints.json'
    const source_stats = 'assets/data/hints_3_1.json'
    // console.log(source_stats)
    
    Promise.all([
        d3.json(predefined_hints),
        d3.json(source_stats)
    ]).
    then(function([data0, data1]) {
        loaded(data0,data1)
    })
    .catch(function(error) {
        console.error("Error loading JSON files:", error);
    });
    
    const container = document.getElementById('hints');

    function loaded(texts,ids){

        // get the feedback ids
        const feedback_ids = ids.map(item => item.hint.name);
        // console.log(feedback_ids.length);

        let output = ''

        // get the feedback text
        for (let x = 0; x < feedback_ids.length; x++){ // 

            // try{
                const item_obj = getObjectById(texts,feedback_ids[x])
                // console.log(item_obj)
                
                output += `
                    <div class="${item_obj.id}">
                        <p>
                            ${item_obj.advice}   
                        </p>
                        <p>
                            ${item_obj.feedback.en}
                            <br/><br/>
                            👍  👎
                        </p>
                        <p></p>

                    </div>
                `
            // }
            // catch (error) {
            //     console.log(error)
            // }
        }

        container.innerHTML = output;
    }
}