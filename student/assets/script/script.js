const duration = 100;
const start_shift = 10;
const interline = 2;

const new_page_color = '#ff9100';
const duration_color = '#a4a4a4';
const stroke_color = 'white'; // '#aeaeae'

const over_opacity = 0.4;

let scale_mode = 'normalize';

function load_data() {

	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	const user_id = 5 // urlParams.get('user_id');
    const task_id = 1 // urlParams.get('task_id');

	const apiEndpoint_student = `assets/data/_stats_${user_id}_${task_id}.csv` 
	// const apiEndpoint_student = `/api/analytics/stories-extraction?user_id=${user_id}&task_id=${task_id}`;
	
	// http://127.0.0.1:5501/student/index.html?user_id=7&task_id=2
	console.log(user_id,task_id)

	// load story data
	d3.csv(apiEndpoint_student)
		.then(loaded)
		.catch(function (error) {
			if (error.message.includes("404")) {
				console.log("Something went wrong with the data loading");
			}
			else {
				console.error("Data loading error:", error);
			}
		});

	function loaded(data) {
		console.log(data)

		data.forEach(function (d, i) {
			d.duration = parseFloat(d.duration);
			d.id = i;
		});

		try {
			load_statistics(data);
		}
		catch (error) {
			console.log('We got some error with the statistics')
			console.log(error);
		}

		try {
			load_hints();
		}
		catch (error) {
			console.log('We got some error with the hints')
			console.log(error);
		}

		const website_strip_data = groupConsecutiveDomains(data);

		website_strip_data.forEach((item, i) => {
			item[0].the_id = i;
		});
		// console.log(data);

		function display_labels() {
			// console.log(data);

			document.getElementById("label_box").innerHTML = '';

			document.getElementById("the_user").innerHTML = data[0].user_id;
			document.getElementById("the_task").innerHTML = data[0].task_id;

			const container = "#label_box";
			let window_w = document.getElementById("label_box").offsetWidth;
			window_h = document.getElementById("label_box").offsetHeight;

			let margin = { top: 10, left: 0, bottom: 20, right: 0 },
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
				.attr("height", height + (margin.top + margin.bottom))
				.attr("id", "svg_labels");

			const strip_height = height / 2.5;

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
				.attr("class", "lines");

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
				.attr("class", "rows");

			// strip labels
			let labels = plot.append("g")
				.attr("class", "labels");

			let label_a = labels.append("text")
				.attr("x", 10)
				.attr("y", linePositions[0])
				.attr("dy", strip_height / 2)
				.attr("alignment-baseline", "middle")
				.text("Search");

			let label_b = labels.append("text")
				.attr("x", 10)
				.attr("y", (strip_height * 1.1))
				.attr("dy", 0)
				.attr("alignment-baseline", "middle")
				.text("Domains");

			let label_c = labels.append("text")
				.attr("x", 10)
				.attr("y", (strip_height * 2.2))
				.attr("dy", -70)
				.attr("alignment-baseline", "middle")
				.text("Pages");

			let label_d = labels.append("text")
				.attr("x", 10)
				.attr("y", (strip_height * 2.3))
				.attr("dy", -2)
				.attr("alignment-baseline", "middle")
				.text("System");
		}
		display_labels();

		function display_data(data) {
			// console.log(data)

			document.getElementById("plot_box").innerHTML = '';

			const date1 = new Date(data[0].time);
			const date2 = new Date(data[data.length - 1].time);
			const delta = Math.abs(date2 - date1) / 1000 / 60; // in minutes
			const pixel_per_minute = 100;
			new_width = delta * pixel_per_minute;

			const container = "#plot_box";
			let window_w = document.getElementById("plot_box").offsetWidth;
			window_h = document.getElementById("plot_box").offsetHeight;

			let margin = { top: 10, left: 0, bottom: 20, right: 0 },
				width = window_w - (margin.right + margin.right),
				height = window_h - (margin.top + margin.bottom);

			if (new_width < window_w) {
				the_scale = window_w;
			}
			else {
				the_scale = new_width;
			}

			let svg = d3.select(container)
				.append("svg")
				.attr("width", the_scale + (margin.right + margin.right))
				.attr("height", height + (margin.top + margin.bottom))
				.attr("id", "svg_main");

			let plot = svg.append("g")
				.attr("id", "plot_main")
				.attr("transform", "translate(" + margin.right + "," + margin.top + ")");

			// scale time
			const total_duration = data.reduce((sum, item) => sum + item.duration, 0);

			let timeScale = d3.scaleTime()
				.domain([new Date(data[0].time), new Date(new Date(data[data.length - 1].time).getTime() + data[data.length - 1].duration * 1000)])
				.range([start_shift, new_width - 20]);
			// .domain([new Date(data[0].time), new Date(new Date(data[data.length-1].time).getTime() + data[data.length-1].duration * 1000) ])
			// .nice()

			const strip_height = height / 2.5;
			const search_height = strip_height * 1;
			const website_height = strip_height * 0.2;
			const page_height = strip_height * 1;
			const other_height = strip_height * 0.15;

			const linePositions = [
				strip_height * 0,
				strip_height * 1,
				strip_height * 1.2,
				strip_height * 2.2,
				strip_height * 2.35
			];

			let lines = plot.append("g")
				.attr("class", "lines");

			let line = lines.selectAll("path")
				.data(linePositions)
				.enter()
				.append("line")
				.attr("x1", 0)
				.attr("x2", the_scale * 2)
				.attr("y1", d => d)
				.attr("y2", d => d)
				.attr("stroke", "#d0d0d0")
				.attr("stroke-width", 1)
				.attr("fill", "none")
				.attr("class", "rows");

			let strips = plot.append("g")
				.attr("class", "strips");

			let strip_website_box = plot.append("g")
				.attr("class", "strip_website");

			let strip_box = strips.selectAll("g")
				.data(data)
				.enter()
				.append("g")
				.attr("class", "strip strip_box")
				.attr("data-url", (d) => d.url)
				.attr("data-domain", (d) => d.domain)
				.attr("data-duration", (d) => d.duration)
				.attr("data-action", (d) => d.action)
				.attr("data-type", (d) => d.page_type)
				.attr("data-domainStatus", (d) => d.domain_status)
				.attr("data-index", (d, i) => i)
				.attr("data-class", (d,i) => {
					let the_class = ""
					if (d.page_type == "SYSTEM" || d.page_type == "NEW_TAB"){
						the_class = "system"
					}
					else {
						the_class = "strip"
					}
					return the_class
				})
				.on("mouseover", handleMouseOver)
				.on("mouseout", handleMouseOut)
				.on("click", (event, d) => {
					handleClick(d.id);
				});

			let strip_rect = strip_box.append("rect")
				.attr("class", "strip_rect")
				.attr("data-action", (d) => d.action)
				.attr("data-domain", (d) => d.domain)
				.attr("x", (d, i) => {
					x_pos = timeScale(new Date(d.time));
					return x_pos;
				})
				.attr("y", (d, i) => {
					let y_pos = 0;
					if (d.page_type == 'SEARCH_ENGINE') {
						if(d.action == 'UNKNOWN'){
							y_pos = strip_height * 2.2;
						}
						else {
							y_pos = strip_height * 0;
						}
					}
					else if (d.page_type == 'RESULT') {
						y_pos = strip_height * 1.2;
					}
					else {
						y_pos = strip_height * 2.2;
					}
					return y_pos + interline;
				})
				.attr("width", (d) => {
					end_time = new Date(d.time).getTime() + d.duration * 1000;
					width = timeScale(end_time) - timeScale(new Date(d.time));
					return width;
				})
				.attr("height", (d) => {
					let height = (strip_height / 4) - (interline);
					if (d.page_type == 'SEARCH_ENGINE') {
						if(d.action == 'UNKNOWN'){
							height = other_height - interline
						}
						else {
							height = search_height - interline;
						}
					}
					else if (d.page_type == 'RESULT') {
						height = page_height - interline;
					}
					else {
						height = other_height - interline;
					}
					return height - interline;
				})
				.attr("stroke", stroke_color)
				.attr("fill", (d) => {
					let color = '#dbdbdb';

					if (d.action == "TASK_STARTED" || d.action == "PRE_SURVEY_STARTED" || d.action == "PRE_SURVEY_ENDED" || d.action == 'POST_SURVEY_STARTED' || d.action == "NEW_TAB" || d.action == "SEARCH_STARTED" || d.action == "SEARCH_ENDED" || d.action == "SEARCH_RESUMED" || d.action == "POST_SURVEY_ENDED") {
						color = '#dbdbdb'; // #afafaf #9aa4ac
					}

					// search
					else if (d.action == "NEW_SEARCH" || d.action == "NEW_SEARCH_SAME_ENGINE") { // new
						color = '#619ED4';
					}
					else if (d.action == "SAME_SEARCH" || d.action == "SEEN_SEARCH") { // reused
						color = '#90b8df'; // '#85DAE9'
					}
					else if (d.action == "REFINE_SEARCH") { // revised
						color = '#C8DFF4';
					}

					// pages
					else if (d.action == "NEW_RESULT" || d.action == "SAME_DOMAIN_RESULT" || d.action == "SEEN_DOMAIN_RESULT") {
						color = new_page_color;
					}
					return color;
				});

			// website strips
			let strip_website = strip_website_box.selectAll("g")
				.data(website_strip_data)
				.enter()
				.append("g")
				.attr("class", "website")
				.attr("data-url", (d) => d[0].url)
				.attr("data-domain", (d) => d[0].domain)
				.attr("data-duration", (d) => d[0].duration)
				.attr("data-action", (d) => d[0].action)
				.attr("data-class", "website")
				.attr("data-index", (d, i) => "w_" + i)
				.attr("data-domainStatus", (d) => d[0].domain_status)
				.on("mouseover", handleMouseOver_website)
				.on("mouseout", handleMouseOut_website)
				.on("click", (event, d) => {
					handleClick("w_" + d[0].the_id);
				});

			let strip_website_rect = strip_website.append("rect")
				.attr("class", "strip_website_rect")
				.attr("x", (d, i) => {
					let x_pos = timeScale(new Date(d[0].time));
					// console.log(d[0].time)
					return x_pos;
				})
				.attr("y", (d, i) => {
					let y_pos = strip_height * 1;
					return y_pos + interline;
				})
				.attr("width", (d) => {
					const end_time = new Date(d[d.length - 1].time).getTime() + d[d.length - 1].duration * 1000;
					const width = timeScale(end_time) - timeScale(new Date(d[0].time));
					return width;
				})
				.attr("height", (d) => {
					return website_height - (interline * 2);
				})
				.attr("stroke", stroke_color)
				.attr("fill", (d) => {
					let fill = new_page_color;
					if (d[0].domain_status == "SEEN") {
						fill = '#f8b55c';
					}
					return fill;
				});

			// x-axis
			let xAxis = d3.axisBottom(timeScale)
				.ticks(d3.timeMinute.every(2))
				.tickFormat(d => {
					const hours = d.getHours();
					const minutes = d.getMinutes();
					const duration = hours * 60 + minutes;
					const start = new Date(data[0].time).getMinutes() + (new Date(data[0].time).getHours() * 60);

					return (duration - start + 0) + "'";//+ ":00";
				});

			const xAxis_box = plot.append("g")
				.attr("class", "x_axis")
				.attr("id", "x_axis")
				.attr("transform", "translate(0, " + (strip_height * 2.35 + interline) + ")")
				.call(xAxis);

			// handle Mouse Over
			function handleMouseOver() {

				d3.selectAll(".strip_box")
					.attr("opacity", over_opacity);

				d3.select(this)
					.attr("opacity", 1);

				d3.selectAll(".website")
					.attr("opacity", over_opacity);
			}

			function handleMouseOut() {
				d3.selectAll(".strip_box")
					.attr("opacity", 1);

				d3.selectAll(".website")
					.attr("opacity", 1);
			}

			let selectedIndex = -1;
			let previous_id = 0;

			const infobox = document.getElementById('infobox');
			function handleClick(id) {
				// console.log(id, previous_id);

				selectedIndex = id;

				if (id > -1) {
					previous_id = selectedIndex;

					if (selectedIndex > data.lenght - 1) {
						selectedIndex = -1;
					}
				}
				else {
					selectedIndex = previous_id;
				}

				d3.selectAll('.strip_rect')
					.attr("stroke", stroke_color)
					.attr("stroke-width", 1);

				d3.selectAll('.strip_website_rect')
					.attr("stroke", stroke_color)
					.attr("stroke-width", 1);

				const item = d3.select('[data-index="' + id + '"]');

				item.select("rect")
					.attr("stroke", "red")
					.attr("stroke-width", 2)
					.attr("vector-effect", "non-scaling-stroke");
					
				const domain = document.querySelector('[data-index="' + id + '"]');
				const class_ = (domain.getAttribute("data-class")).toString();

				const url = domain.getAttribute("data-url")
				const duration = domain.getAttribute("data-duration")
				const action = domain.getAttribute("data-action")
				const domainStatus = domain.getAttribute("data-domainStatus")
					
				let output;

				if (class_ == 'strip'){

					if (action == 'SAME_DOMAIN_RESULT' || action == 'SEEN_DOMAIN_RESULT' || action == 'NEW_RESULT') {
						the_url = short_text(url,140)
						// console.log(the_url)

						if (domainStatus == "SEEN") {
							output = `<span><a href="${url}" target="_blank">${the_url}</a><span style="color: gray"> (already seen)</span></span><br/>`;
						}
						else {
							output = `<span><a href="${url}" target="_blank">${the_url}</a></span><br/>`;
						}

						output += `<span style="color: gray;">${convertSecondsToMinutes(duration)}<span>`;
					}
					else if (action == 'NEW_SEARCH' || action == 'NEW_SEARCH_SAME_ENGINE' || action == 'SAME_SEARCH' || action == 'REFINE_SEARCH' || action == 'SEEN_SEARCH') {
						let the_domain = decodeURIComponent(url);
						the_domain = clean_query(the_domain)

						let seen = '';
						if (action == "SAME_SEARCH" || action == "SEEN_SEARCH") { // reused
							seen = '(reused query)';
						}
						if (action == "REFINE_SEARCH") {
							seen = '(modified query)';
						}
						
						output = `<span><a href="${url}" target="_blank">${the_domain}</a> <span style="color: gray">${seen}</span><br/>`;
						output += `<span style="color: gray;">${convertSecondsToMinutes(duration)}<span>`;
					}
				}
				else if (class_ == 'website'){
					const domain_ = domain.getAttribute("data-domain")
					const action = domain.getAttribute("data-action")
					const url = domain.getAttribute("data-url")
					const the_url = clean_domain(url)

					let seen = '';
					if (action == "SEEN_DOMAIN_RESULT") { // reused
						seen = '(already seen)';
					}
					output = `<span><a href="${the_url}" target="_blank">${domain_}</a> </span><span style="color: gray">${seen}</span><br/>`;
					output += `<span style="color: gray;">${convertSecondsToMinutes(duration)}<span>`;
				}
				else {
					// console.log(domain)
					const domain_ = domain.getAttribute("data-domain")
					const the_domain = domain_.toLowerCase().replace(/\_/g, " ");
					output = `<span>System (${the_domain})</span><br/>`;
					output += '<span style="color: gray;">' + convertSecondsToMinutes(duration) + '<span>';
				}

				infobox.innerHTML = output;
			}

			document.addEventListener("keydown", (event) => {
				// console.log(selectedIndex)

				if (event.key === "ArrowRight") {
					selectedIndex = (selectedIndex + 1) % data.length; // Move to the next strip
				} else if (event.key === "ArrowLeft") {
					selectedIndex = (selectedIndex - 1 + data.length) % data.length; // Move to the previous strip
				}
				// arrow_highlights()
				handleClick(selectedIndex);
			});

			// - - -

			function handleMouseOver_website() {
				d3.selectAll(".website").select("rect")
					.attr("opacity", over_opacity);

				d3.selectAll(".strip_box")
					.attr("opacity", over_opacity);

				d3.select(this).select("rect")
					.transition()
					.duration(duration)
					.attr("opacity", 1);
			}

			function handleMouseOut_website() {
				d3.selectAll(".website").select("rect")
					.attr("opacity", 1);

				d3.selectAll(".strip_box")
					.attr("opacity", 1);
			}


			// switch between the fitting and the normalized scale
			function rescale(mode) {

				window_w = document.getElementById("plot_box").offsetWidth;
				width = window_w + (margin.right + margin.right);

				const date1 = new Date(data[0].time);
				const date2 = new Date(data[data.length - 1].time);
				const delta = Math.abs(date2 - date1) / 1000 / 60; // in minutes
				const pixel_per_minute = 100;
				new_width = delta * pixel_per_minute;
				// console.log(new_width, window_w)

				if (new_width < window_w) {
					the_scale = window_w;
				}
				else {
					the_scale = new_width;
				}

				if (mode == "normalize") { // the timeline has a constant unit size
					svg
						.attr("width", the_scale + (margin.right + margin.right));

					timeScale = d3.scaleTime()
						.domain([new Date(data[0].time), new Date(new Date(data[data.length - 1].time).getTime() + data[data.length - 1].duration * 1000)])
						.range([start_shift, new_width - 20]);

				}
				else if (mode == "fit") { // the timeline fits with the width length
					svg
						.attr("width", width + (margin.right + margin.right));

					timeScale = d3.scaleTime()
						.domain([new Date(data[0].time), new Date(new Date(data[data.length - 1].time).getTime() + data[data.length - 1].duration * 1000)])
						.range([start_shift, width - 20]);
				}

				d3.selectAll(".strip_rect")
					.transition()
					.attr("x", (d, i) => {
						x_pos = timeScale(new Date(d.time));
						return x_pos;
					})
					.attr("width", (d) => {
						end_time = new Date(d.time).getTime() + d.duration * 1000;
						width = timeScale(end_time) - timeScale(new Date(d.time));
						return width;
					});

				d3.selectAll(".strip_website_rect")
					.transition()
					.attr("x", (d, i) => {
						let x_pos = timeScale(new Date(d[0].time));
						return x_pos;
					})
					.attr("width", (d) => {
						const end_time = new Date(d[d.length - 1].time).getTime() + d[d.length - 1].duration * 1000;
						const width = timeScale(end_time) - timeScale(new Date(d[0].time));
						return width;
					});

				xAxis = d3.axisBottom(timeScale)
					.ticks(d3.timeMinute.every(2))
					.tickFormat(d => {
						const hours = d.getHours();
						const minutes = d.getMinutes();
						const duration = hours * 60 + minutes;
						const start = new Date(data[0].time).getMinutes() + (new Date(data[0].time).getHours() * 60);

						return (duration - start + 0) + "'";//+ ":00";
					});

				d3.select("#x_axis")
					.transition()
					.call(xAxis);

				d3.selectAll(".rows")
					.transition()
					.attr("x2", the_scale);

				infobox.innerHTML = '';
			}

			const set_normalize = document.getElementById('normalize_size');
			const set_fit = document.getElementById('fit_size');

			set_normalize.addEventListener("click", function () {
				rescale("normalize");
				scale_mode = "normalize"

				set_normalize.classList.add("not_active");
				set_fit.classList.remove("not_active");
			});

			set_fit.addEventListener("click", function () {
				rescale("fit");
				scale_mode = "fit"

				set_fit.classList.add("not_active");
				set_normalize.classList.remove("not_active");
			});

			function resize_chart(mode) {

				if (new_width < window_w) {
					the_scale = window_w;
				}
				else {
					the_scale = new_width;
				}

				if (mode == "normalize") { // the timeline has a constant unit size
					svg
						.attr("width", the_scale + (margin.right + margin.right));

					timeScale = d3.scaleTime()
						.domain([new Date(data[0].time), new Date(new Date(data[data.length - 1].time).getTime() + data[data.length - 1].duration * 1000)])
						.range([start_shift, new_width - 20]);
				}
				else if (mode == "fit") { // the timeline fits with the width length
					svg
						.attr("width", width + (margin.right + margin.right));

					timeScale = d3.scaleTime()
						.domain([new Date(data[0].time), new Date(new Date(data[data.length - 1].time).getTime() + data[data.length - 1].duration * 1000)])
						.range([start_shift, width - 20]);
				}

				d3.selectAll(".strip_rect")
					.transition()
					.attr("x", (d, i) => {
						x_pos = timeScale(new Date(d.time));
						return x_pos;
					})
					.attr("width", (d) => {
						end_time = new Date(d.time).getTime() + d.duration * 1000;
						width = timeScale(end_time) - timeScale(new Date(d.time));
						return width;
					});

				d3.selectAll(".strip_website_rect")
					.transition()
					.attr("x", (d, i) => {
						let x_pos = timeScale(new Date(d[0].time));
						return x_pos;
					})
					.attr("width", (d) => {
						const end_time = new Date(d[d.length - 1].time).getTime() + d[d.length - 1].duration * 1000;
						const width = timeScale(end_time) - timeScale(new Date(d[0].time));
						return width;
					});

				xAxis = d3.axisBottom(timeScale)
					.ticks(d3.timeMinute.every(2))
					.tickFormat(d => {
						const hours = d.getHours();
						const minutes = d.getMinutes();
						const duration = hours * 60 + minutes;
						const start = new Date(data[0].time).getMinutes() + (new Date(data[0].time).getHours() * 60);

						return (duration - start + 0) + "'";//+ ":00";
					});

				d3.select("#x_axis")
					.transition()
					.call(xAxis);

				d3.selectAll(".rows")
					.transition()
					.attr("x2", the_scale);
			}

			addEventListener("resize", (event) => {

				window_w = document.getElementById("plot_box").offsetWidth;
				width = window_w + (margin.right + margin.right);

				const date1 = new Date(data[0].time);
				const date2 = new Date(data[data.length - 1].time);
				const delta = Math.abs(date2 - date1) / 1000 / 60; // in minutes

				const pixel_per_minute = 100;

				new_width = delta * pixel_per_minute;

				resize_chart(scale_mode);
			});
		}
		display_data(data);
	}
}

load_data()