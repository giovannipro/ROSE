const bubble_size = 10;

function load_data() {

    const queryString = window.location.search;

	const urlParams = new URLSearchParams(queryString);
	const sourceValue = urlParams.get('source');
	const source = decodeURI(sourceValue);
    console.log(source)

    // source = http://127.0.0.1:5501/class/?source=http://127.0.0.1:5501/assets/data/LU-INF1_task_6_aggregated_stats.csv

    d3.csv(source)
		.then(loaded)
        .then(highlight)
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
        
        const container = "#plot_class";
		let window_w = document.getElementById("plot_class").offsetWidth;
		window_h = document.getElementById("plot_class").offsetHeight;

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
        // console.log(max_x, max_y)

        // Scales for x and y axes
        const xScale = d3.scaleLinear()
            .domain([0, max_x])
            .range([margin.left + 30, width - margin.right - 30])
            

        const yScale = d3.scaleLinear()
            .domain([0, max_y])
            .range([height - margin.bottom, margin.top])

        // create percentiles
        make_percentiles()

        // Create axes
        const xAxis = d3.axisBottom(xScale)
            .ticks(3)
            .tickFormat(d3.format("d"))

        const yAxis = d3.axisLeft(yScale)
            .ticks(3)
            .tickFormat(d3.format("d"))

        let axis = plot.append("g")
            .attr("class","axis")

        // Append X axis
        let x_Axis = axis.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
           .call(xAxis)
        
        let x_Axis_group = x_Axis.append("g")

        x_Axis_group.append("text")
           .attr("class", "axis-label")
           .attr("x", width - 80)
           .attr("y", -18)
           .attr("fill", "black")
           .text("new websites");

        x_Axis_group.append("rect")
           .attr("x",width - 130)
           .attr("y",-25)
           .attr("width",10)
           .attr("height",10)
           .attr("fill","#ff9100")

        // Append Y axis
        let y_Axis = axis.append("g")
           .attr("transform", `translate(${margin.left + 30}, 0)`)
           .call(yAxis)

        let y_Axis_group = y_Axis.append("g")

        y_Axis_group.append("rect")
            .attr("x",10)
            .attr("y",20)
            .attr("width",10)
            .attr("height",10)
            .attr("fill","#619ED4")

        y_Axis_group.append("text")
           .attr("class", "axis-label")
           .attr("x",80)
           .attr("y",30)
           .attr("dy",-2)
           .attr("fill", "black")
           .text("new queries");

        // Plot points
        let circles = plot.append("g")
            .attr("class","circles")

        circles.selectAll("circle")
           .data(data)
           .enter()
           .append("circle")
           .attr("id", d => "bubble_" + d.user_id)
           .attr("class", "bubble")
           .attr("cx", d => xScale(+d.S_ResultDomain_New))
           .attr("cy", d => yScale(+d.S_Queries_New))
           .attr("r", bubble_size)
           .attr("fill", "gray")
           .attr("opacity",0.25)

        function make_percentiles(){

            percentiles = [25, 50, 75]

            const sortedX = data.map(d => +d.S_ResultDomain_New).sort(d3.ascending);
            const sortedY = data.map(d => +d.S_Queries_New).sort(d3.ascending);

            // percentiles
            let percentiles_box = plot.append("g")
                .attr("class","percentiles")
    
            for (perc of percentiles){
                normalized = perc / 100
    
                const p_indexX = Math.floor(normalized * sortedX.length); 
                const p_indexY = Math.floor(normalized * sortedY.length); 
                const pX = sortedX[p_indexX];
                const pY = sortedY[p_indexY];
                // console.log(pX, pY)

                let percentile_box = percentiles_box.append("g")
                
                percentile_box.append("rect")
                    .attr("x", xScale(0) + 5)
                    .attr("y", yScale(pY) - 15)
                    .attr("width", 70)
                    .attr("height", 12)
                    .attr("fill", "white")
                    // .attr("opacity", 0.5);

                // horizontal line
                percentile_box.append("line")
                    .attr("x1", xScale(0))
                    .attr("y1", yScale(pY))
                    .attr("x2", xScale(pX))
                    .attr("y2", yScale(pY))
                    .attr("stroke", "#ccc")
                    .attr("stroke-width", 1)
                    .attr("stroke-dasharray","5,5")
    
                // vertical line
                percentile_box.append("line")
                    .attr("x1", xScale(pX))
                    .attr("y1", yScale(0))
                    .attr("x2", xScale(pX))
                    .attr("y2", yScale(pY))
                    .attr("stroke", "#ccc")
                    .attr("stroke-width", 1)
                    .attr("stroke-dasharray","5,5")
        
                // Add text label
                percentile_box.append("text")
                    .attr("x", xScale(0) + 5)
                    .attr("y", yScale(pY) - 5)
                    .attr("fill", "gray")
                    .attr("font-size", "10px")
                    .text((perc-25) + ' - ' + (perc - 1));
            }

            let percentile_box = percentiles_box.append("g")

            // horizontal line 100%
            percentile_box.append("line")
                .attr("x1", xScale(0))
                .attr("y1", yScale(max_y))
                .attr("x2", xScale(max_x))
                .attr("y2", yScale(max_y))
                .attr("stroke", "#ccc")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray","5,5")
            
            // vertical line 100%
            percentile_box.append("line")
                .attr("x1", xScale(max_x))
                .attr("y1", yScale(max_y))
                .attr("x2", xScale(max_x))
                .attr("y2", yScale(0))
                .attr("stroke", "#ccc")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray","5,5")

            // Add text label 100%
            percentile_box.append("text")
                .attr("x", xScale(0) + 5)
                .attr("y", yScale(max_y) - 5)
                .attr("fill", "gray")
                .attr("font-size", "10px")
                .text(percentiles[percentiles.length - 1] + ' - ' + 100);
        }
    }
}
load_data()

