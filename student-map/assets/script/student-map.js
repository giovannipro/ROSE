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

    Promise.all([
        d3.json(apiEndpoint_studentInfo)
    ])
    .then(([studentInfo]) => {

        loaded(studentInfo)

        document.getElementById("the_student").innerHTML = studentInfo.username.split("#")[0];

    })
    .catch(function (error) {
        if (error.message.includes("404")) {
            console.log("Something went wrong with the data loading");
        } 
        else {
            console.error("Data loading error:", error);
        }
        no_data()
    });

    function loaded(data){
        console.log(data)
    }
}
load_data()

