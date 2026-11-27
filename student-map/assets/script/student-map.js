const bubble_size = 12;
const bubble_default_opacity = 0.5;
let the_data;
const t_duration = 100;

let svg, plot, xScale, yScale;
let width, height, margin;

const min_x = 8;
const min_y = 8;

function load_data() {

    const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	const user_id = urlParams.get('user_id');
    // const clazz_id = urlParams.get('clazz_id');
    // const task_id = urlParams.get('task_id');

    // http://127.0.0.1:5500/student-map/index.html?user_id=7&lang=EN

	const apiEndpoint_studentInfo = `https://search.rose.education/api/dashboard/students/${user_id}`

    const tasks = [ // user - task
        [1556, 57],
        [535, 27],
        [538, 27], 
        [446, 27], 
        [861, 27] 
    ] 
    console.log(tasks)

    const requests = tasks.map(([user_id, task_id]) => {

        const url = `https://search.rose.education/api/analytics/stories-extraction?user_id=${user_id}&task_id=${task_id}`;
        return d3.csv(url).then(data => ( data ));

    });

    Promise.all([
        d3.json(apiEndpoint_studentInfo),
        Promise.all(requests)
    ])
    .then(([studentInfo, results]) => {
        console.log(studentInfo);
        // console.log(results);

        loaded(results)

        document.getElementById("the_student").innerHTML = studentInfo.username.split("#")[0];
    })
    .catch(error => {
        if (error.message.includes("404")) {
            console.log("Something went wrong with the data loading");
        } 
        else {
            console.error("Data loading error:", error);
        }
        // no_data();
    });

    function loaded(data){
        // console.log(data);

        // compute totals
        for (let item of data){ 
            // console.log(item)

            const unique_queries = [...new Set(
                item
                    .filter(d => checkAction(d.action)[0] == "search")
                    .map(d => d.query.trim())
                    .filter(q => q !== "")
            )];
            // console.log(unique_queries)

            const unique_prompts = [...new Set(
                item
                    .filter(d => checkAction(d.action)[0] == "page" && d.page_type == "CHATBOT") //  )
                    .map(d => d.query.trim().toLowerCase())
                    // .filter(q => q !== "")
            )];
            console.log(unique_prompts)

            const unique_domains = [...new Set(
                item
                    .filter(d => checkAction(d.action)[0] == "page") //  && d.page_type == "CHATBOT")
                    .map(d => d.query.trim().toLowerCase())
                    .filter(q => q !== "")
            )];
            // console.log(unique_domains)
        } 
    }
}
load_data()

