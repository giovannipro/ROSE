const container = "#container";
const duration = 100;

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

			// scale time
			const total_duration = data.reduce((sum, item) => sum + item.duration, 0);

			const timeScale = d3.scaleTime()
			    .domain([new Date(data[0].time), new Date(data[data.length-1].time)]) 
			    .range([200, width]); 

			// const durationScale = d3.scaleLinear()
			//     .domain([(data[0].duration), new Date(data[data.length-1].duration)])
			//     .range([0, width]);

			// console.log(data[data.length-1].time)
			// console.log(data[0].time)

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

			let strip_box = strips.selectAll("g")
				.data(data)
				.enter()
				.append("g")
				.attr("class","strip_box")
				.on("mouseover", handleMouseOver) 
				.on("mouseout", handleMouseOut)

			let strip_rect = strip_box.append("rect")
				.attr("data-action", (d) => d.action)
				.attr("data-domain", (d) => d.domain)
				.attr("data-url", (d) => {
					// console.log(d.url)
					return d.url
				})
				.attr("x", (d,i) => {
					const x_pos = timeScale(new Date(d.time))
					return x_pos
				})
				.attr("y", (d,i) => {
					let y_pos = 0
					if (d.action.indexOf("SEARCH") >= 0) {
						y_pos = 0
					}
					else if (d.action.indexOf("RESULT") >= 0) {
						y_pos = height/5*1
					}
					else {
						y_pos = height/5*3
					}
					return y_pos
				})
				.attr("width", (d) => {
					const width = 2
					return width
				})
				.attr("height", (d) => {
					const strip_height = height/5
					return strip_height 
				})
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
					else if (d.action == "SAME_SEARCH"){
						color = 'blueviolet' 
					}
					else if (d.action == "NEW_SEARCH" || d.action == "NEW_SEARCH_SAME_ENGINE"){
						color = 'violet' 
					}
					else if (d.action == "REFINE_SEARCH"){
						color = 'aquamarine' 
					}
					else if (d.action == "SEARCH_ENDED"){
						color = 'peachpuff' 
					}
					else if (d.action == "NEW_RESULT"){
						color = 'green' 
					}
					else if (d.action == "SEEN_DOMAIN_RESULT"){
						color = 'lightgreen' 
					}
					else if (d.action == "SEEN_SEARCH"){
						color = 'lightcoral' 
					}
					return color
				})
				

				let strip_text = strip_box.append("text")
					.text((d) => d.url)
					.attr("x",5)
					.attr("y", 20)
					.attr("opacity",0)


				function handleMouseOver(){
					d3.select(this).select("text")
						.transition()
						.duration(duration)
						.attr("opacity",1)
				}

				function handleMouseOut(){
					d3.select(this).select("text")
						.transition()
						.duration(duration)
						.attr("opacity",0)
				}
		}

		display_data(data)
	}
}	


window.addEventListener('load', function () {	

	load_data();

})