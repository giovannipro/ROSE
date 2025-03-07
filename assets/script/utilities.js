function getTextAfterX(query, x) {
	const index = query.indexOf(x);

	if (index !== -1) {
		return query.substring(index + 2);
	}

	return "";
}

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

		if (currentItem.page_type == 'RESULT') {
			currentGroup.push(currentItem);
		}
	}

	// Add the last group if it's not empty
	if (currentGroup.length > 0) {
		groupedData.push(currentGroup);
	}

	return groupedData;
}

function duration_chart(searchDuration, pageDuration, width) {
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
    if (width >= visualization_treshold) {
		
		if (search_width >= (visualization_treshold) && searchDuration > duration_treshold){
			val_queries = min_search;
		}

		if (page_width >= (visualization_treshold) && pageDuration > duration_treshold){
			val_pages = min_pages;
		}
    }

    // Create container div
    const container = document.createElement('div');
	const bar_height = 20;
	const font_size = "0.7rem"

    container.style.width = '95%';
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

function getUniqueValues(values) {
	// console.log(values)
	const uniqueValuesSet = new Set(values);
	return Array.from(uniqueValuesSet);
}

function short_url(url, max) {
	if (url.length > max) {
		shortUrl = url.slice(0, max) + '...';
	}
	else {
		shortUrl = url;
	}
	return shortUrl;
}

function search_engine(item) {
	// console.log(item)

	searchEngine = item
	if (item.includes('//')){
		searchEngine = item.split('//')[1]
	}

	// se_1 = se_0.split('/')[0]
	// se_2 = se_1.replace('www.','')
	// searchEngine = se_2.split('.com')[0]

	// return item[0].toUpperCase() + item.slice(1);
	return searchEngine
}

function clean_query(url){
	// console.log(url)

	let url_c = ''
	if (url.includes('q=')){
		url_a = url.split('q=')[1];

		if (url_a.includes('&')){
			url_b = url_a.split('&')[0]
		}
		else {
			url_b = url_a 
		}

		url_c = url_b.replace(/\+/g,' ')
	}
	else {
		url_c = url
	}

	return url_c
}

function clean_domain(url){
	index_1 = url.indexOf("://") + 2;
	url_a = url.substring(index_1);

	index_2 = url_a.indexOf("/") ;
	url_b = url.substring(0,index_1 + index_2 + 1);

	url_c = url.substring(0,index_2);

	// console.log(url_a)
	// console.log(url_b, index_1)
	return url_b
}

function open_tabs() {
	let open_stat = false;
	let open_sugg = false;

	const STAT_BUTTON = document.getElementById("stat_txt");
	const STAT_TAB = document.querySelector("#statistics_container");
	const STAT_ARROW = document.getElementById("open_stat");

	const SUGG_BUTTON = document.getElementById("sugg_txt");
	const SUGG_TAB = document.querySelector("#suggestions_container");
	const SUGG_ARROW = document.getElementById("open_sugg");

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

const url = window.location.href
if (!url.includes('class')){
	open_tabs();
}

// to get the feedback text
function getObjectById(data,id) {
    return data.find(item => item.id === id) || null;
}

// make url shorter
function short_text(text,characters){
	let output = text
	if (text.length > characters){
		output = text.slice(0,characters) + ' ...'
	}
	return output
}