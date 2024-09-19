// const dataset = "search_story_task_8_user_1004"
const dataset = "search_story_task_8_user_1005"
// const dataset = "search_story_task_8_user_1007"
// const dataset = "search_story_task_8_user_1010"
// const dataset = "search_story_task_8_user_1013"
// const dataset = "search_story_task_1_user_300"

const container = "#container";
const duration = 100;
const start_shift = 100;
const interline = 2;

const new_page_color = '#ff9100'
const duration_color = '#a4a4a4'

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
				.domain([new Date(data[0].time), new Date( new Date(data[data.length-1].time).getTime() + data[data.length-1].duration * 1000) ]) 
				.range([start_shift, width-20])
				// .nice()

			const strip_height = height/2.9
			const search_height = strip_height * 1
			const website_height = strip_height * 0.5
			const page_height = strip_height * 0.5

			let line_data = [
				[{ x: 0, y: 0 },{ x: width, y: 0 }],
				[{ x: 0, y: strip_height*1 },{ x: width, y: strip_height*1 }],
				[{ x: 0, y: strip_height*1.5 },{ x: width, y: strip_height*1.5 }],
				[{ x: 0, y: strip_height*2 },{ x: width, y: strip_height*2 }],
				[{ x: 0, y: strip_height*2.25 },{ x: width, y: strip_height*2.25 }]
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
				.on("click", handleClick)
				// .append("a")
				// .attr("xlink:href", (d) => {
				// 	return d.url
				// })
				// .attr("target","_blank")

			let strip_rect = strip_box.append("rect")
				.attr("data-action", (d) => d.action)
				.attr("data-domain", (d) => d.domain)
				.attr("x", (d,i) => {
					let x_pos = timeScale(new Date(d.time))
					return x_pos
				})
				.attr("y", (d,i) => {
					let y_pos = 0
					if (d.page_type == 'SEARCH_ENGINE') {
						y_pos = strip_height*0
					}
					else if (d.page_type == 'RESULT') {
						y_pos = strip_height * 1.5
					}
					else {
						y_pos = strip_height*2
					}
					return y_pos + interline
				})
				.attr("width", (d) => {
					const end_time = new Date(d.time).getTime() + d.duration*1000
					const width = timeScale(end_time) - timeScale(new Date(d.time))
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
				.attr("stroke","black")
				.attr("stroke-opacity", 0.2)
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
						color = '#85DAE9' 
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
					// .append("a")
					// .attr("xlink:href", (d) => {
					// 	return d[0].url
					// })
					// .attr("target","_blank")
					.on("mouseover", handleMouseOver_website) 
					.on("mouseout", handleMouseOut_website)

				let strip_website_rect = strip_website.append("rect")
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
							fill = '#fdc780'
						}
						return fill
					})
				
				let strip_text_box = strip_box.append("text")
					.attr("transform","translate(" + start_shift + "," + ((strip_height*3/1)-30) + ")")
					.attr("x", 0)
					.attr("y", 0)
					.attr("alignment-baseline","middle")
					.attr("opacity",0)

				let strip_website_textBox = strip_website.append("text")
					.attr("transform","translate(" + start_shift + "," + ((strip_height*3/1)-30) + ")")
					.attr("x", 0)
					.attr("y", 0)
					.attr("alignment-baseline","middle")
					.attr("opacity",0)

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

							the_url = "query on Google: " + url_c
						}
						else {
							the_url = url
						}
						return the_url
					})

				let info_b = strip_text_box.append("tspan")
					.text((d) => (
						convertSecondsToMinutes(d.duration)
						// Math.floor(d.duration/60 * 60)) + ' seconds / ' + convertSecondsToMinutes(d.duration) + ' minutes'
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
					.attr("id","x_axis")
					.attr("transform", "translate(0, " + (strip_height * 2.25 + interline) + ")")
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

				function handleClick(){
					d3.select(this).select("text")
						.transition()
						.duration(duration)
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

			function rescale_chart(mode){

				const max_time = 60 * 60

				if (mode == 1){
					timeScale = d3.scaleTime()
						.range([start_shift, max_time - 20])
						
					svg
						.attr("width", max_time + (margin.right + margin.right))
				}
				else if (mode == 2) {
					timeScale = d3.scaleTime()
						.range([start_shift, width-20])

					svg
						.attr("width", width + (margin.right + margin.right))
				}
				
				strip_rect.attr("x", (d,i) => {
					let x_pos = timeScale(new Date(d.time))
					return x_pos
				})
				.attr("width", (d) => {
					const end_time = new Date(d.time).getTime() + d.duration*1000
					const width = timeScale(end_time) - timeScale(new Date(d.time))
					return width
				})

				// d3.select("#x_axis")
				// 	.transition()
				// 	.call(xAxis)
				// 	.selectAll("text")
			}
			
			addEventListener("keypress", (event) => {
				// let key = event.key
				// if (key == "1") {
				// 	rescale_chart(1)
				// }
				// else if (key == "2"){
				// 	rescale_chart(2)
				// }
			});
		}
		display_data(data)

	}
}	

