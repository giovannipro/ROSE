// const dataset = "search_story_task_8_user_1004"
// const dataset = "search_story_task_8_user_1005"
// const dataset = "search_story_task_8_user_1007"
// const dataset = "search_story_task_8_user_1010"
const dataset = "search_story_task_8_user_1013"

const container = "#container";
const duration = 100;
const start_shift = 100;
const interline = 2;

function getTextAfterX(query,x) {
  const index = query.indexOf(x);

  if (index !== -1) {
	return query.substring(index + 2);
  }

  return "";
}

const new_page_color = '#ff9100'
const duration_color = '#a4a4a4'

function groupConsecutiveDomains(data) {
	data = data.filter(d => d.page_type == 'RESULT')

  	const groupedData = [];
  	let currentGroup = [];

  for (let i = 0; i < data.length; i++) {
	const currentItem = data[i];
	const previousItem = data[i - 1];

	if (previousItem && currentItem.domain !== previousItem.domain) {
	  // New domain encountered, start a new group
	  if (currentGroup.length > 0) {
		groupedData.push(currentGroup);
	  }
	  currentGroup = [];
	}

	currentGroup.push(currentItem);
  }

  // Add the last group if it's not empty
  if (currentGroup.length > 0) {
	groupedData.push(currentGroup);
  }

  return groupedData;
}

