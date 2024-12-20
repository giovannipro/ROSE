function getTextAfterX(query, x) {
	const index = query.indexOf(x);

	if (index !== -1) {
		return query.substring(index + 2);
	}

	return "";
}

function groupConsecutiveDomains(data) {
	// data = data.filter(d => d.page_type == 'RESULT')
	console.log(data);

	const groupedData = [];
	let currentGroup = [];

	for (let i = 0; i < data.length; i++) {
		const currentItem = data[i];
		const previousItem = data[i - 1];

		// console.log(currentItem.time - previousItem.item)

		if (previousItem && currentItem.domain !== previousItem.domain) {
			// New domain encountered, start a new group
			if (currentGroup.length > 0) {
				groupedData.push(currentGroup);
			}
			currentGroup = [];
		}

		// console.log(currentItem)

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
			<div class="duration_chart" style="background-color: #619ED4; width: calc(${page_width}% - 9px);">${min_pages}</div>
			<div class="duration_chart" style="background-color: #ff9100; width: ${search_width}%; justify-content: flex-end;">${min_search}</div>
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
	return item[0].toUpperCase() + item.slice(1);
}

function clean_query(url){
	url_a = url.split("q=")[1];

	index_start = url_a.indexOf("q=") + 1;
	index_end = url_a.length;

	if (url_a.indexOf("&") != -1) {
		index_end = url_a.indexOf("&");
	}

	url_b = url_a.substring(index_start, index_end);
	url_c = url_b.replace(/\+/g, " ");

	return url_c
}

function clean_domain(url){
	index_1 = url.indexOf("//") + 2;
	url_a = url.substring(index_1);

	index_2 = url_a.indexOf("/") ;
	url_b = url.substring(0,index_1 + index_2 + 1);

	url_c = url.substring(0,index_2);

	// console.log(url_a)
	// console.log(url_b, index_1)
	return url_b
}

function load_statistics(data) {

	const max_link_char = 50;

	const container_a = document.getElementById('statistics_a');
	const container_b = document.getElementById('statistics_b');
	const container_c = document.getElementById('statistics_c');

	const searchItems = data.filter(item => item.action === 'NEW_SEARCH' || item.action === 'NEW_SEARCH_SAME_ENGINE' || item.action === 'REFINE_SEARCH');
	const searchDuration = searchItems.reduce((sum, item) => sum + item.duration, 0);
	const avgSearchDuration = searchDuration / searchItems.length;
	const minSearchDuration = Math.min(...searchItems.map(item => item.duration));
	const maxSearchDuration = Math.max(...searchItems.map(item => item.duration));

	const pageItems = data.filter(item => item.action === 'NEW_RESULT' || item.action === 'SAME_DOMAIN_RESULT' || item.action == "SEEN_DOMAIN_RESULT");
	const pageDuration = pageItems.reduce((sum, item) => sum + item.duration, 0);
	const avgPageDuration = pageDuration / pageItems.length;
	const minPageDuration = Math.min(...pageItems.map(item => item.duration));
	const maxPageDuration = Math.max(...pageItems.map(item => item.duration));

	const newQueries = data.filter(item => item.action === 'NEW_SEARCH' || item.action === 'NEW_SEARCH_SAME_ENGINE').length;
	const reusedQueries = data.filter(item => item.action === 'SAME_SEARCH' || item.action === 'SEEN_SEARCH').length;
	const revisedQueries = data.filter(item => item.action === 'REFINE_SEARCH').length;


	const newDomains = data.filter(item => item.action === 'NEW_RESULT').length;
	const revisitedDomains = data.filter(item => item.action === 'SEEN_DOMAIN_RESULT').length;
	const pages = data.filter(item => item.action === 'NEW_RESULT' || item.action === 'SAME_DOMAIN_RESULT' || item.action === 'SEEN_DOMAIN_RESULT').length;

	const searchQueries = data.filter(item => item.page_type === 'SEARCH_ENGINE').map(item => ({ url: item.url, query: item.query }));
	const unique_queries = searchQueries.filter((item, index, self) => index === self.findIndex((t) => t.query === item.query));

	// const websites = pageItems.map(item => item.url)
	unique_web = searchItems.map(item => {
		const url = new URL(item.url);
		return { url: url.origin, domain: url.hostname.replace(/^www\./, '') };
	});
	const unique_websites = unique_web.filter((item, index, self) => index === self.findIndex((t) => t.domain === item.domain));
	// console.log(unique_websites)

	uniq_engine = searchItems.map(item => item.url.match(/(?<=www\.).*?(?=\.\w+\/)/)[0]);
	const unique_searchEngines = getUniqueValues(uniq_engine);

	let output_a = '';
	let output_b = '';
	let output_c = '';

	output_a += '<table>';
	output_a += '<tr><td><strong>Duration</strong></td></tr>';

	output_a += '<tr><td>Total</td>';
	output_a += '<td>' + convertSecondsToMinutes(pageDuration + searchDuration) + '</td></tr>'; // '<td>' + parseInt(pageDuration + searchDuration) + ' seconds / ' + convertSecondsToMinutes(pageDuration + searchDuration) + ' minutes</td></tr>'

	output_a += "<tr><td colspan='2'>" + duration_chart(searchDuration, pageDuration) + "</td></tr>";
	output_a += '<tr><td>&nbsp;</td></tr>';

	output_a += '<tr><td>Search</td>';
	output_a += '<td>' + convertSecondsToMinutes(searchDuration) + '</td></tr>'; // '<td>' + parseInt(searchDuration) + ' seconds / ' + convertSecondsToMinutes(searchDuration) + ' minutes</td></tr>'
	output_a += '<tr><td>Pages</td>';
	output_a += '<td>' + convertSecondsToMinutes(pageDuration) + '</td></tr>'; // '<td>' + parseInt(pageDuration) + ' seconds / ' + convertSecondsToMinutes(pageDuration) + ' minutes</td></tr>'
	output_a += '<tr><td>&nbsp;</td></tr>';

	output_a += '<tr><td>Search</td>';
	output_a += '<tr><td>- shortest</td>';
	output_a += '<td>' + convertSecondsToMinutes(minSearchDuration) + '</td></tr>';
	output_a += '<tr><td>- average</td>';
	output_a += '<td>' + convertSecondsToMinutes(avgSearchDuration) + '</td></tr>';
	output_a += '<tr><td>- longest</td>';
	output_a += '<td>' + convertSecondsToMinutes(maxSearchDuration) + '</td></tr>';
	output_a += '<tr><td>&nbsp;</td></tr>';

	output_a += '<tr><td>Pages</td>';
	output_a += '<tr><td>- shortest</td>';
	output_a += '<td>' + convertSecondsToMinutes(minPageDuration) + '</td></tr>';
	output_a += '<tr><td>- average</td>';
	output_a += '<td>' + convertSecondsToMinutes(avgPageDuration) + '</td></tr>';
	output_a += '<tr><td>- longest</td>';
	output_a += '<td>' + convertSecondsToMinutes(maxPageDuration) + '</td></tr>';
	output_a += '<tr><td>&nbsp;</td></tr>';

	output_a += '</table>';

	output_b += '<table>';
	output_b += '<tr><td><strong>Search</strong></td></tr>';
	output_b += '<tr><td>Queries</td></tr>';
	output_b += '<tr><td>- total</td>';
	output_b += '<td>' + (newQueries + reusedQueries + revisedQueries) + '</td></tr>';
	output_b += '<tr><td>- new</td>';
	output_b += '<td>' + newQueries + '</td></tr>';
	output_b += '<tr><td>- reused</td>';
	output_b += '<td>' + reusedQueries + '</td></tr>';
	output_b += '<tr><td>- modified</td>';
	output_b += '<td>' + revisedQueries + '</td></tr>';
	output_b += '</table>';

	output_c += '<table>';
	output_c += '<tr><td><strong>Websites</strong></td></tr>';
	output_c += '<tr><td>- total</td>';
	output_c += '<td>' + (newDomains + revisitedDomains) + '</td></tr>';
	output_c += '<tr><td>- new</td>';
	output_c += '<td>' + newDomains + '</td></tr>';
	output_c += '<tr><td>- revisited</td>';
	output_c += '<td>' + revisitedDomains + '</td></tr>';
	output_c += '<tr><td>&nbsp; </td></tr>';
	output_c += '<tr><td>- total pages</td>';
	output_c += '<td>' + pages + '</td></tr>';
	output_c += '</table>';

	output_b += '<table style="margin-top: 1.5rem;">';
	output_b += '<tr><td><strong>Queries</strong></td></tr>';
	unique_queries.forEach(item => {
		output_b += '<tr><td>- <a href="' + item.url + '" target="_blank">' + item.query + '</a></td></tr>';
	});
	output_b += '</table>';

	output_b += '<table style="margin-top: 1.5rem;">';
	output_b += '<tr><td><strong>Search engines</strong></td></tr>';
	unique_searchEngines.forEach(item => {
		output_b += '<tr><td>' + search_engine(item) + '</td></tr>';
		// output_b += '<tr><td><a href="' + item + '" target="_blank">' + short_url(item,max_link_char) + '</a></td></tr>'
	});
	output_b += '<tr><td>&nbsp;</td></tr>';
	output_b += '</table>';

	output_c += '<table style="margin-top: 1.5rem;">';
	output_c += '<tr><td><strong>Domains</strong></td></tr>';
	unique_websites.forEach(item => {
		output_c += '<tr><td><a href="' + item.url + '" target="_blank">' + item.domain + '</a></td><tr>'; //
	});
	output_c += '<tr><td>&nbsp;</td></tr>';
	output_c += '</tr>';
	output_c += '</table>';

	container_a.innerHTML = output_a;
	container_b.innerHTML = output_b;
	container_c.innerHTML = output_c;

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