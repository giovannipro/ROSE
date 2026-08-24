function load_statistics(data) { 

	// on Time use and statitics tab

	const max_link_char = 50;

	const container_sa = document.getElementById('statistics_a');
	const container_sb = document.getElementById('statistics_b');
	const container_sc = document.getElementById('statistics_c');

	const container_ta = document.getElementById('time_a');
	const container_tb = document.getElementById('time_b');
	const container_tc = document.getElementById('time_c');

	// split data in searches, chatbots, pages
	// ----------------------------------------
	const searchItems = data.filter(item => item.page_type === 'SEARCH_ENGINE') // item => item.action === 'NEW_SEARCH' || item.action === 'NEW_SEARCH_SAME_ENGINE' || item.action === 'SAME_SEARCH' || item.action === 'SEEN_SEARCH'  || item.action === 'REFINE_SEARCH');
	const searchDuration = searchItems.reduce((sum, item) => sum + item.duration, 0);
	const avgSearchDuration = searchDuration / searchItems.length;
	const minSearchDuration = Math.min(...searchItems.map(item => item.duration));
	const maxSearchDuration = Math.max(...searchItems.map(item => item.duration));
	// console.log(searchItems)

	const chatbotItems = data.filter(item => item.page_type === 'CHATBOT') //item => item.action === 'NEW_RESULT' || item.action === 'SAME_DOMAIN_RESULT' || item.action == "SEEN_DOMAIN_RESULT");
	const chatbotDuration = chatbotItems.reduce((sum, item) => sum + item.duration, 0);
	const avgchatbotDuration = chatbotDuration / chatbotItems.length;
	const minchatbotDuration = Math.min(...chatbotItems.map(item => item.duration));
	const maxchatbotDuration = Math.max(...chatbotItems.map(item => item.duration));
	// console.log(chatbotItems)

	const pageItems = data.filter(item => item.page_type === 'RESULT') //item => item.action === 'NEW_RESULT' || item.action === 'SAME_DOMAIN_RESULT' || item.action == "SEEN_DOMAIN_RESULT");
	const pageDuration = pageItems.reduce((sum, item) => sum + item.duration, 0);
	const avgPageDuration = pageDuration / pageItems.length;
	const minPageDuration = Math.min(...pageItems.map(item => item.duration));
	const maxPageDuration = Math.max(...pageItems.map(item => item.duration));
	// console.log(pageItems)

	const totalDuration = searchDuration + chatbotDuration + pageDuration;

	const newQueries = data.filter(item => item.action === 'NEW_SEARCH' || item.action === 'NEW_SEARCH_SAME_ENGINE').length;
	const reusedQueries = data.filter(item => item.action === 'SAME_SEARCH' || item.action === 'SEEN_SEARCH').length;
	const revisedQueries = data.filter(item => item.action === 'REFINE_SEARCH').length;

	const pages = data.filter(item => 
			item.page_type === 'RESULT' && (
				item.action === 'NEW_RESULT' || 
				item.action === 'SAME_DOMAIN_RESULT' || 
				item.action === 'SEEN_DOMAIN_RESULT'
			)
		).length;
	
	const searchQueries = data.filter(item => item.page_type === 'SEARCH_ENGINE').map(item => ({ url: item.url, query: item.query, action: item.action, pageType: item.page_type }));

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

	// domains
	// -----------------------
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

	const newDomains = unique_websitesSort.length;
	const revisitedDomains = data.filter(item => item.action === 'SEEN_DOMAIN_RESULT').length;

	// searches
	// -----------------------
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
	
	// chatbots
	// -----------------------

	const unique_chatbot = chatbotItems.map(item => {
		// console.log(item.domain)
		return {chatbot: item.domain}
	});

	const unique_chats = unique_chatbot.filter((item, index, self) => index === self.findIndex((t) => t.domain === item.domain));

	const unique_chatbotSort = unique_chats.sort((a, b) => {
        return a.chatbot.localeCompare(b.chatbot);
    });
	// console.log(unique_chatbotSort)

	// -----------------------

	let output_sa = '';
	let output_sb = '';
	let output_sc = '';

	let output_ta = '';
	let output_tb = '';
	let output_tc = '';

	// Time use 
	// -----------------------------------------------
	// -----------------------------------------------

	// Time  
	// -----------------------------------------------

	output_ta += `<span style="margin-bottom: 1rem; display: block;"><strong>${i18next.t('time')}</strong> (mm:ss)</span>`;
	output_ta += '<hr/ style="border: 0.1px solid #ccc">'
	
	output_ta +=  timeChart(searchDuration, chatbotDuration, pageDuration, 100, 'student');
	
	output_ta += '<table style="margin-top: 45px;">';
	output_ta += `<tr><td><span class="legend_item" style="background-color: ${color_newQuery};"></span>${i18next.t('searches')}</td>`;
	output_ta += '<td>' + convertSecondsToMinutes(searchDuration) + '</td></tr>'; // '<td>' + parseInt(searchDuration) + ' seconds / ' + convertSecondsToMinutes(searchDuration) + ' minutes</td></tr>'
	output_ta += `<tr><td><span class="legend_item" style="background-color: ${chatbot_color};"></span>${i18next.t('chatbots')}</td>`;
	output_ta += '<td>' + convertSecondsToMinutes(chatbotDuration) + '</td></tr>';
	output_ta += `<tr><td><span class="legend_item" style="background-color: ${new_page_color};"></span>${i18next.t('pages')}</td>`;
	output_ta += '<td>' + convertSecondsToMinutes(pageDuration) + '</td></tr>'; // '<td>' + parseInt(pageDuration) + ' seconds / ' + convertSecondsToMinutes(pageDuration) + ' minutes</td></tr>'
	output_ta += `<tr><td><span class="legend_item" style="background-color: white;"></span>${i18next.t('total_cap')}</td>`;
	output_ta += '<td>' + convertSecondsToMinutes(totalDuration) + '</td></tr>';
	output_ta += '<tr><td>&nbsp;</td></tr>';
	output_ta += '</table>';

	// Durations 
	// -----------------------------------------------

	function parseTime(str) {
		const [m, s] = str.split(":").map(Number);
		return new Date(2000, 0, 1, 0, m, s);
	}

	search_shortest = parseTime(convertSecondsToMinutes(minSearchDuration));
	search_average  = parseTime(convertSecondsToMinutes(avgSearchDuration));
	search_longest  = parseTime(convertSecondsToMinutes(maxSearchDuration));

	chatbo_shortest = parseTime(convertSecondsToMinutes(minchatbotDuration));
	chatbo_average  = parseTime(convertSecondsToMinutes(avgchatbotDuration));
	chatbo_longest  = parseTime(convertSecondsToMinutes(maxchatbotDuration));

	pages_shortest  = parseTime(convertSecondsToMinutes(minPageDuration));
	pages_average   = parseTime(convertSecondsToMinutes(avgPageDuration));
	pages_longest   = parseTime(convertSecondsToMinutes(maxPageDuration));

	duration_data = [
		{
			label: "Searches",
			start: search_shortest,
			marker: search_average,
			end: search_longest,
			color: color_newQuery
		},
		{
			label: "Chatbots",
			start: chatbo_shortest,
			marker: chatbo_average,
			end: chatbo_longest,
			color: chatbot_color
		},
		{
			label: "Pages",
			start: pages_shortest,
			marker: pages_average,
			end: pages_longest,
			color: new_page_color
		}
	];

	
	output_tb += `<span style="margin-bottom: 1rem; display: block;"><strong>${i18next.t('duration')}</strong> (mm:ss)</span>`;
	output_tb += '<hr/ style="border: 0.1px solid #ccc">'
	
	// output_tb += makeDurationChart(duration_data);
	output_tb += '<div id="duration-chart-container" style="width: 100%; height: 80px;"></div>'

	output_tb += '<table style="margin-top: 23px" id="duration_matrix">';
	output_tb += `<tr>`;
	output_tb += `<td></td>`;
	output_tb += `<td>${i18next.t('shortest')}</td>`;
	output_tb += `<td>${i18next.t('average')}</td>`;
	output_tb += `<td>${i18next.t('longest')}</td>`;
	output_tb += `</tr>`;

	output_tb += `<tr>`;
	output_tb += `<td><span class="legend_item" style="background-color: ${color_newQuery};"></span></td>`;
	output_tb += `<td>${convertSecondsToMinutes(minSearchDuration)}</td>`;
	output_tb += `<td>${convertSecondsToMinutes(avgSearchDuration)}</td>`;
	output_tb += `<td>${convertSecondsToMinutes(maxSearchDuration)}</td>`;
	output_tb += `</tr>`;

	chat_shortest = '-'
	chat_average  = '-'
	chat_longest  = '-'

	if (chatbotDuration != 0){
		chat_shortest = convertSecondsToMinutes(minchatbotDuration)
		chat_average  = convertSecondsToMinutes(avgchatbotDuration)
		chat_longest  = convertSecondsToMinutes(maxchatbotDuration)
	}
	// console.log(chatbotDuration)

	output_tb += `<tr>`;
	output_tb += `<td><span class="legend_item" style="background-color: ${chatbot_color};"></span></td>`;
	output_tb += `<td>${chat_shortest}</td>`;
	output_tb += `<td>${chat_average}</td>`;
	output_tb += `<td>${chat_longest}</td>`;
	output_tb += `</tr>`;

	output_tb += `<tr>`;
	output_tb += `<td><span class="legend_item" style="background-color: ${new_page_color};"></span></td>`;
	output_tb += `<td>${convertSecondsToMinutes(minPageDuration)}</td>`;
	output_tb += `<td>${convertSecondsToMinutes(avgPageDuration)}</td>`;
	output_tb += `<td>${convertSecondsToMinutes(maxPageDuration)}</td>`;
	output_tb += `</tr>`;

	output_tb += '</table>';

	// Statistics
	// -----------------------------------------------
	// -----------------------------------------------

	// Searches
	// -----------------------------------------------

	output_sa += `<span style="margin-bottom: 1rem; display: block;"><strong>${i18next.t('searches')}</strong></span>`;
	output_sa += '<hr/ style="border: 0.1px solid #ccc">'

	output_sa += '<table>';
	output_sa += `<tr><td>- ${i18next.t('total')}</td>`;
	output_sa += '<td>' + (newQueries + reusedQueries + revisedQueries) + '</td></tr>';
	output_sa += `<tr><td>- ${i18next.t('new')}</td>`;
	output_sa += '<td>' + newQueries + '</td></tr>';
	output_sa += `<tr><td>- ${i18next.t('reused')}</td>`;
	output_sa += '<td>' + reusedQueries + '</td></tr>';
	output_sa += `<tr><td>- ${i18next.t('modified')}</td>`;
	output_sa += '<td>' + revisedQueries + '</td></tr>';
	output_sa += '</table>';

	output_sa += '<table style="margin-top: 1rem;">';
	output_sa += `<tr><td>${i18next.t('queries')}</td></tr>`;

	output_sa += '<tr><td><ul class="list">'
	unique_queries_final.forEach(item => {
		output_sa += '<li><a href="' + item.url + '" target="_blank">' + item.query + '</a></li>';
	});
	output_sa += '</ul></td></tr>'
	output_sa += '</table>';

	output_sa += '<table style="margin-top: 1.5rem; margin-bottom: 1rem;">';
	output_sa += `<tr><td>${i18next.t('search_engines')}</td></tr>`;

	output_sa += '<tr><td><ul class="list">'
	unique_searchEngines.forEach(item => {
		output_sa += '<li>' + (item.engine) + '</li>';
	});
	output_sa += '</ul></td></tr>'
	output_sa += '</table>';

	// Chatbots
	// -----------------------------------------------

	output_sc += `<span style="margin-bottom: 1rem; display: block;"><strong>${i18next.t('chatbots')}</strong></span>`;
	output_sc += '<hr/ style="border: 0.1px solid #ccc">'

	output_sc += '<table style="margin-bottom: 1.5rem;">';

	if (unique_chatbotSort.length > 0) {
		output_sc += '<tr><td><ul class="list">'
		unique_chatbotSort.forEach(item => {
			output_sc += '<li><a href="https://' + item.chatbot + '" target="_blank">' + item.chatbot + '</a></li>'; //
		});
		output_sc += '</td></tr>'
	}
	else {
		output_sc += '<tr><td>'
		output_sc += `${i18next.t('no_chatbots')}`
		output_sc += '</td></tr>'
	}

	output_sc += '</table>';

	// Pages
	// -----------------------------------------------

	output_sb += `<span style="margin-bottom: 1rem; display: block;"><strong>${i18next.t('pages')}</strong></span>`;
	output_sb += '<hr/ style="border: 0.1px solid #ccc">'

	output_sb += '<table style="margin-bottom: 1.5rem;">';
	output_sb += `<tr><td>- ${i18next.t('new_m')}</td>`;
	output_sb += '<td>' + newDomains + '</td></tr>';

	output_sb += `<tr><td>- ${i18next.t('revisited')}`;
	output_sb += '<td>' + revisitedDomains + '</td></tr>';
	
	output_sb += `<tr><td>- ${i18next.t('total_pages')}`;
	output_sb += '<td>' + pages + '</td></tr>';

	output_sb += '</table>';

	output_sb += '<table style="margin-top: 1.5rem;">';
	output_sb += `<tr><td>${i18next.t('domains')}</td></tr>`;

	output_sb += '<tr><td><ul class="list">'
	unique_websitesSort.forEach(item => {
		output_sb += '<li><a href="' + item.url + '" target="_blank">' + item.domain + '</a></li>'; //
	});
	output_sb += '</ul></td></tr>'
	output_sb += '</table>';

	container_sa.innerHTML = output_sa;
	container_sb.innerHTML = output_sc;
	container_sc.innerHTML = output_sb;

	container_ta.innerHTML = output_ta;
	container_tb.innerHTML = output_tb;
	container_tc.innerHTML = output_tc;

	makeDurationChart('duration-chart-container', duration_data)
	resizeObserver.observe(document.getElementById('duration-chart-container'));
}	