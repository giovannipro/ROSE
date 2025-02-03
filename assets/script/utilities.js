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

function duration_chart(searchDuration, pageDuration) {

	const total = searchDuration + pageDuration;
	const search_width = searchDuration * 100 / total;
	const page_width = pageDuration * 100 / total;

	const min_search = convertSecondsToMinutes(searchDuration);
	const min_pages = convertSecondsToMinutes(pageDuration);

	let chart = `
		<div style="display: flex; justify-content: space-between;">
			<div class="duration_chart" style="background-color: #619ED4; width: ${search_width}%; justify-content: flex-end;">${min_search}</div>
			<div class="duration_chart" style="background-color: #ff9100; width: calc(${page_width}% - 9px); justify-content: flex-end;">${min_pages}</div>
		</div>
	`;

	return chart;
}

function convertSecondsToMinutes(seconds) {
	// console.log(seconds)

	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;

	const formattedMinutes = (minutes < 10 ? "0" : "") + minutes;
	const formattedSeconds = (remainingSeconds < 10 ? "0" : "") + parseInt(remainingSeconds);
	// console.log(formattedMinutes + ':' + formattedSeconds)

	if (String(formattedMinutes) == "Infinity" || String(formattedMinutes) == "NaN" || String(formattedSeconds) == "Infinity" || String(formattedSeconds) == "NaN") {
		time = 0;
	}
	else {
		time = formattedMinutes + ':' + formattedSeconds;
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

open_tabs();