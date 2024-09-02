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

			plot.selectAll("path")
			    .data(line_data)
			    .enter()
			    .append("path")
			    .attr("d", lineGenerator)
			    .attr("stroke", "gray")  // Line color
			    .attr("stroke-width", 1)  // Line width
			    .attr("fill", "none");    // No fill

		}

		display_data(data)
	}
}	


window.addEventListener('load', function () {    

	load_data();

})