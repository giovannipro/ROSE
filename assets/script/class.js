const bubble_size = 12;
const bubble_default_opacity = 0.2;
let the_data;

function load_data() {

    const queryString = window.location.search;

	const urlParams = new URLSearchParams(queryString);
	const sourceValue = urlParams.get('source');
	const source = decodeURI(sourceValue);
    console.log(source)

    // http://127.0.0.1:5501/class/?source=http://127.0.0.1:5501/assets/data/class/LU-INF1_task_5_aggregated_stats.csv

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

        document.getElementById("the_class").innerHTML = "?"
		document.getElementById("the_task").innerHTML = data[0].task_id;

        data.forEach(item => {
            item.user_id = +item.user_id
            item.S_Queries_New = +item.S_Queries_New
            item.S_ResultDomain_New = +item.S_ResultDomain_New
            // item.S_ResultDomain_New = +item.S_ResultDomain_New
            
            item.S_Duration_Net = +item.S_Duration_Net
            item.S_Duration_ResAvg = +item.S_Duration_ResAvg
            item.S_Duration_SeaAvg = +item.S_Duration_SeaAvg

            item.queries_duration = item.S_Duration_SeaAvg * item.S_Actions_Sea
            item.pages_duration = item.S_Duration_ResAvg * item.S_Actions_Res
            item.Que_Pag = item.queries_duration + item.pages_duration
            // console.log(item.S_Queries_New)
        })

        the_data = data
        load_list(data, 'total')
        
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
        const max_x = d3.max(data, d => d.S_Queries_New);
        const max_y = d3.max(data, d => d.S_ResultDomain_New);
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
        
        let x_Axis_group_position = width - 120
        let x_Axis_group = x_Axis.append("g")
        .attr("transform", `translate(${x_Axis_group_position},-20)`)

        x_Axis_group.append("text")
           .attr("class", "axis-label")
           .attr("x", 15)
           .attr("y", 10)
           .attr("fill", "black")
           .attr("text-anchor", "start")
           .text("unique queries");

        x_Axis_group.append("rect")
           .attr("width",10)
           .attr("height",10)
           .attr("fill","#619ED4")

        // Append Y axis
        let y_Axis = axis.append("g")
           .attr("transform", `translate(${margin.left + 30}, 0)`)
           .call(yAxis)

        let y_Axis_group = y_Axis.append("g")
            .attr("transform", "translate(10,20)")

        y_Axis_group.append("rect")
            .attr("width",10)
            .attr("height",10)
            .attr("fill","#ff9100")

        y_Axis_group.append("text")
            .attr("x", 15)
            .attr("y", 10)
            .attr("class", "axis-label")
            .attr("dy",-2)
            .attr("fill", "black")
            .attr("text-anchor", "start")
            .text("unique pages");

        // Plot points
        let circles = plot.append("g")
            .attr("class","circles")

        circles.selectAll("circle")
           .data(data)
           .enter()
           .append("circle")
           .attr("id", d => "bubble_" + d.user_id)
           .attr("class", "bubble")
           .attr("cx", d => xScale(d.S_Queries_New))
           .attr("cy", d => yScale(d.S_ResultDomain_New))
           .attr("r", bubble_size)
           .attr("fill", "gray")
           .attr("opacity",bubble_default_opacity)

        function make_percentiles(){

            percentiles = [25, 50, 75]

            const sortedX = data.map(d => d.S_Queries_New).sort(d3.ascending);
            const sortedY = data.map(d => d.S_ResultDomain_New).sort(d3.ascending);

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

function load_list(data, sort){
    const container = document.getElementById("student_list");
    let items = ''

    const max_duration = d3.max(data, d => d.Que_Pag)
    // console.log(max_duration)

    // sorting options
    const duration_sort = data.slice().sort((a,b) => {
        return b.Que_Pag - a.Que_Pag
    })

    const queries_sort = data.slice().sort((a,b) => {
        return b.queries_duration - a.queries_duration
    })
    
    const page_sort = data.slice().sort((a,b) => {
        return b.pages_duration - a.pages_duration
    })
    
    let sorted_dataset;
    if (sort == 'queries'){
        sorted_dataset = queries_sort
    }
    else if (sort == 'pages'){
        sorted_dataset = page_sort
    }
    else {
        sorted_dataset = duration_sort
    }

    sorted_dataset.forEach(item => {
        // console.log(item.user_id, item.queries_duration, item.pages_duration)
        
        const the_duration_chart = duration_chart(item.queries_duration, item.pages_duration)
        const total_duration = convertSecondsToMinutes(item.queries_duration + item.pages_duration)

        const bar_width = ( (item.queries_duration + item.pages_duration) / max_duration) * 100;

        items += `
            <li class="student_item" id="${item.user_id}">
                <div class="inside">
                    <div class="item_data">
                        <div>id: ${item.user_id}</div>
                        <div style="color: #a2a2a2; font-size: 0.8rem;">(${total_duration})</div>
                    </div>
                    <div style="width: ${bar_width}%">
                        ${the_duration_chart}
                    </div>
                    <div id="${item.user_id}_more" class="student_more" style="color: #a2a2a2; font-size: 0.8rem;">
                        <div class="student_more_box">
                            <div>
                                <div>queries</div>
                                <div style="justify-content: flex-end;" data-log="S_Queries_New">${item.S_Queries_New}</div>
                            </div>
                            <div>
                                <div>domains</div>
                                <div style="justify-content: flex-end;" data-log="?">?</div>
                            </div>
                            <div>
                                <div>pages</div>
                                <div style="justify-content: flex-end;" data-log="S_ResultDomain_New">${item.S_ResultDomain_New}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        `
    })
    
    container.innerHTML = items

}

function resort_list(){
    const sortSelect = document.getElementById('get_sort');

    document.getElementById('get_sort').addEventListener('change', () => {
        sortValue = sortSelect.value;
        // console.log(the_data)

        load_list(the_data, sortValue)
        highlight()
    });
}
resort_list()

function highlight() {
    const items = document.querySelectorAll('.student_item');
    const more_items = document.querySelectorAll('.student_more');
    const bubbles = document.querySelectorAll('.bubble');
    const svg = d3.select("#plot_main");

    items.forEach(item => {
        item.addEventListener("click", (e) => {
            const id = item.id;

            // reset the list item border 
            items.forEach(item => {
                item.style.borderLeft = "3px solid transparent";
            });

            // highlight the list item border 
            const the_item = document.getElementById(id);
            const more_info = document.getElementById(id + '_more');
            the_item.style.borderLeft = "3px solid red";
            
            more_items.forEach(more => {
                more.style.display = "none";
            });
            
            // reset bubble style
            bubbles.forEach(bubble => {
                bubble.style.stroke = "transparent";
                bubble.style.opacity = bubble_default_opacity;
                bubble.style.fillOpacity = 1;
            });

            svg.selectAll(".bubble-label").remove();
            
            // highlight bubble
            more_info.style.display = "block";

            const bubble = document.getElementById("bubble_" + id);
            if (bubble) {
                bubble.style.stroke = "red";
                bubble.style.strokeWidth = 3;

                bubble.style.opacity = 1;
                bubble.style.fillOpacity = 0.2;

                // Get the position of the clicked bubble
                const cx = bubble.getAttribute("cx");
                const cy = bubble.getAttribute("cy");

                // Find and display labels for all elements in the scatterplot that have the same position
                const matchingBubbles = Array.from(bubbles).filter(b => b.getAttribute("cx") === cx && b.getAttribute("cy") === cy);
                const labelPositions = [];

                matchingBubbles.forEach((matchingBubble, index) => {
                    const matchingId = matchingBubble.id.replace("bubble_", "");
                    const matchingData = the_data.find(d => d.user_id == matchingId);

                    let labelY = cy - 20 - (index * 15); // Adjust the position above the bubble

                    // Check for overlapping labels and adjust position
                    while (labelPositions.some(pos => Math.abs(pos - labelY) < 15)) {
                        labelY -= 15;
                    }
                    labelPositions.push(labelY);

                    
                    let color = "black"
                    
                    if (id == matchingBubble.id.replace("bubble_","") ){
                        color = "red"
                        console.log(matchingBubble.id)
                    }
                    
                    svg.append("text")
                        .attr("class", "bubble-label")
                        .attr("x", cx)
                        .attr("y", labelY)
                        .attr("text-anchor", "middle")
                        .attr("fill", color)
                        .attr("font-size", "12px")
                        .text(`ID: ${matchingData.user_id}`);
                });
            }
        });
    });
}