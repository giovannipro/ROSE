// const dataset = "search_story_task_8_user_1004"
// const dataset = "search_story_task_8_user_1005"
// const dataset = "search_story_task_8_user_1007"
 const dataset = "search_story_task_8_user_1010"
//const dataset = "search_story_task_8_user_1013"
// const dataset = "search_story_task_1_user_300"

const container = "#container";
const duration = 100;
const start_shift = 100;
const interline = 2;

const new_page_color = '#ff9100'
const duration_color = '#a4a4a4'
const stroke_color = '#aeaeae' 

const over_opacity = 0.4

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
		load_statistics(data)

		const website_strip_data = groupConsecutiveDomains(data);
		// console.log(website_strip_data)

		const values = dataset.match(/\d+/g)
		const task_name = values[0]
		const user_name = values[1]

		document.getElementById("task_name").innerHTML = task_name
		document.getElementById("user_name").innerHTML = user_name

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
				.domain([new Date(data[0].time), new Date(new Date(data[data.length-1].time).getTime() + data[data.length-1].duration * 1000) ]) 
				.range([start_shift, width-20])
				// .nice()

			const strip_height = height/2.9
			const search_height = strip_height * 1
			const website_height = strip_height * 0.5
			const page_height = strip_height * 0.5

			const linePositions = [
				strip_height * 0, 
				strip_height * 1, 
				strip_height * 1.5, 
				strip_height * 2, 
				strip_height * 2.25
			];

			let lines = plot.append("g")
				.attr("class","lines")

			let line = lines.selectAll("path")
				.data(linePositions)
				.enter()
				.append("line")
				.attr("x1", 0)  
				.attr("x2", width * 2)   
				.attr("y1", d => d)
				.attr("y2", d => d)
				.attr("stroke", "#d0d0d0")
				.attr("stroke-width", 1)
				.attr("fill", "none")
				.attr("class","rows")

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
				.on("click", handleClick_strip)

			let strip_rect = strip_box.append("rect")
				.attr("class","strip_rect")
				.attr("data-action", (d) => d.action)
				.attr("data-domain", (d) => d.domain)
				.attr("x", (d,i) => {
					x_pos = timeScale(new Date(d.time))
					return x_pos
				})
				.attr("y", (d,i) => {
					let y_pos = 0
					if (d.page_type == 'SEARCH_ENGINE') {
						y_pos = strip_height * 0
					}
					else if (d.page_type == 'RESULT') {
						y_pos = strip_height * 1.5
					}
					else {
						y_pos = strip_height * 2
					}
					return y_pos + interline
				})
				.attr("width", (d) => {
					// time = new Date(d.time).getTime()
					// time_ = new Date(d.time).getTime() + 60 * 60 * 1000
					// console.log(time + ' ' + time_) 
					end_time = new Date(d.time).getTime() + d.duration*1000
					width = timeScale(end_time) - timeScale(new Date(d.time))
					return width
				})
				.attr("height", (d) => {
					let height = (strip_height/4)  - (interline)
					if (d.page_type == 'SEARCH_ENGINE') {
						height = search_height - interline
					}
					else if (d.page_type == 'RESULT') {
						height = website_height - interline
					}

					return height - interline
				})
				.attr("stroke",stroke_color)
				.attr("fill", (d) => {
					let color = 'red'

					if (d.action == "TASK_STARTED" || d.action == "PRE_SURVEY_STARTED" || d.action == "PRE_SURVEY_ENDED" || d.action == 'POST_SURVEY_STARTED' || d.action == "NEW_TAB" || d.action == "SEARCH_STARTED" || d.action == "SEARCH_ENDED" || d.action == "SEARCH_RESUMED" || d.action == "POST_SURVEY_ENDED"){
						color = '#dbdbdb' // #afafaf #9aa4ac
					}

					// search
					else if (d.action == "NEW_SEARCH" || d.action == "NEW_SEARCH_SAME_ENGINE"){ // new
						color = '#619ED4' 
					}
					else if (d.action == "SAME_SEARCH" || d.action == "SEEN_SEARCH"){ // reused
						color = '#90b8df' // '#85DAE9'
					}
					else if (d.action == "REFINE_SEARCH"){ // revised
						color = '#C8DFF4' 
					}

					// results
					else if (d.action == "NEW_RESULT" || d.action == "SAME_DOMAIN_RESULT" || d.action == "SEEN_DOMAIN_RESULT"){
						color = new_page_color 
					}
					return color
				})

				// website strips
				// console.log(website_strip_data)
				let strip_website = strip_website_box.selectAll("g")
					.data(website_strip_data)
					.enter()
					.append("g")
					.attr("class","website")
					.on("mouseover", handleMouseOver_website) 
					.on("mouseout", handleMouseOut_website)
					.on("click", handleClick_website)

				let strip_website_rect = strip_website.append("rect")
					.attr("class","strip_website_rect")
					.attr("x", (d,i) => {
						let x_pos = timeScale(new Date(d[0].time))
						return x_pos
					})
					.attr("y", (d,i) => {
						let y_pos = strip_height*1
						return y_pos + interline
					})
					.attr("width", (d) => {
						const end_time = new Date(d[d.length-1].time).getTime() + d[d.length-1].duration*1000
						const width = timeScale(end_time) - timeScale(new Date(d[0].time))
						return width
					})
					.attr("height", (d) => {
						return website_height - (interline*2)
					})
					.attr("stroke","black")
					.attr("stroke-opacity", 0.2)
					.attr("fill", (d) => {
						let fill = new_page_color
						if (d[0].domain_status == "SEEN") {
							fill = '#f8b55c' //'#fdc780'
						}
						return fill
					})
				
				let strip_text_box = strip_box.append("a")
					.attr("xlink:href", (d) => {
						return d.url
					})
					.attr("target","_blank")
					.append("text")
					.attr("transform","translate(" + start_shift + "," + ((strip_height*3/1)-30) + ")")
					.attr("x", 0)
					.attr("y", 0)
					.attr("alignment-baseline","middle")
					.attr("visibility","hidden")

				let strip_website_textBox = strip_website.append("a")
					.attr("xlink:href", (d) => {
						return d[0].url
					})
					.attr("target","_blank")
					.append("text")
					.attr("transform","translate(" + start_shift + "," + ((strip_height*3/1)-30) + ")")
					.attr("x", 0)
					.attr("y", 0)
					.attr("alignment-baseline","middle")
					.attr("visibility","hidden")

				let strip_website_text_a = strip_website_textBox.append("tspan")
					.text((d) => {
						let output = d[0].domain
						if (d[0].domain_status == "SEEN") {
							output += " (already seen)"
						}
						return  output
					})
					
				let strip_website_text_b = strip_website_textBox.append("tspan")
					.text((d) => {
						const totalDuration = d.reduce((accumulator, currentObject) => {
    						return accumulator + currentObject.duration
						}, 0)
						return convertSecondsToMinutes(totalDuration) //Math.floor(totalDuration/60 * 60) + ' seconds / ' + convertSecondsToMinutes(totalDuration) + ' minutes'
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

							the_url = url_c //"query on Google: " + url_c
						}
						else {
							the_url = url
						}
						return the_url
					})

				let info_b = strip_text_box.append("tspan")
					.text((d) => (
						convertSecondsToMinutes(d.duration)
					))
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
					.attr("y", (strip_height*0.75))
					.attr("dy", strip_height/2)
					.attr("alignment-baseline","middle")
					.text("Websites");  

				let label_c = labels.append("text")
					.attr("x", 10)
					.attr("y", (strip_height*1.25))
					.attr("dy", strip_height/2)
					.attr("alignment-baseline","middle")
					.text("Pages");

				let label_d = labels.append("text")
					.attr("x", 10)
					.attr("y", (strip_height*1.625))
					.attr("dy", strip_height/2)
					.attr("alignment-baseline","middle")
					.text("Other");

				// x-axis
				let xAxis = d3.axisBottom(timeScale)
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
					.attr("id","x_axis")
					.attr("transform", "translate(0, " + (strip_height * 2.25 + interline) + ")")
					.call(xAxis)

				// handle Mouse Over
				function handleMouseOver(){

					d3.selectAll(".strip_box")
						.attr("opacity",over_opacity)

					d3.select(this)
						.attr("opacity",1)

					d3.selectAll(".website")
						.attr("opacity",over_opacity)
				}

				function handleMouseOut(){
					d3.selectAll(".strip_box")
						.attr("opacity",1)

					d3.selectAll(".website")
						.attr("opacity",1)
				}

				function handleClick_strip() {
					d3.selectAll(".strip_box").select("text")
						.attr("visibility","hidden")

					// d3.select(this).select("rect")
					// 	.attr("fill","url(#patt1)")

					d3.selectAll(".website").select("text")
						.attr("visibility","hidden")

					d3.select(this).select("text")
						.attr("visibility","visible")
				}

				function handleClick_website() {
					d3.selectAll(".website").select("text")
						.attr("visibility","hidden")

					d3.selectAll(".strip_box").select("text")
						.attr("visibility","hidden")

					d3.select(this).select("text")
						.attr("visibility","visible")
				}

				// - - - 

				function handleMouseOver_website(){
					// d3.select(this).select("text")
					// 	.transition()
					// 	.duration(duration)
					// 	.attr("opacity",1)

					d3.selectAll(".website").select("rect")
						.attr("opacity",over_opacity)

					d3.selectAll(".strip_box")
						.attr("opacity",over_opacity)

					d3.select(this).select("rect")
						.transition()
						.duration(duration)
						.attr("opacity",1)

				}

				function handleMouseOut_website(){
					// d3.select(this).select("text")
					// 	.transition()
					// 	.duration(duration)
					// 	.attr("opacity",0)

					d3.selectAll(".website").select("rect")
						.attr("opacity",1)

					d3.selectAll(".strip_box")
						.attr("opacity",1)

				}

			// switch between the fitting and the normalized scale
			function rescale(mode){ 

				window_w = document.getElementById("container").offsetWidth;
				width = window_w + (margin.right + margin.right)

				const date1 = new Date(data[0].time);
				const date2 = new Date(data[data.length-1].time)
				const delta = Math.abs(date2 - date1) / 1000 / 60; // in minutes

				const pixel_per_minute = 100

				new_width = delta * pixel_per_minute
				// console.log(delta, new_width)

				if (mode == "normalize"){ // the timeline has a constant unit size
					svg
						.attr("width", new_width + (margin.right + margin.right))
					
					timeScale = d3.scaleTime()
						.domain([new Date(data[0].time), new Date(new Date(data[data.length-1].time).getTime() + data[data.length-1].duration * 1000) ]) 
						.range([start_shift, new_width-20])
						
				}
				else if (mode == "fit") { // the timeline fits with the width length
					svg
						.attr("width", width + (margin.right + margin.right))
					
					timeScale = d3.scaleTime()
						.domain([new Date(data[0].time), new Date(new Date(data[data.length-1].time).getTime() + data[data.length-1].duration * 1000) ]) 
						.range([start_shift, width-20])
				}
				
				d3.selectAll(".strip_rect")
					.transition()
					.attr("x", (d,i) => {
						x_pos = timeScale(new Date(d.time))
						return x_pos
					})
					.attr("width", (d) => {
						end_time = new Date(d.time).getTime() + d.duration*1000
						width = timeScale(end_time) - timeScale(new Date(d.time))
						return width
					})

				d3.selectAll(".strip_website_rect")
					.transition()
					.attr("x", (d,i) => {
						let x_pos = timeScale(new Date(d[0].time))
						return x_pos
					})
					.attr("width", (d) => {
						const end_time = new Date(d[d.length-1].time).getTime() + d[d.length-1].duration*1000
						const width = timeScale(end_time) - timeScale(new Date(d[0].time))
						return width
					})

				xAxis = d3.axisBottom(timeScale)
					.ticks(d3.timeMinute.every(2)) 
					.tickFormat(d => {
						const hours = d.getHours();
						const minutes = d.getMinutes();
						const duration = hours * 60 + minutes;
						const start = new Date(data[0].time).getMinutes() + (new Date(data[0].time).getHours() * 60)

						return (duration-start+0) + "'"//+ ":00";
					})

				d3.select("#x_axis")
					.transition()
					.call(xAxis)

				d3.selectAll(".rows")
					.transition()
					.attr("x2",window_w * 2)
			}

			const set_size = document.getElementById('set_size')
			set_size.addEventListener("change", function() {
				let size = this.value;
				rescale(size)
			})

			addEventListener("keypress", (event) => {
				let key = event.key
				if (key == "1") {
					rescale("normalize")
				}
				else if (key == "2"){
					rescale("fit")
				}
			});

			function resize_chart(resize){

				svg
					.attr("width", window_w + (margin.right + margin.right))
					
				timeScale = d3.scaleTime()
					.domain([new Date(data[0].time), new Date(new Date(data[data.length-1].time).getTime() + data[data.length-1].duration * 1000) ]) 
					.range([start_shift, width-20])

				d3.selectAll(".strip_rect")
					.transition()
					.attr("x", (d,i) => {
						x_pos = timeScale(new Date(d.time))
						return x_pos
					})
					.attr("width", (d) => {
						end_time = new Date(d.time).getTime() + d.duration*1000
						width = timeScale(end_time) - timeScale(new Date(d.time))
						return width
					})

				d3.selectAll(".strip_website_rect")
					.transition()
					.attr("x", (d,i) => {
						let x_pos = timeScale(new Date(d[0].time))
						return x_pos
					})
					.attr("width", (d) => {
						const end_time = new Date(d[d.length-1].time).getTime() + d[d.length-1].duration*1000
						const width = timeScale(end_time) - timeScale(new Date(d[0].time))
						return width
					})

				xAxis = d3.axisBottom(timeScale)
					.ticks(d3.timeMinute.every(2)) 
					.tickFormat(d => {
						const hours = d.getHours();
						const minutes = d.getMinutes();
						const duration = hours * 60 + minutes;
						const start = new Date(data[0].time).getMinutes() + (new Date(data[0].time).getHours() * 60)

						return (duration-start+0) + "'"//+ ":00";
					})

				d3.select("#x_axis")
					.transition()
					.call(xAxis)

				d3.selectAll(".rows")
					.transition()
					.attr("x2",window_w * 2)
			}

			addEventListener("resize", (event) => {
				window_w = document.getElementById("container").offsetWidth;
				width = window_w + (margin.right + margin.right)

				resize_chart(1)
			})

		}
		display_data(data)

	}
}	

window.addEventListener('load', function () {	
	load_data();
})