function load_statistics(data){
	console.log(data)

	const container_a = document.getElementById('statistics_a')
	const container_b = document.getElementById('statistics_b')
	const container_c = document.getElementById('statistics_c')

	const searchItems = data.filter(item => item.action === 'NEW_SEARCH' || item.action === 'NEW_SEARCH_SAME_ENGINE' || item.action === 'REFINE_SEARCH');
	const searchDuration = searchItems.reduce((sum, item) => sum + item.duration, 0);
	const avgSearchDuration = searchDuration / searchItems.length; 

	const pageItems = data.filter(item => item.action === 'NEW_RESULT' || item.action === 'SAME_DOMAIN_RESULT' || item.action == "SEEN_DOMAIN_RESULT");
	const pageDuration = pageItems.reduce((sum, item) => sum + item.duration, 0);
	const avgPageDuration = pageDuration / pageItems.length; 

	const newQueries = data.filter(item => item.action === 'NEW_SEARCH' || item.action === 'NEW_SEARCH_SAME_ENGINE').length
	const reusedQueries = data.filter(item => item.action === 'SAME_SEARCH' || item.action === 'SEEN_SEARCH').length
	const revisedQueries = data.filter(item => item.action === 'REFINE_SEARCH').length

	const newDomains = data.filter(item => item.action === 'NEW_RESULT').length
	const revisitedDomains = data.filter(item => item.action === 'SEEN_DOMAIN_RESULT').length
	const pages = data.filter(item => item.action === 'NEW_RESULT' || item.action === 'SAME_DOMAIN_RESULT' || item.action === 'SEEN_DOMAIN_RESULT').length

	const queries = searchItems.map(item => item.url)
		.filter(item => item.indexOf('http') >= 0)
	const unique_queries = getUniqueValues(queries) 

	const websites = pageItems.map(item => item.url)
	const unique_websites = getUniqueValues(websites) 

	const searchEngines = searchItems.map(item => {
		// url = item.url
		// console.log(url)

		item != '' //.split("?q=")[0]

		// if (url.indexOf("?q=") >= 0) {
		// 	item.url.split("?q=")[0]
		// 	console.log(item.url)
		// }
		// else {
		// 	item.url
		// }
	})
	console.log(searchEngines)
	const unique_searchEngines = getUniqueValues(searchEngines) 
	// console.log(searchEngines)

	let output_a = ''
	let output_b = ''
	let output_c = ''

	output_a += '<table>'
	output_a += '<tr><td><strong>Duration</strong></td></tr>'
	output_a += '<tr><td>Search (average)</td>'
	output_a += '<td>' + convertSecondsToMinutes(avgSearchDuration) + '</td></tr>' //  parseInt(avgSearchDuration) + ' seconds / ' + convertSecondsToMinutes(avgSearchDuration) + ' minutes</td></tr>'
	output_a += '<tr><td>Pages (average)</td>'
	output_a += '<td>' + convertSecondsToMinutes(avgPageDuration) + '</td></tr>' //'<td>' + parseInt(avgPageDuration) + ' seconds / ' + convertSecondsToMinutes(avgPageDuration) + ' minutes</td></tr>'
	output_a += '<tr><td>Search (total)</td>'
	output_a += '<td>' + convertSecondsToMinutes(searchDuration) + '</td></tr>' // '<td>' + parseInt(searchDuration) + ' seconds / ' + convertSecondsToMinutes(searchDuration) + ' minutes</td></tr>'
	output_a += '<tr><td>Pages (total)</td>'
	output_a += '<td>' + convertSecondsToMinutes(pageDuration) + '</td></tr>' // '<td>' + parseInt(pageDuration) + ' seconds / ' + convertSecondsToMinutes(pageDuration) + ' minutes</td></tr>'
	output_a += '<tr><td>Total</td>'
	output_a += '<td>' + convertSecondsToMinutes(pageDuration + searchDuration) + '</td></tr>' // '<td>' + parseInt(pageDuration + searchDuration) + ' seconds / ' + convertSecondsToMinutes(pageDuration + searchDuration) + ' minutes</td></tr>'
	output_a += '</table>'

	output_b += '<table>'
	output_b += '<tr><td><strong>Search</strong></td></tr>'
	output_b += '<tr><td>New queries</td>'
	output_b += '<td>' + newQueries + '</td></tr>'
	output_b += '<tr><td>Reused queries</td>'
	output_b += '<td>' + reusedQueries + '</td></tr>'
	output_b += '<tr><td>Reprised queries</td>'
	output_b += '<td>' + revisedQueries + '</td></tr>'
	output_b += '</table>'

	output_c += '<table>'
	output_c += '<tr><td><strong>Websites</strong></td></tr>'
	output_c += '<tr><td>New websites</td>'
	output_c += '<td>' + newDomains + '</td></tr>'
	output_c += '<tr><td>Revisited websites</td>'
	output_c += '<td>' + revisitedDomains + '</td></tr>'
	output_c += '<tr><td>Total pages visited</td>'
	output_c += '<td>' + pages + '</td></tr>'
	output_c += '</table>'

	output_b += '<table style="margin-top: 1.5rem;">'
	output_b += '<tr><td><strong>Queries</strong></td></tr>'
	unique_queries.forEach(item => {
		the_query = short_url(item,40)
		if (item.split('?q=')[1]){
			the_query_a = item.split('?q=')[1]
			the_query_b = the_query_a.split('=')[0]
			the_query_c = the_query_b.split('&')[0]
			the_query = the_query_c.replace(/\+/g,' ')
		}
		else if (item.split('?safe=')[1]){
			the_query_a = item.split('?safe=')[1]
			the_query_b = the_query_a.split('=')[0]
			the_query_c = the_query_b.split('&')[0]
			the_query = the_query_c.replace(/\+/g,' ')
		}
		output_b += '<tr><td><a href="' + item + '" target="_blank">' + the_query + '</a></td></tr>'
	})
	output_b += '</table>'


	// output_b += '<table style="margin-top: 1.5rem;">'
	// output_b += '<tr><td><strong>Search engines</strong></td></tr>'
	// output_b += '<tr>'
	// unique_searchEngines.forEach(item => {
	// 	// const engine_a = item.replace('https://www.','')
	// 	output_b += '<tr><td>' + item + '</td></tr>'
	// })
	// output_b += '</table>'


	output_c += '<table style="margin-top: 1.5rem;">'
	output_c += '<tr><td><strong>Websites</strong></td></tr>'
	unique_websites.forEach(item => {
		const web_a = item.replace('https://','')
		const web_b = web_a.replace('www.','')
		output_c += '<tr><td><a href="' + item + '" target="_blank">' + short_url(web_b,40) + '</a></td><tr>' // 
	})
	output_c += '</tr>'
	output_c += '</table>'

	container_a.innerHTML = output_a
	container_b.innerHTML = output_b
	container_c.innerHTML = output_c

}




window.addEventListener('load', function () {	

	load_data();

})