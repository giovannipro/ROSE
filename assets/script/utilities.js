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
	const min = parseFloat((seconds / 60).toFixed(1))

	return min
}
