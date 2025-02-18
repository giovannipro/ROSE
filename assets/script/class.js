function load_data() {

    const queryString = window.location.search;

	const urlParams = new URLSearchParams(queryString);
	const sourceValue = urlParams.get('source');
	const source = decodeURI(sourceValue);
    console.log(source)

    // source = http://127.0.0.1:5501/class/?source=http://127.0.0.1:5501/assets/data/LME-1C_task_1_aggregated_stats.csv

    d3.csv(source)
		.then(loaded)
		.catch(function (error) {
			if (error.message.includes("404")) {
				console.log("Something went wrong with the data loading");
			}
			else {
				console.error("Data loading error:", error);
			}
		});

    function loaded(data) {
        console.log(data)

        load_list(data)

        const container = "#plot_box";
		let window_w = document.getElementById("plot_box").offsetWidth;
		window_h = 500; // document.getElementById("plot_box").offsetHeight;

        let margin = { top: 10, left: 0, bottom: 20, right: 0 },
			width = window_w - (margin.right + margin.right),
			height = window_h - (margin.top + margin.bottom);

        let svg = d3.select(container)
            .append("svg")
            .attr("width", window_w + (margin.right + margin.right))
            .attr("height", height + (margin.top + margin.bottom))
            .attr("id", "svg_main");

        let plot = svg.append("g")
            .attr("id", "plot_main")
            .attr("transform", "translate(" + margin.right + "," + margin.top + ")");

        // Get max 
        const max_x = d3.max(data, d => +d.S_ResultDomain_New);
        const max_y = d3.max(data, d => +d.S_Queries_New);
        console.log(max_x, max_y)

        // Scales for x and y axes
        const xScale = d3.scaleLinear()
            .domain([0, max_x])
            .range([margin.left + 30, width - margin.right - 30]);

        const yScale = d3.scaleLinear()
            .domain([0, max_y])
            .range([height - margin.bottom, margin.top]);

        // Create axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        let axis = plot.append("g")
            .attr("class","axis")

        // Append X axis
        axis.append("g")
           .attr("transform", `translate(0, ${height - margin.bottom})`)
           .call(xAxis)
           .append("text")
           .attr("class", "axis-label")
           .attr("x", width / 2)
           .attr("y", 40)
           .attr("fill", "black")
           .text("new websites");

        // Append Y axis
        axis.append("g")
           .attr("transform", `translate(${margin.left + 30}, 0)`)
           .call(yAxis)
           .append("text")
           .attr("class", "axis-label")
           .attr("transform", "rotate(-90)")
           .attr("x", -height / 2)
           .attr("y", 20)
           .attr("fill", "black")
           .text("new queries");

        // Plot points
        let circles = plot.append("g")
            .attr("class","circles")

        circles.selectAll("circle")
           .data(data)
           .enter()
           .append("circle")
           .attr("cx", d => xScale(+d.S_ResultDomain_New))
           .attr("cy", d => yScale(+d.S_Queries_New))
           .attr("r", 5)
           .attr("fill", "blue");

        const sortedX = data.map(d => +d.S_ResultDomain_New).sort(d3.ascending);
        const sortedY = data.map(d => +d.S_Queries_New).sort(d3.ascending);

        percentiles = [25, 50, 75]

        // percentiles
        let percentiles_box = plot.append("g")
            .attr("class","percentiles")

        for (perc of percentiles){
            normalized = perc / 100

            const p_indexX = Math.floor(normalized * sortedX.length); 
            const p_indexY = Math.floor(normalized * sortedY.length); 
            const pX = sortedX[p_indexX];
            const pY = sortedY[p_indexY];
            console.log(pX, pY)
    
            const squareSize = 20;
    
            percentiles_box.append("rect")
                .attr("x", xScale(pX))
                .attr("y", yScale(pY) - squareSize)  // Adjust to fit coordinate system
                .attr("width", squareSize)
                .attr("height", squareSize)
                .attr("fill", "red")
                // .attr("opacity", 0.5);
    
            // Add text label
            percentiles_box.append("text")
                .attr("x", xScale(pX) + 3)
                .attr("y", yScale(pY) - 3)
                .attr("fill", "black")
                .attr("font-size", "12px")
                .text(perc);
        }
    }
}
load_data()

function load_list(data){
    const container = document.getElementById("student_list");
    let items = ''

    for (item of data){
        console.log(item)

        items += `
            <li>
                <span>id: ${item.user_id}</span>
                <span>duration: ${item.S_Duration}</span>
            </li>
            <hr/>
        `

    }
    container.innerHTML = items
}