const dataset = "search_story_task_8_user_1003.csv"
// const dataset = "search_story_task_5_user_1015.csv"

const container = "#container";
const duration = 100;

function load_data() {
	
	// load data
	d3.csv("../assets/data/" + dataset)
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
			    .domain([new Date(data[0].time), new Date(data[data.length-1].time).getTime() + data[data.length-1].duration*1000]) 
			    .range([200, width])
			    // .nice()

			// console.log(data[0].time)
			// console.log(data[data.length-1].time)

			const strip_height = height/6

			let line_data = [
				[{ x: 0, y: 0 },{ x: width, y: 0 }],
				[{ x: 0, y: strip_height*1 },{ x: width, y: strip_height*1 }],
				[{ x: 0, y: strip_height*2 },{ x: width, y: strip_height*2 }],
				[{ x: 0, y: strip_height*3 },{ x: width, y: strip_height*3 }],
				[{ x: 0, y: strip_height*4 },{ x: width, y: strip_height*4 }],
				[{ x: 0, y: strip_height*5 },{ x: width, y: strip_height*5 }]
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
				.attr("stroke", "#d0d0d0")
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
				.attr("data-url", (d) => d.url)
				.attr("x", (d,i) => {
					const x_pos = timeScale(new Date(d.time))
					return x_pos
				})
				.attr("y", (d,i) => {
					let y_pos = 0
					if (d.action.indexOf("SEARCH") >= 0) {
						y_pos = height/6*1
					}
					else if (d.action.indexOf("RESULT") >= 0) {
						y_pos = height/6*2
					}
					else {
						y_pos = height/6*4
					}
					return y_pos
				})
				.attr("width", (d) => {
					const end_time = new Date(d.time).getTime() + d.duration*1000
					const width = timeScale(end_time) - timeScale(new Date(d.time))
					// console.log(end_time, width)
					return width
				})
				.attr("height", (d) => {
					return strip_height 
				})
				.attr("stroke","black")
				.attr("stroke-opacity", 0.2)
				.attr("fill", (d) => {
					let color = 'blue'
					if (d.action == "TASK_STARTED" || d.action == "PRE_SURVEY_STARTED" || d.action == "PRE_SURVEY_ENDED" || d.action == 'POST_SURVEY_STARTED'){
						color = '#dbdbdb' 
					}
					else if (d.action == "NEW_TAB"){
						color = '#afafaf'
					}
					else if (d.action == "SEARCH_STARTED" || d.action == "SEARCH_ENDED" || d.action == "SEARCH_RESUMED"){
						color = '#4ab9dd' 
					}
					// else if (d.action == "SEARCH_RESUMED"){
					// 	color = 'lightblue' 
					// }
					else if (d.action == "SAME_SEARCH"){
						color = 'blueviolet' 
					}
					else if (d.action == "NEW_SEARCH" || d.action == "NEW_SEARCH_SAME_ENGINE"){
						color = 'violet' 
					}
					else if (d.action == "REFINE_SEARCH"){
						color = 'aquamarine' 
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
					.text((d) => d.url + ', ' + (d.duration/60).toFixed(2) + ' min')
					.attr("x", 10)
					.attr("y", height/5*1/2)
					.attr("opacity",0)

		        // strip labels
				let labels = plot.append("g")
					.attr("class","labels")

		        let label_a = labels.append("text")
		            .attr("x", 10)
		            .attr("y", (strip_height*1))
		            .attr("dy", strip_height/2)
		            .attr("alignment-baseline","middle")
		            .text("Search");

		        let label_b = labels.append("text")
		            .attr("x", 10)
		            .attr("y", (strip_height*2))
		            .attr("dy", strip_height/2)
		            .attr("alignment-baseline","middle")
		            .text("Website");

		        let label_c = labels.append("text")
		            .attr("x", 10)
		            .attr("y", (strip_height*3))
		            .attr("dy", strip_height/2)
		            .attr("alignment-baseline","middle")
		            .text("Page");

		        let label_d = labels.append("text")
		            .attr("x", 10)
		            .attr("y", (strip_height*4))
		            .attr("dy", strip_height/2)
		            .attr("alignment-baseline","middle")
		            .text("Other");

				// x-axis
		        const xAxis = d3.axisBottom(timeScale)
		            // .ticks(18)
		        .ticks(d3.timeMinute.every(5)) 
		            .tickFormat(d => {
				        const hours = d.getHours();
				        const minutes = d.getMinutes();
				        const duration = hours * 60 + minutes;
				        const start = new Date(data[0].time).getMinutes() + (new Date(data[0].time).getHours() * 60)

				        return (duration-start+1) + " min";
				    })
		            // .tickFormat(d3.timeFormat('%M:%S'));

		        const xAxis_box = plot.append("g")
		            .attr("class","x_axis")
		            .attr("transform", "translate(0, " + (height - 70) + ")")
		            .call(xAxis)


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