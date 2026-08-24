const new_page_color = '#ff9100';
const duration_color = '#a4a4a4';
const chatbot_color = '#E2A5D4';
const chatbotRevised_color = '#F0BDE4'; 
const color_newQuery = '#619ED4';
const colorModifiedQuery = '#C8DFF4';
const colorReuded_query ='#90b8df';
const color_visitedDomain = '#fac074';
const color_system = '#dbdbdb';

function groupConsecutiveDomains(data) {

	const groupedData = [];
	let currentGroup = [];

	for (let i = 0; i < data.length; i++) {
		const currentItem = data[i];
		const previousItem = data[i - 1];

		if (previousItem && currentItem.domain !== previousItem.domain) {
			if (currentGroup.length > 0) {
				groupedData.push(currentGroup);
			}
			currentGroup = [];
		}

		if (currentItem.page_type == 'SEARCH_ENGINE' || currentItem.page_type == 'RESULT' || currentItem.page_type == 'CHATBOT') {
			currentGroup.push(currentItem);
		}
	}

	// Add the last group if it's not empty
	if (currentGroup.length > 0) {
		groupedData.push(currentGroup);
	}

	return groupedData;
}

function timeChart(searchDuration, chatbotDuration, pageDuration, width, view) {
	// console.log(searchDuration, chatbotDuration, pageDuration)

    const visualization_treshold = 15;
	const duration_treshold = 120;

    const total = searchDuration + chatbotDuration + pageDuration;
    const search_width = searchDuration * 100 / total;
	const chatbot_width = chatbotDuration * 100 / total;
    const page_width = pageDuration * 100 / total;
	// console.log(search_width, chatbot_width, page_width)

    let min_search = convertSecondsToMinutes(searchDuration);
	let min_chatbot = convertSecondsToMinutes(chatbotDuration);
    let min_pages = convertSecondsToMinutes(pageDuration);
	// console.log(min_search, min_chatbot, min_pages)

    let min_ration = 0.1;
    if ((searchDuration / (pageDuration + chatbotDuration)) < min_ration) {
        min_search = '';
    }
	if ((chatbotDuration / (searchDuration + pageDuration)) < min_ration) {
        min_chatbot = '';
    }
    if ((pageDuration / (searchDuration + chatbotDuration)) < min_ration) {
        min_pages = '';
    }
	// console.log(searchDuration / (pageDuration + chatbotDuration))

    let val_queries = '';
	let val_chatbots = '';
    let val_pages = '';

	if (view == 'class'){
		if (width >= visualization_treshold) {
			
			if (search_width >= (visualization_treshold) && searchDuration > duration_treshold){
				val_queries = min_search;
			}

			if (chatbot_width >= (visualization_treshold) && chatbotDuration > duration_treshold){
				val_chatbots = min_chatbot;
			}
	
			if (page_width >= (visualization_treshold) && pageDuration > duration_treshold){
				val_pages = min_pages;
			}
		}
	}
	else {
		val_queries = min_search;
		val_chatbot = min_chatbot;
		val_pages = min_pages;
	}

    // Create container div
    const container = document.createElement('div');
	const font_size = "0.7rem"

	let bar_height = 60;
	if (view == 'class') {
		bar_height = 20
	}

    container.style.width = '100%';
    container.style.height = bar_height + 'px';
	container.style.marginBottom = 10 + 'px';
	container.style.paddingTop = 5 + 'px';
	container.style.paddingBottom = 13 + 'px';
	container.style.borderBottom = '1px solid #ccc';

    // Create SVG using D3
    const svg = d3.select(container)
        .append('svg')
        .attr('width', '100%')
        .attr('height', bar_height)

    // Add queries rect
    svg.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', search_width + '%')
        .attr('height', bar_height)
        .attr('fill', color_newQuery)
        .attr('data-queDur', searchDuration);

	// Add chatbot rect
    svg.append('rect')
        .attr('x', search_width + '%') 
        .attr('y', 0)
        .attr('width', chatbot_width + '%')
        .attr('height', bar_height)
        .attr('fill', chatbot_color)
        .attr('data-chatDur', chatbotDuration);

    // Add pages rect
    svg.append('rect')
        .attr('x', (search_width + chatbot_width) + '%') 
        .attr('y', 0)
        .attr('width', page_width + '%')
        .attr('height', bar_height)
        .attr('fill', new_page_color)
        .attr('data-pagDur', pageDuration);

    return container.outerHTML;
}

