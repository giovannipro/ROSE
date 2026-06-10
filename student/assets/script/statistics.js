function load_statistics(data) {

	const max_link_char = 50;

	const container_a = document.getElementById('statistics_a');
	const container_b = document.getElementById('statistics_b');
	const container_c = document.getElementById('statistics_c');

	const searchItems = data.filter(item => item.action === 'NEW_SEARCH' || item.action === 'NEW_SEARCH_SAME_ENGINE' || item.action === 'SAME_SEARCH' || item.action === 'SEEN_SEARCH'  || item.action === 'REFINE_SEARCH');
	const searchDuration = searchItems.reduce((sum, item) => sum + item.duration, 0);
	const avgSearchDuration = searchDuration / searchItems.length;
	const minSearchDuration = Math.min(...searchItems.map(item => item.duration));
	const maxSearchDuration = Math.max(...searchItems.map(item => item.duration));
	// console.log(searchItems)

	const pageItems = data.filter(item => item.action === 'NEW_RESULT' || item.action === 'SAME_DOMAIN_RESULT' || item.action == "SEEN_DOMAIN_RESULT");
	const pageDuration = pageItems.reduce((sum, item) => sum + item.duration, 0);
	const avgPageDuration = pageDuration / pageItems.length;
	const minPageDuration = Math.min(...pageItems.map(item => item.duration));
	const maxPageDuration = Math.max(...pageItems.map(item => item.duration));
	// console.log(pageItems)

	const newQueries = data.filter(item => item.action === 'NEW_SEARCH' || item.action === 'NEW_SEARCH_SAME_ENGINE').length;
	const reusedQueries = data.filter(item => item.action === 'SAME_SEARCH' || item.action === 'SEEN_SEARCH').length;
	const revisedQueries = data.filter(item => item.action === 'REFINE_SEARCH').length;

	const newDomains = data.filter(item => item.action === 'NEW_RESULT').length;
	const revisitedDomains = data.filter(item => item.action === 'SEEN_DOMAIN_RESULT').length;
	const pages = data.filter(item => item.action === 'NEW_RESULT' || item.action === 'SAME_DOMAIN_RESULT' || item.action === 'SEEN_DOMAIN_RESULT').length;
	
	const searchQueries = data.filter(item => item.page_type === 'SEARCH_ENGINE').map(item => ({ url: item.url, query: item.query, action: item.action, pageType: item.page_type }));
	// console.log(searchQueries)

	const searchQueries_a = searchQueries.filter(item => {
		return item.query != null
	})

	const uniqueObjects = new Set();
	let unique_queries = searchQueries_a.filter(item => {
		if (!uniqueObjects.has(item.query)) {
			uniqueObjects.add(item.query);
			return true;
		}
		return false;
	});
	// console.log(unique_queries)

	unique_queries_final = unique_queries;

	unique_web = pageItems.map(item => {
		const url = new URL(item.url);
		return { url: url.origin, domain: url.hostname.replace(/^www\./, '') };
	});

	const unique_websites = unique_web.filter((item, index, self) => index === self.findIndex((t) => t.domain === item.domain));

	const unique_websitesSort = unique_websites.sort((a, b) => {
        const cleanA = a.domain.replace(/^www\./, "");
        const cleanB = b.domain.replace(/^www\./, "");

        return cleanA.localeCompare(cleanB);
    });

	let searchEngines = [];
	searchItems.map(item => {
		searchEngines.push(detectSearchEngine(item.url))
	})
	
	const unique_searchEngines = searchEngines.filter(item => {
		if (!uniqueObjects.has(item.engine)) {
			uniqueObjects.add(item.engine);
			return true;
		}
		return false;
	});
	// console.log(unique_searchEngines)

	let output_a = '';
	let output_b = '';
	let output_c = '';

	// Time
	// -----------------------------------------------

	output_a += `<span style="margin-bottom: 1rem; display: block;"><strong>${i18next.t('time')}</strong> (mm:ss)</span>`;
	output_a += '<hr/ style="border: 0.1px solid #ccc">'
	
	output_a += '<table>';
	output_a += `<tr><td>${i18next.t('total_cap')}</td>`;
	output_a += '<td>' + convertSecondsToMinutes(pageDuration + searchDuration) + '</td></tr>'; // '<td>' + parseInt(pageDuration + searchDuration) + ' seconds / ' + convertSecondsToMinutes(pageDuration + searchDuration) + ' minutes</td></tr>'

	output_a += "<tr><td colspan='2'>" + duration_chart(searchDuration, pageDuration, 100, 'student') + "</td></tr>";
	output_a += '<tr><td>&nbsp;</td></tr>';

	output_a += `<tr><td>${i18next.t('searches')}</td>`;
	output_a += '<td>' + convertSecondsToMinutes(searchDuration) + '</td></tr>'; // '<td>' + parseInt(searchDuration) + ' seconds / ' + convertSecondsToMinutes(searchDuration) + ' minutes</td></tr>'
	output_a += `<tr><td>${i18next.t('pages')}</td>`;
	output_a += '<td>' + convertSecondsToMinutes(pageDuration) + '</td></tr>'; // '<td>' + parseInt(pageDuration) + ' seconds / ' + convertSecondsToMinutes(pageDuration) + ' minutes</td></tr>'
	output_a += '<tr><td>&nbsp;</td></tr>';

	output_a += '<table>';
	output_a += `<tr><td>${i18next.t('searches')}</td>`;
	output_a += `<tr><td>- ${i18next.t('shortest')}</td>`;
	output_a += '<td>' + convertSecondsToMinutes(minSearchDuration) + '</td></tr>';
	output_a += `<tr><td>- ${i18next.t('average')}</td>`;
	output_a += '<td>' + convertSecondsToMinutes(avgSearchDuration) + '</td></tr>';
	output_a += `<tr><td>- ${i18next.t('longest')}</td>`;
	output_a += '<td>' + convertSecondsToMinutes(maxSearchDuration) + '</td></tr>';
	output_a += '<tr><td>&nbsp;</td></tr>';

	output_a += `<tr><td>${i18next.t('pages')}</td>`;
	output_a += `<tr><td>- ${i18next.t('shortest')}</td>`;
	output_a += '<td>' + convertSecondsToMinutes(minPageDuration) + '</td></tr>';
	output_a += `<tr><td>- ${i18next.t('average')}</td>`;
	output_a += '<td>' + convertSecondsToMinutes(avgPageDuration) + '</td></tr>';
	output_a += `<tr><td>- ${i18next.t('longest')}</td>`;
	output_a += '<td>' + convertSecondsToMinutes(maxPageDuration) + '</td></tr>';
	output_a += '<tr><td>&nbsp;</td></tr>';
	output_a += '</table>';

	// Searches
	// -----------------------------------------------

	output_b += `<span style="margin-bottom: 1rem; display: block;"><strong>${i18next.t('searches')}</strong></span>`;
	output_b += '<hr/ style="border: 0.1px solid #ccc">'

	output_b += '<table>';
	output_b += `<tr><td>- ${i18next.t('total')}</td>`;
	output_b += '<td>' + (newQueries + reusedQueries + revisedQueries) + '</td></tr>';
	output_b += `<tr><td>- ${i18next.t('new')}</td>`;
	output_b += '<td>' + newQueries + '</td></tr>';
	output_b += `<tr><td>- ${i18next.t('reused')}</td>`;
	output_b += '<td>' + reusedQueries + '</td></tr>';
	output_b += `<tr><td>- ${i18next.t('modified')}</td>`;
	output_b += '<td>' + revisedQueries + '</td></tr>';
	output_b += '</table>';

	output_b += '<table style="margin-top: 1rem;">';
	output_b += `<tr><td>${i18next.t('queries')}</td></tr>`;

	output_b += '<tr><td><ul class="list">'
	unique_queries_final.forEach(item => {
		output_b += '<li><a href="' + item.url + '" target="_blank">' + item.query + '</a></li>';
	});
	output_b += '</ul></td></tr>'
	output_b += '</table>';

	output_b += '<table style="margin-top: 1.5rem;">';
	output_b += `<tr><td>${i18next.t('search_engines')}</td></tr>`;

	output_b += '<tr><td><ul class="list">'
	unique_searchEngines.forEach(item => {
		output_b += '<li>' + (item.engine) + '</li>';
	});
	output_b += '</ul></td></tr>'
	output_b += '</table>';

	// Pages
	// -----------------------------------------------

	output_c += `<span style="margin-bottom: 1rem; display: block;"><strong>${i18next.t('pages')}</strong></span>`;
	output_c += '<hr/ style="border: 0.1px solid #ccc">'

	output_c += '<table style="margin-bottom: 1.5rem;">';
	output_c += `<tr><td>- ${i18next.t('total')}</td>`;
	output_c += '<td>' + pages + '</td></tr>';
	output_c += '</table>';

	output_c += '<table>';
	output_c += `<tr><td>${i18next.t('websites')}</td></tr>`;
	output_c += `<tr><td>- ${i18next.t('new_m')}</td>`;
	output_c += '<td>' + newDomains + '</td></tr>';
	output_c += `<tr><td>- ${i18next.t('revisited')}`;
	output_c += '<td>' + revisitedDomains + '</td></tr>';
	output_c += '</table>';

	output_c += '<table style="margin-top: 1.5rem;">';
	output_c += `<tr><td>${i18next.t('domains')}</td></tr>`;

	output_c += '<tr><td><ul class="list">'
	unique_websitesSort.forEach(item => {
		output_c += '<li><a href="' + item.url + '" target="_blank">' + item.domain + '</a></li>'; //
	});
	output_c += '</ul></td></tr>'
	output_c += '</table>';

	container_a.innerHTML = output_a;
	container_b.innerHTML = output_b;
	container_c.innerHTML = output_c;

}