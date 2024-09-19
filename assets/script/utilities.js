function getTextAfterX(query,x) {
  const index = query.indexOf(x);

  if (index !== -1) {
	return query.substring(index + 2);
  }

  return "";
}

function groupConsecutiveDomains(data) {
	data = data.filter(d => d.page_type == 'RESULT')

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

		currentGroup.push(currentItem);
  	}

  	// Add the last group if it's not empty
  	if (currentGroup.length > 0) {
		groupedData.push(currentGroup);
  	}

  	return groupedData;
}

function convertSecondsToMinutes(seconds){
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;

	const formattedMinutes = (minutes < 10 ? "0" : "") + minutes;
	const formattedSeconds = (remainingSeconds < 10 ? "0" : "") + parseInt(remainingSeconds);

  	const time = formattedMinutes + ':' + formattedSeconds
	return time
}

function getUniqueValues(values) {
	const uniqueValuesSet = new Set(values);
	return Array.from(uniqueValuesSet);
}

function short_url(url,max){
	if (url.length > max){
		shortUrl = url.slice(0,max) + '...'
	}
	else {
		shortUrl = url
	}
	return shortUrl
}