function makeDurationChart(data){
	// console.log(data)

    const container = document.createElement('div');
	const width =  (window.innerWidth / 3) * 0.855;

	container.style.width = '100%';
    container.style.height = 80 + 'px';

	function parseTime(str) {
		const [m, s] = str.split(":").map(Number);
		return new Date(2000, 0, 1, 0, m, s);
	}

	/* ---------------------------------------------------------
	2. LAYOUT
	--------------------------------------------------------- */
	// const container = document.getElementById('duration_chart')

	const margin = { top: 0, right: 0, bottom: 20, left: 0 };
	const rowHeight = 23;
	const height = (data.length * rowHeight) + 30;

	const svg = d3.select(container)
		.append("svg")
		.attr("width", '100%')
		.attr("height", height)
		.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);

	const maxEnd = d3.max(data, d => d.end);

	const xScale = d3.scaleTime()
		.domain([parseTime("00:00"), maxEnd])
		.range([0, width]); //  - (margin.left + margin.right) - 10

	/* ---------------------------------------------------------
	4. TOOLTIP
	--------------------------------------------------------- */
	const tooltip = d3.select("body")
		.append("div")
		.attr("class", "tooltip");

	const fmt = d3.timeFormat("%M:%S");

	/* ---------------------------------------------------------
	5. DRAW ROWS
	--------------------------------------------------------- */
	const barThickness = 4;   // thin connecting bar
	const capWidth = 6;       // width of the start/end cap rects
	const capHeight = 12;     // height of the start/end cap rects
	const circleRadius = 6;

	const rows = svg.selectAll(".row")
		.data(data)
		.join("g")
		.attr("class", "row")
		.attr("transform", (d, i) => `translate(0, ${i * rowHeight + rowHeight / 2})`);

	// light connecting bar (tinted version of the row color)
	rows.append("rect")
		.attr("x", d => xScale(d.start) + capWidth / 2)
		.attr("y", -barThickness / 2)
		.attr("width", d => xScale(d.end) - xScale(d.start))
		.attr("height", barThickness)
		.attr("fill", d => d.color)
		.attr("opacity", 0.25);

	// start cap
	rows.append("rect")
		.attr("x", d => xScale(d.start) + capWidth / 2)
		.attr("y", -capHeight / 2)
		.attr("width", capWidth)
		.attr("height", capHeight)
		.attr("fill", d => d.color);

	// end cap
	rows.append("rect")
		.attr("x", d => xScale(d.end) - capWidth / 2)
		.attr("y", -capHeight / 2)
		.attr("width", capWidth)
		.attr("height", capHeight)
		.attr("fill", d => d.color);

	// marker circle
	rows.append("circle")
		.attr("cx", d => xScale(d.marker))
		.attr("cy", 0)
		.attr("r", circleRadius)
		.attr("fill", d => d.color);


	/* ---------------------------------------------------------
	7. AXIS
	--------------------------------------------------------- */
	const axisG = svg.append("g")
		.attr("transform", `translate(0, ${height - 60})`);

	axisG.append("line")
		.attr("class", "axis-line")
		.attr("stroke",'#ccc')
		.attr("x1", 0)
		.attr("x2", width - margin.left - margin.right)
		.attr("y1", height - margin.bottom - 40)
		.attr("y2", height - margin.bottom - 40);

	const [domainStart, domainEnd] = xScale.domain();

	axisG.append("text")
		.attr("class", "axis-label")
		.attr("x", 0)
		.attr("y", 52)
		.attr("text-anchor", "start")
		.attr("font-size", 12)
		.attr("fill", "#ccc")
		.text('00:00');

	axisG.append("text")
		.attr("class", "axis-label")
		.attr("x", width)
		.attr("y", 52)
		.attr("text-anchor", "end")
		.attr("font-size", 12)
		.attr("fill", "#ccc")
		// .text((maxEnd));
		.text(fmt(maxEnd));

	return container.outerHTML;
}