function load_list(data){
    const container = document.getElementById("student_list");
    let items = ''

    const max_duration = d3.max(data, d => +d.S_Duration_GloAvg)
    console.log(max_duration)

    // sorting options
    duration_sort = data.sort((a,b) => {
        return +b.S_Duration_GloAvg - +a.S_Duration_GloAvg
    })

    search_sort = data.sort((a,b) => {
        return +b.S_Duration_ReaAvg - +a.S_Duration_ReaAvg
    })

    page_sort = data.sort((a,b) => {
        return +b.S_Duration_SeaAvg - +a.S_Duration_SeaAvg
    })
    
    for (item of duration_sort){
        
        let the_duration_chart = duration_chart(+item.S_Duration_SeaAvg, +item.S_Duration_ResAvg)

        const duration = parseFloat(item.S_Duration_GloAvg)
        const max_width = 100 * duration / max_duration
        // console.log(duration,max_width)

        items += `
            <li class="student_item" id="${item.user_id}">
                <span>id: ${item.user_id}</span><br/>
                <div style="width: calc(${max_width}% - 5%)">
                    ${the_duration_chart}
                </div>
            </li>
        `
    }
    container.innerHTML = items
}

function highlight(){

    const items = document.querySelectorAll('.student_item')
    const bubbles = document.querySelectorAll('.bubble')
    // console.log(bubbles)

    items.forEach(item => {
        item.addEventListener("click", (e) => {
            const id = item.id;

            // reset the list item border 
            items.forEach(item => {
                item.style.borderLeft = "3px solid transparent"
            })

            // highlight the list item border 
            the_item = document.getElementById(id)
            the_item.style.borderLeft = "3px solid red"
            // console.log(the_item)

            // reset bubble style
            bubbles.forEach(bubble => {
                bubble.style.fill = "gray";
                bubble.style.opacity = 0.2;
            });

            // highlight bubble
            const bubble = document.getElementById("bubble_" + id);
            if (bubble) {
                bubble.style.fill = "red"
                bubble.style.opacity = 1;
            }
        })
    })
}
