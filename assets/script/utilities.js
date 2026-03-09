function groupConsecutiveDomains(data) {
	// data = data.filter(d => d.page_type == 'RESULT')
	// console.log(data);

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

		if (currentItem.page_type == 'RESULT' || currentItem.page_type == 'CHATBOT') {
			currentGroup.push(currentItem);
		}
	}

	// Add the last group if it's not empty
	if (currentGroup.length > 0) {
		groupedData.push(currentGroup);
	}

	return groupedData;
}

function duration_chart(searchDuration, pageDuration, width, view) {
    const visualization_treshold = 15;
	const duration_treshold = 120;

    const total = searchDuration + pageDuration;
    const search_width = searchDuration * 100 / total;
    const page_width = pageDuration * 100 / total;

    let min_search = convertSecondsToMinutes(searchDuration);
    let min_pages = convertSecondsToMinutes(pageDuration);

    let min_ration = 0.1;
    if ((searchDuration / pageDuration) < min_ration) {
        min_search = '';
    }
    if ((pageDuration / searchDuration) < min_ration) {
        min_pages = '';
    }

    let val_queries = '';
    let val_pages = '';
	if (view == 'class'){
		if (width >= visualization_treshold) {
			
			if (search_width >= (visualization_treshold) && searchDuration > duration_treshold){
				val_queries = min_search;
			}
	
			if (page_width >= (visualization_treshold) && pageDuration > duration_treshold){
				val_pages = min_pages;
			}
		}
	}
	else {
		val_queries = min_search;
		val_pages = min_pages;
	}

    // Create container div
    const container = document.createElement('div');
	const bar_height = 20;
	const font_size = "0.7rem"

    container.style.width = '100%';
    container.style.height = '20px';

    // Create SVG using D3
    const svg = d3.select(container)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '20');

    // Add queries rect
    svg.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', search_width + '%')
        .attr('height', bar_height)
        .attr('fill', '#619ED4')
        .attr('data-queDur', searchDuration);

    // Add pages rect
    svg.append('rect')
        .attr('x', search_width + '%') 
        .attr('y', 0)
        .attr('width', page_width + '%')
        .attr('height', bar_height)
        .attr('fill', '#ff9100')
        .attr('data-pagDur', pageDuration);

    // Add queries text
    if (val_queries) {
        svg.append('text')
            .attr('x', (search_width - 3) + '%')
            .attr('y', 14)
            .attr('text-anchor', 'end')
            .attr('fill', 'white')
            .attr('font-size', font_size)
            .text(val_queries);
    }

    // Add pages text
    if (val_pages) {
        svg.append('text')
            .attr('x', (search_width + page_width - 3) + '%')
            .attr('y', 14)
            .attr('text-anchor', 'end')
            .attr('fill', 'white')
            .attr('font-size', font_size)
            .text(val_pages);
    }

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

function open_tabs(tabA, tabB) {

	let open_stat = false;
	let open_sugg = false;

	if (tabA == 'statistics_container'){
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

	if (tabB == 'suggestions_container'){
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