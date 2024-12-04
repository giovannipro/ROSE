// const dataset = "search_story_task_1_user_300"

const duration = 100;
const start_shift = 10;
const interline = 2;

const new_page_color = '#ff9100'
const duration_color = '#a4a4a4'
const stroke_color = 'white' // '#aeaeae' 

const over_opacity = 0.4

function load_data(task,user) {
	// console.log(task, user)
	
	// load data
	d3.csv("assets/data/search_story_task_" + task + '_user_' + user + '.csv')
		.then(loaded)
		.then(
			feedback.innerHTML = ''
		)
		.catch(function(error){
			the_error = String(error)
			if (the_error.indexOf("404") !== -1) {
    			const feedback = document.getElementById("feedback")
    			feedback.innerHTML = "please select another timeline"
			}
		})

	function loaded(data) {
		// console.log(data)

		data.forEach(function(d) {
			d.duration = parseFloat(d.duration);  
		});
		load_statistics(data)

		const website_strip_data = groupConsecutiveDomains(data);

		function display_labels() {

			document.getElementById("label_box").innerHTML = ''

			const container = "#label_box";
			let window_w = document.getElementById("label_box").offsetWidth;
				window_h = document.getElementById("label_box").offsetHeight;

			let margin = {top: 10, left: 0, bottom: 20, right: 0},
				width = window_w - (margin.right + margin.right),
				height = window_h - (margin.top + margin.bottom);

			// const date1 = new Date(data[0].time);
			// const date2 = new Date(data[data.length-1].time)
			// const delta = Math.abs(date2 - date1) / 1000 / 60; // in minutes
			// const pixel_per_minute = 100
			// new_width = delta * pixel_per_minute
			// console.log(data, new_width)

			let svg = d3.select(container)
				.append("svg")
				.attr("width", width)
				.attr("height",height + (margin.top + margin.bottom))
				.attr("id", "svg_labels")

			const strip_height = height/2.5

			const linePositions = [
				strip_height * 0, 
				strip_height * 1, 
				strip_height * 1.2, 
				strip_height * 2.2, 
				strip_height * 2.35
			];

			let plot = svg.append('g')
				.attr("id", "plot")
				.attr("transform", "translate(" + margin.right + "," + margin.top + ")");

			let lines = plot.append("g")
				.attr("class","lines")

			let line = lines.selectAll("path")
				.data(linePositions)
				.enter()
				.append("line")
				.attr("x1", 0)  
				.attr("x2", width)   
				.attr("y1", d => d)
				.attr("y2", d => d)
				.attr("stroke", "#d0d0d0")
				.attr("stroke-width", 1)
				.attr("fill", "none")
				.attr("class","rows")

			// strip labels
			let labels = plot.append("g")
				.attr("class","labels")

			let label_a = labels.append("text")
				.attr("x", 10)
				.attr("y", linePositions[0])
				.attr("dy", strip_height/2)
				.attr("alignment-baseline","middle")
				.text("Search");

			let label_b = labels.append("text")
				.attr("x", 10)
				.attr("y", (strip_height*1.1))
				.attr("dy",0)
				.attr("alignment-baseline","middle")
				.text("Domains");  

			let label_c = labels.append("text")
				.attr("x", 10)
				.attr("y", (strip_height*2.2))
				.attr("dy", -70)
				.attr("alignment-baseline","middle")
				.text("Pages");

			let label_d = labels.append("text")
				.attr("x", 10)
				.attr("y", (strip_height*2.3))
				.attr("dy", -2)
				.attr("alignment-baseline","middle")
				.text("System");
		}
		display_labels()

		function display_data(data){
			// console.log(data)

			document.getElementById("plot_box").innerHTML = ''

			const set_size = document.getElementById('set_size')
			set_size.value = 'normalize'

			const date1 = new Date(data[0].time);
			const date2 = new Date(data[data.length-1].time)
			const delta = Math.abs(date2 - date1) / 1000 / 60; // in minutes
			const pixel_per_minute = 100
			new_width = delta * pixel_per_minute

			const container = "#plot_box";
			let window_w = document.getElementById("plot_box").offsetWidth;
			window_h = document.getElementById("plot_box").offsetHeight;
			
			let margin = {top: 10, left: 0, bottom: 20, right: 0},
			width = window_w - (margin.right + margin.right),
			height = window_h - (margin.top + margin.bottom);
			
			if (new_width < window_w){
				new_width = window_w
			}

			let svg = d3.select(container)
				.append("svg")
				.attr("width", new_width + (margin.right + margin.right))
				.attr("height",height + (margin.top + margin.bottom))
				.attr("id", "svg_main")

			let plot = svg.append("g")
				.attr("id", "plot_main")
				.attr("transform", "translate(" + margin.right + "," + margin.top + ")");

			// scale time
			const total_duration = data.reduce((sum, item) => sum + item.duration, 0);

			let timeScale = d3.scaleTime()
				.domain([new Date(data[0].time), new Date(new Date(data[data.length-1].time).getTime() + data[data.length-1].duration * 1000) ]) 
				.range([start_shift, new_width-20])
				// .domain([new Date(data[0].time), new Date(new Date(data[data.length-1].time).getTime() + data[data.length-1].duration * 1000) ]) 
				// .nice()

			const strip_height = height/2.5
			const search_height = strip_height * 1
			const website_height = strip_height * 0.2
			const page_height = strip_height * 1
			const other_height = strip_height * 0.15

			const linePositions = [
				strip_height * 0, 
				strip_height * 1, 
				strip_height * 1.2, 
				strip_height * 2.2, 
				strip_height * 2.35
			];

			let lines = plot.append("g")
				.attr("class","lines")

			let line = lines.selectAll("path")
				.data(linePositions)
				.enter()
				.append("line")
				.attr("x1", 0)  
				.attr("x2", new_width * 1.2)   
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
				.attr("data-url", (d) => d.url)
				.attr("data-domain", (d) => d.domain)
				.attr("data-duration", (d) => d.duration)
				.attr("data-action", (d) => d.action)
				.attr("data-domainStatus", (d) => d.domain_status)
				.on("mouseover", handleMouseOver) 
				.on("mouseout", handleMouseOut)
				.on("click", handleClick)

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
						y_pos = strip_height * 1.2
					}
					else {
						y_pos = strip_height * 2.2
					}
					return y_pos + interline
				})
				.attr("width", (d) => {
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
						height = page_height - interline
					}
					else {
						height = other_height - interline
					}
					return height - interline
				})
				.attr("stroke",stroke_color)
				.attr("fill", (d) => {
					let color = '#dbdbdb'

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
					else if (d.action == "NEW_RESULT" || d.action == "SAME_DOMAIN_RESULT" || d.action == "SEEN_DOMAIN_RESULT"){
						color = new_page_color 
					}
					return color
				})

				// website strips
				let strip_website = strip_website_box.selectAll("g")
					.data(website_strip_data)
					.enter()
					.append("g")
					.attr("class","website")
					.attr("data-url", (d) => d[0].url)
					.attr("data-domain", (d) => d[0].domain)
					.attr("data-duration", (d) => d[0].duration)
					.attr("data-action", (d) => d[0].action)
					.attr("data-domainStatus", (d) => d[0].domain_status)
					.on("mouseover", handleMouseOver_website) 
					.on("mouseout", handleMouseOut_website)
					.on("click", handleClick)

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
					.attr("stroke",stroke_color)
					.attr("fill", (d) => {
						let fill = new_page_color
						if (d[0].domain_status == "SEEN") {
							fill = '#f8b55c' //'#fdc780'
						}
						return fill
					})

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
					.attr("transform", "translate(0, " + (strip_height * 2.35 + interline) + ")")
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

				const infobox = document.getElementById('infobox')
				function handleClick() {

					d3.selectAll('.strip_rect')
						.attr("stroke",stroke_color)
						.attr("stroke-width",1)

					d3.selectAll('.strip_website_rect')
						.attr("stroke",stroke_color)
						.attr("stroke-width",1)

					d3.select(this).select("rect")
						.attr("stroke","red")
						.attr("stroke-width",2)
						.attr("vector-effect","non-scaling-stroke")

					const url = this.getAttribute('data-url')
					const domain = this.getAttribute('data-domain')
					const duration = this.getAttribute('data-duration')
					const action = this.getAttribute('data-action')
					const domainStatus = this.getAttribute('data-domainStatus')
					// console.log(domain)

					let output = ''	
					if (action == 'SAME_DOMAIN_RESULT' || action == 'SEEN_DOMAIN_RESULT' || action == 'NEW_RESULT'){
						// console.log(this.getAttribute("class"))

						if (this.getAttribute("class") == 'website'){
							output += '<span><a href="https://' + domain + '" target="_blank">' + domain + '</a><br/>'
						}
						else {
							if (domainStatus == "SEEN") {
								output += '<span><a href="' + url + '" target="_blank">' + url + '</a> <span style="color: gray">(already seen)</span></span><br/>'
							}
							else {
								output += '<span><a href="' + url + '" target="_blank">' + url + '</a></span><br/>'
							}
						}
					}
					else if (action == 'NEW_SEARCH' || action == 'NEW_SEARCH_SAME_ENGINE' || action == 'SAME_SEARCH' || action == 'REFINE_SEARCH' || action == 'SEEN_SEARCH') {
						let the_domain = decodeURIComponent(url)

						// url_a = the_domain.split("?")[1]
						url_b = the_domain.split("q=")[1]
						
						index_start = url_b.indexOf("q=") + 1
						index_end = url_b.length

						if (url_b.indexOf("&") != -1){
							index_end = url_b.indexOf("&")
						}
						// console.log(index_end)

						url_c = url_b.substring(index_start,index_end)
						// console.log(url_b.length, index_start,index_end, url_c)

						url_d = url_c.replace(/\+/g," ")
						// console.log(url_b)
						
						the_domain = url_d

						seen = ''
						if (action == "SAME_SEARCH" || action == "SEEN_SEARCH"){ // reused
							seen = '(reused query)'
						}
						if (action == "REFINE_SEARCH"){ 
							seen = '(modified query)'
						}
						output += '<span><a href="' + url + '" target="_blank">' + the_domain +  '</a> ' + '<span style="color: gray">' + seen + '</span><br/>'
					}
					else if (action == 'UNKNOWN'){
						output += '<span>query unknown</span><br/>'
					}
					else {
						// console.log(action)
						let system_status = domain.toLowerCase().replace(/\_/g," ")

						output += '<span>' + 'System (' + system_status + ')' + '</span><br/>'
					}

					if (this.getAttribute("class") !== 'website'){
						output += '<span style="color: gray;">' + convertSecondsToMinutes(duration) + '<span>'
					}

					infobox.innerHTML = output
				}

				document.getElementById("")

				// - - - 

				function handleMouseOver_website(){
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
					d3.selectAll(".website").select("rect")
						.attr("opacity",1)

					d3.selectAll(".strip_box")
						.attr("opacity",1)
				}

			// switch between the fitting and the normalized scale
			function rescale(mode){ 

				window_w = document.getElementById("plot_box").offsetWidth;
				width = window_w + (margin.right + margin.right);

				const date1 = new Date(data[0].time);
				const date2 = new Date(data[data.length-1].time)
				const delta = Math.abs(date2 - date1) / 1000 / 60; // in minutes
				const pixel_per_minute = 100
				new_width = delta * pixel_per_minute

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
					.attr("x2",new_width)

				infobox.innerHTML = ''
			}

			set_size.addEventListener("change", function() {
				let size = this.value;
				rescale(size)
			})

			function resize_chart(mode){

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
					.attr("x2", new_width)
			}

			addEventListener("resize", (event) => {

				window_w = document.getElementById("plot_box").offsetWidth;
				width = window_w + (margin.right + margin.right);

				const date1 = new Date(data[0].time);
				const date2 = new Date(data[data.length-1].time)
				const delta = Math.abs(date2 - date1) / 1000 / 60; // in minutes

				const pixel_per_minute = 100

				new_width = delta * pixel_per_minute

				const set_size = document.getElementById('set_size')
				let size = set_size.value;
				// console.log(set_size)

				resize_chart(size)
			})

		}
		display_data(data)
	}
}	

const set_story = document.getElementById('set_story')

set_story.addEventListener("click", function() {

	const set_task = document.getElementById('set_task').value
	const set_user = document.getElementById('set_user').value
	console.log(set_task,set_user)

	infobox.innerHTML = ''
	load_data(set_task,set_user)
})

window.addEventListener('load', function () {	
	// load_data(7,826);
	// load_data(1,1324);
	// load_data(8,1005);
	load_data(1,300);
})