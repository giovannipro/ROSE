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

    container.style.width = '96%';
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