function convertSecondsToMinutes(seconds) {
	// console.log(seconds);

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours > 0 ? (hours < 10 ? "0" : "") + hours + ":" : "";
    const formattedMinutes = (minutes < 10 ? "0" : "") + minutes;
    const formattedSeconds = (remainingSeconds < 10 ? "0" : "") + parseInt(remainingSeconds);

    if (String(formattedMinutes) == "Infinity" || String(formattedMinutes) == "NaN" || String(formattedSeconds) == "Infinity" || String(formattedSeconds) == "NaN") {
        time = "00:00";
    } else {
        time = formattedHours + formattedMinutes + ":" + formattedSeconds;
    }
    return time;
}

function clean_query(url){
	// console.log(url)
	const params = new URL(url).searchParams;
	const query = params.has("q") ? params.get("q") : null;

	// let url_c = ''
	// if (url.includes('q=')){
	// 	url_a = url.split('q=')[1];

	// 	if (url_a.includes('&')){
	// 		url_b = url_a.split('&')[0]
	// 	}
	// 	else {
	// 		url_b = url_a 
	// 	}

	// 	url_c = url_b.replace(/\+/g,' ')
	// }
	// else {
	// 	url_c = url
	// }

	return query
}


function clean_domain(url){
	
	const domain_0 = url.split('://')[1]
	const domain_1 = domain_0.split('/')[0];
	let domain_2 = '';

	if (domain_1.includes('www.')){
		domain_2 = domain_1.substring(4);
	}
	else {
		domain_2 = domain_1
	}
	
	// console.log(domain_2)
	return domain_2
}

// function search_engine(item) {

// 	searchEngine = item
// 	if (item.includes('//')){
// 		searchEngine = item.split('//')[1]
// 	}

// 	return searchEngine
// }

function getUniqueValues(values) {
	const uniqueValuesSet = new Set(values);
	return Array.from(uniqueValuesSet);
}

// to get the feedback text
function getObjectById(data,id) {
    return data.find(item => item.id.toLowerCase() === id) || null;
}

// make url shorter
function short_text(text,characters){
	let output = text
	if (text.length > characters){
		output = text.slice(0,characters) + ' ...'
	}
	return output
}

function open_tabs(tabA, tabB, tabC) {

	let open_time = false;
	let open_stat = false;
	let open_sugg = false;

	if (tabA == 'time_container'){
		const TIME_BUTTON = document.getElementById("time_txt");
		const TIME_TAB = document.getElementById("time_container");
		const TIME_ARROW = document.getElementById("open_time");

		TIME_BUTTON.addEventListener("click", () => {
	
			if (open_time == false) {
				TIME_TAB.style.display = 'block';
				open_time = true;
				TIME_ARROW.innerHTML = '&uarr;';
			}
			else {
				TIME_TAB.style.display = 'none';
				open_time = false;
				TIME_ARROW.innerHTML = '&darr;';
			}
		});
	}

	if (tabB == 'statistics_container'){
		const STAT_BUTTON = document.getElementById("stat_txt");
		const STAT_TAB = document.querySelector("#statistics_container");
		const STAT_ARROW = document.getElementById("open_stat");

		STAT_BUTTON.addEventListener("click", () => {
	
			if (open_stat == false) {
				STAT_TAB.style.display = 'block';
				open_stat = true;
				STAT_ARROW.innerHTML = '&uarr;';
			}
			else {
				STAT_TAB.style.display = 'none';
				open_stat = false;
				STAT_ARROW.innerHTML = '&darr;';
			}
		});
	}

	if (tabC == 'suggestions_container'){
		const SUGG_BUTTON = document.getElementById("sugg_txt");
		const SUGG_TAB = document.querySelector("#suggestions_container");
		const SUGG_ARROW = document.getElementById("open_sugg");
	
		SUGG_BUTTON.addEventListener("click", () => {
	
			if (open_sugg == false) {
				SUGG_TAB.style.display = 'block';
				open_sugg = true;
				SUGG_ARROW.innerHTML = '&uarr;';
			}
			else {
				SUGG_TAB.style.display = 'none';
				open_sugg = false;
				SUGG_ARROW.innerHTML = '&darr;';
			}
		});
	}

}

