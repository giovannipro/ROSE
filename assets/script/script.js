const container = "#container";

function load_data() {
	
	// load data
	d3.csv("../assets/data/search_story_task_5_user_1015.csv")
		.then(loaded)

	function loaded(data) {
		console.log(data)

		let window_w = document.getElementById("container").offsetWidth;
			window_h = document.getElementById("container").offsetHeight;

		let margin = {top: 20, left: 0, bottom: 20, right: 0},
			width = window_w - (margin.right + margin.right),
			height = window_h - (margin.top + margin.bottom);

		data.forEach(function(d) {
        	d.duration = parseFloat(d.duration);  
    	});

		function display_data(data){
			let svg = d3.select(container)
				.append("svg")
				.attr("width", width + (margin.right + margin.right))
				.attr("height",height + (margin.top + margin.bottom))
				.attr("id", "svg")

			let plot = svg.append("g")
				.attr("id", "plot")
				.attr("transform", "translate(" + margin.right + "," + margin.top + ")");

			let line_data = [
				[{ x: 0, y: 0 },{ x: width, y: 0 }],
				[{ x: 0, y: height/5*1 },{ x: width, y: height/5*1 }],
				[{ x: 0, y: height/5*2 },{ x: width, y: height/5*2 }],
				[{ x: 0, y: height/5*3 },{ x: width, y: height/5*3 }],
				[{ x: 0, y: height/5*4 },{ x: width, y: height/5*4 }]
			];

			const lineGenerator = d3.line()
				.x((d) => d.x)  
				.y((d) => d.y);

			let lines = plot.append("g")
				.attr("class","lines")

			let line = lines.selectAll("path")
				.data(line_data)
				.enter()
				.append("path")
				.attr("d", lineGenerator)
				.attr("stroke", "gray")
				.attr("stroke-width", 1)
				.attr("fill", "none")

			let strips = plot.append("g")
				.attr("class","strips")

			let strip = strips.selectAll("rect")
				.data(data)
				.enter()
				.append("rect")
				.attr("data-action", (d) => d.action)
				.attr("x", (d,i) => 50)
				.attr("y", (d,i) => i*height/data.length)
				.attr("width", (d) => d.duration)
				.attr("height", height/data.length)
				.attr("fill", (d) => {
					let color = 'blue'
					if (d.action == "TASK_STARTED" || d.action == "PRE_SURVEY_STARTED" || d.action == "PRE_SURVEY_ENDED" || d.action == 'POST_SURVEY_STARTED'){
						color = 'orange' 
					}
					else if (d.action == "NEW_TAB"){
						color = 'pink'
					}
					else if (d.action == "SEARCH_STARTED"){
						color = 'red' 
					}
					else if (d.action == "SEARCH_RESUMED"){
						color = 'lightblue' 
					}
					else if (d.action == "NEW_RESULT"){
						color = 'yellow' 
					}
					else if (d.action == "SAME_SEARCH"){
						color = 'blueviolet' 
					}
					else if (d.action == "NEW_SEARCH"){
						color = 'violet' 
					}
					else if (d.action == "REFINE_SEARCH"){
						color = 'aquamarine' 
					}
					else if (d.action == "NEW_SEARCH_SAME_ENGINE"){
						color = 'peachpuff' 
					}
					else if (d.action == "NEW_RESULT"){
						color = 'green' 
					}
					else if (d.action == "SEEN_DOMAIN_RESULT"){
						color = 'lightgreen' 
					}
					else if (d.action == "SEARCH_RESUMED"){
						color = 'lightcoral' 
					}
					return color
				})

		}

		display_data(data)
	}
}	


window.addEventListener('load', function () {	

	load_data();

})