function load_data() {
	
	// load data
	d3.csv("../assets/data/" + dataset + '.csv')
		.then(loaded)

	function loaded(data) {
		console.log(data)

		let window_w = document.getElementById("container").offsetWidth;
			window_h = document.getElementById("container").offsetHeight;

		let margin = {top: 10, left: 0, bottom: 20, right: 0},
			width = window_w - (margin.right + margin.right),
			height = window_h - (margin.top + margin.bottom);

		data.forEach(function(d) {
			d.duration = parseFloat(d.duration);  
		});

		const website_strip_data = groupConsecutiveDomains(data);
		console.log(website_strip_data)

		document.getElementById("task_name").innerHTML = dataset

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

			let timeScale = d3.scaleTime()
				.domain([new Date(data[0].time), new Date( new Date(data[data.length-1].time).getTime() + data[data.length-1].duration * 1000) ]) 
				.range([start_shift, width-20])
				// .nice()

			// console.log(new Date(data[0].time))
			// console.log(new Date( new Date(data[data.length-1].time).getTime() + data[data.length-1].duration * 1000))

			const strip_height = height/6

			let line_data = [
				[{ x: 0, y: 0 },{ x: width, y: 0 }],
				[{ x: 0, y: strip_height*1 },{ x: width, y: strip_height*1 }],
				[{ x: 0, y: strip_height*2 },{ x: width, y: strip_height*2 }],
				[{ x: 0, y: strip_height*3 },{ x: width, y: strip_height*3 }],
				[{ x: 0, y: strip_height*4 },{ x: width, y: strip_height*4 }]
				// [{ x: 0, y: strip_height*5 },{ x: width, y: strip_height*5 }]
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

			let strip_website_box = plot.append("g")
				.attr("class","strip_website")

			let strip_box = strips.selectAll("g")
				.data(data)
				.enter()
				.append("g")
				.attr("class","strip_box")
				.on("mouseover", handleMouseOver) 
				.on("mouseout", handleMouseOut)
				.append("a")
				.attr("xlink:href", (d) => {
					return d.url
				})
				.attr("target","_blank")

			let strip_rect = strip_box.append("rect")
				.attr("data-action", (d) => d.action)
				.attr("data-domain", (d) => d.domain)
				// .attr("data-url", (d) => d.url)
				.attr("x", (d,i) => {
					const x_pos = timeScale(new Date(d.time))
					return x_pos
				})
				.attr("y", (d,i) => {
					let y_pos = 0
					if (d.page_type == 'SEARCH_ENGINE') {
						y_pos = height/6*0
					}
					else if (d.page_type == 'RESULT') {
						y_pos = height/6*2
					}
					else {
						y_pos = height/6*3
					}
					return y_pos + interline
				})
				.attr("width", (d) => {
					const end_time = new Date(d.time).getTime() + d.duration*1000
					const width = timeScale(end_time) - timeScale(new Date(d.time))
					return width
				})
				.attr("height", (d) => {
					return strip_height - (interline*2)
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
						color = '#9aa4ac' 
					}
					else if (d.action == "SAME_SEARCH" || d.action == "SEEN_SEARCH"){
						color = '#85DAE9' 
					}
					else if (d.action == "NEW_SEARCH" || d.action == "NEW_SEARCH_SAME_ENGINE"){
						color = '#619ED4' 
					}
					else if (d.action == "REFINE_SEARCH"){
						color = '#C8DFF4' 
					}
					// results
					else if (d.action == "NEW_RESULT"){
						color = new_page_color 
					}
					else if (d.action == "SAME_DOMAIN_RESULT"){
						color = '#feaf48'  // orange
					}
					else if (d.action == "SEEN_DOMAIN_RESULT"){
						color = '#fdc780' 
					}
					// else if (d.action == "SEEN_SEARCH"){
					// 	color = 'lightcoral' 
					// }
					return color
				})

				// website strips
				let strip_website = strip_website_box.selectAll("g")
					.data(website_strip_data)
					.enter()
					.append("g")
					.attr("class","website")
					.append("a")
					.attr("xlink:href", (d) => {
						return d[0].url
					})
					.attr("target","_blank")
					.on("mouseover", handleMouseOver_website) 
					.on("mouseout", handleMouseOut_website)

				let strip_website_rect = strip_website.append("rect")
					.attr("x", (d,i) => {
						const x_pos = timeScale(new Date(d[0].time))
						return x_pos
					})
					.attr("y", (d,i) => {
						let y_pos = height/6*1
						return y_pos + interline
					})
					.attr("width", (d) => {
						const end_time = new Date(d[d.length-1].time).getTime() + d[d.length-1].duration*1000
						const width = timeScale(end_time) - timeScale(new Date(d[0].time))
						return width
					})
					.attr("height", (d) => {
						return strip_height - (interline*2)
					})
					.attr("stroke","black")
					.attr("stroke-opacity", 0.2)
					.attr("fill", new_page_color)
				
				let strip_text_box = strip_box.append("text")
					.attr("transform","translate(" + start_shift + "," + height/5*4/1 + ")")
					.attr("x", 0)
					.attr("y", 0)
					.attr("alignment-baseline","middle")
					.attr("opacity",0)

				let strip_website_textBox = strip_website.append("text")
					.attr("transform","translate(" + start_shift + "," + height/5*4/1 + ")")
					.attr("x", 0)
					.attr("y", 0)
					.attr("alignment-baseline","middle")
					.attr("opacity",0)

				let strip_website_text_a = strip_website_textBox.append("tspan")
					.text((d) => {
						return  d[0].domain
					})
					

				let strip_website_text_b = strip_website_textBox.append("tspan")
					.text((d) => {
						const totalDuration = d.reduce((accumulator, currentObject) => {
    						return accumulator + currentObject.duration
						}, 0)
						return Math.floor(totalDuration/60 * 60) + ' seconds / ' + (totalDuration/60).toFixed(1) + ' minutes'
					})
					.attr("x",0)
					.attr("dy", 20)
					.attr("fill",duration_color)

				let info_a = strip_text_box.append("tspan")
					.text((d) => {
						let url = d.url
						if (url.indexOf("google") >= 0 ){ // && url.indexOf("safe=active") == -1
							url_a = url.replace("https://www.google.com/search?q=","")
							url_b = url_a.split("&")[0]
							url_c = url_b.replace(/\+/g," ")

							the_url = "query on Google: " + url_c
						}
						else {
							the_url = url
						}
						return the_url
					})

				let info_b = strip_text_box.append("tspan")
					.text((d) => (
						Math.floor(d.duration/60 * 60)) + ' seconds / ' + (d.duration/60).toFixed(1) + ' minutes'
					)
					.attr("dy", 20)
					.attr("x",0)
					.attr('fill',duration_color)

				// strip labels
				let labels = plot.append("g")
					.attr("class","labels")

				let label_a = labels.append("text")
					.attr("x", 10)
					.attr("y", (strip_height*0))
					.attr("dy", strip_height/2)
					.attr("alignment-baseline","middle")
					.text("Search");

				let label_b = labels.append("text")
					.attr("x", 10)
					.attr("y", (strip_height*1))
					.attr("dy", strip_height/2)
					.attr("alignment-baseline","middle")
					.text("Website");

				let label_c = labels.append("text")
					.attr("x", 10)
					.attr("y", (strip_height*2))
					.attr("dy", strip_height/2)
					.attr("alignment-baseline","middle")
					.text("Page");

				let label_d = labels.append("text")
					.attr("x", 10)
					.attr("y", (strip_height*3))
					.attr("dy", strip_height/2)
					.attr("alignment-baseline","middle")
					.text("Other");

				// x-axis
				const xAxis = d3.axisBottom(timeScale)
					// .ticks(18)
				.ticks(d3.timeMinute.every(2)) 
					.tickFormat(d => {
						const hours = d.getHours();
						const minutes = d.getMinutes();
						const duration = hours * 60 + minutes;
						const start = new Date(data[0].time).getMinutes() + (new Date(data[0].time).getHours() * 60)

						return (duration-start+0) + "'"//+ ":00";
					})

				const xAxis_box = plot.append("g")
					.attr("class","x_axis")
					.attr("transform", "translate(0, " + (strip_height * 4 + interline) + ")")
					.call(xAxis)

				// handle Mouse Over
				function handleMouseOver(){
					d3.select(this).select("text")
						.transition()
						.duration(duration)
						.attr("opacity",1)

					d3.selectAll(".strip_box")
						.attr("opacity",0.4)

					d3.select(this)
						.attr("opacity",1)

					d3.selectAll(".website")
						.attr("opacity",0.4)
				}

				function handleMouseOut(){
					d3.select(this).select("text")
						.transition()
						.duration(duration)
						.attr("opacity",0)

					d3.selectAll(".strip_box")
						.attr("opacity",1)

					d3.selectAll(".website")
						.attr("opacity",1)
				}

				// - - - 

				function handleMouseOver_website(){
					d3.selectAll(".website").select("rect")
						.attr("opacity",0.4)

					d3.selectAll(".strip_box")
						.attr("opacity",0.4)

					d3.select(this).select("rect")
						.transition()
						.duration(duration)
						.attr("opacity",1)

					d3.select(this).select("text")
						.transition()
						.duration(duration)
						.attr("opacity",1)
				}

				function handleMouseOut_website(){
					d3.selectAll(".website").select("rect")
						.attr("opacity",1)

					d3.selectAll(".strip_box")
						.attr("opacity",1)

					d3.select(this).select("text")
						.transition()
						.duration(duration)
						.attr("opacity",0)
				}

			function rescale_chart(){
				console.log("fire")

				timeScale = d3.scaleTime()
					.range([start_shift, width/2])

				svg
					.attr("width", width)

				// strip_rect.attr("x", (d,i) => {
				// 		const x_pos = timeScale(new Date(d.time))
				// 		return x_pos
				// 	})
				// 	.attr("width", (d) => {
				// 		const end_time = new Date(d.time).getTime() + d.duration*1000
				// 		const width = timeScale(end_time) - timeScale(new Date(d.time))
				// 		return width
				// 	})

				// const timeScale = d3.scaleTime()
				// 	.domain([new Date(data[0].time), new Date( new Date(data[data.length-1].time).getTime() + data[data.length-1].duration * 1000) ]) 
			}

			addEventListener("keypress", (event) => {
				let key = event.key
				if (key == "1") {
					rescale_chart()
				}
			});
		}
		display_data(data)

	}
}	


window.addEventListener('load', function () {	

	load_data();

})