function get_query(url){
	const urlObj = new URL(url);
	const url_0 = urlObj.searchParams;

	let the_url = ''
	if (url_0.get('q') != null){
		the_url = url_0.get('q')
	}
	else if (url_0.get('p') != null){
		the_url = url_0.get('p')
	}
	else {
		the_url = url
	}
	
	return the_url
}

function formatDate(input) { //2025-04-03 12:48:32.983000+00:00
	const datePart = input.split(' ')[0];
	const [year, month, day] = datePart.split('-');
	return `${day}-${month}-${year}`;
}

function parseDate(str) {
  // Keep milliseconds (first 3 digits of microseconds)
  const fixedStr = str.replace(' ', 'T').replace(/(\.\d{3})\d+/, '$1');
  return new Date(fixedStr);
}

function secondsToMMSS(seconds){
	const totalSeconds = Math.floor(seconds);
	const minutes = Math.floor(totalSeconds / 60);
	const remainingSeconds = totalSeconds % 60;

	return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;

}

function checkAction(action){
	// console.log(action)

	category = 'unknown'
	subcategory = ''

	if (
		action == 'SAME_DOMAIN_RESULT' || 
		action == 'SEEN_DOMAIN_RESULT' || 
		action == 'NEW_RESULT')
		{
			category = 'page'
	}
	else {

		category = 'search'

		if (
			action == 'NEW_SEARCH' ||  // new
			action == 'NEW_SEARCH_SAME_ENGINE' || 
			action == 'NEW_SEARCH_SEEN_ENGINE'
			)
			{
				subcategory = 'new'
		}
		else if (
			action == 'SAME_SEARCH_SEEN_ENGINE' ||  // reused
			action == 'SAME_SEARCH_NEW_ENGINE' || 
			action == 'SAME_SEARCH' || 
			action == 'SEEN_SEARCH' ||
			action == 'SEEN_SEARCH_SEEN_ENGINE' ||
			action == 'SEEN_SEARCH_NEW_ENGINE'
			)
			{
				subcategory = 'reused'
		}
		else if (action == 'REFINE_SEARCH') {
			subcategory = 'refine'
		}
			
	}

	return [category, subcategory]
}

function detectSearchEngine(url) {

	const SEARCH_ENGINES = [
		{ name: "Google", domains: ["google."], queryParam: "q" },
		{ name: "Yahoo", domains: ["yahoo."], queryParam: "p" },
		{ name: "Bing", domains: ["bing.com"], queryParam: "q" },
		{ name: "DuckDuckGo", domains: ["duckduckgo.com"], queryParam: "q" },
		{ name: "Ecosia", domains: ["ecosia.org"], queryParam: "q" },
		{ name: "Brave", domains: ["search.brave.com"], queryParam: "q" },
		{ name: "Yandex", domains: ["yandex."], queryParam: "text" },
		{ name: "Baidu", domains: ["baidu.com"], queryParam: "wd" },
		{ name: "Startpage", domains: ["startpage.com"], queryParam: "query" }
	];

	const u = new URL(url);
	const hostname = u.hostname.toLowerCase();

	for (const engine of SEARCH_ENGINES) {
    	if (engine.domains.some(d => hostname.includes(d))) {
      		return {
        		engine: engine.name,
        		query: u.searchParams.get(engine.queryParam)
      		};
    	}
  	}

	return null;
}