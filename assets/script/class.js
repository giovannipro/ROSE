const bubble_size = 12;
const bubble_default_opacity = 0.5;
let the_data;
const t_duration = 100;

let svg, plot, xScale, yScale;
let width, height, margin;

function load_data() {

    const queryString = window.location.search;

	const urlParams = new URLSearchParams(queryString);
	const sourceValue = urlParams.get('source');
	const source = decodeURI(sourceValue);
    console.log(source)

    // http://127.0.0.1:5501/?source=http://127.0.0.1:5501/assets/data/class/LU-INF1_task_5_aggregated_stats.csv

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
        
        document.getElementById("the_class").innerHTML = "?"
        document.getElementById("the_task").innerHTML = data[0].task_id;

        load_list(data, 'total')

        function createChart() {
            const container = "#container";
            let window_w = document.getElementById("container").offsetWidth;
            window_h = document.getElementById("container").offsetHeight;
        
            margin = { top: 40, left: 10, bottom: 20, right: 10 };
            width = window_w - (margin.right + margin.right);
            height = window_h - (margin.top + margin.bottom);
        
            d3.select("#svg_main").remove();
        
            // Set the global svg variable
            svg = d3.select(container)
                .append("svg")
                .attr("width", window_w + (margin.right + margin.right))
                .attr("height", height + (margin.top + margin.bottom))
                .attr("id", "svg_main");
        
            // Set the global plot variable
            plot = svg.append("g")
                .attr("id", "plot_main")
                .attr("transform", "translate(" + margin.right + "," + margin.top + ")");
        
            // Get max 
            const max_x = d3.max(data, d => d.S_Queries_New);
            const max_y = d3.max(data, d => d.S_ResultDomain_New);
        
            // Set the global scale variables
            xScale = d3.scaleLinear()
                .domain([0, max_x])
                .range([margin.left + 30, width - margin.right - 30]);
                
            yScale = d3.scaleLinear()
                .domain([0, max_y])
                .range([height - margin.bottom, margin.top]);
        
            make_grid();
            make_axis();
            updateBubbles();
        }

        function make_axis() {
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
            
            let x_Axis_group_position = width - 130
            let x_Axis_group = x_Axis.append("g")
                .attr("transform", `translate(${x_Axis_group_position}, -20)`)
    
            x_Axis_group.append("text")
               .attr("class", "axis-label")
               .attr("x", 15)
               .attr("y", 10)
               .attr("dy", -2)
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
                .attr("transform", "translate(10,50)")
    
            y_Axis_group.append("rect")
                .attr("width",10)
                .attr("height",10)
                .attr("fill","#ff9100")
    
            y_Axis_group.append("text")
                .attr("class", "axis-label")
                .attr("x", 15)
                .attr("y", 10)
                .attr("dy", -2)
                .attr("fill", "black")
                .attr("text-anchor", "start")
                .text("unique pages");
        }

        window.addEventListener('resize', debounce(() => {
            createChart();
        }, 500));
        
        createChart();
        
        // Add a debounce function to prevent too many resize events
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        function updateBubbles() {

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
                .attr("opacity",bubble_default_opacity)
                .attr("fill", "gray")
                .attr("r", 0)
                .transition()
                .duration(t_duration)
                .delay((d,i) => 200 + i * t_duration)
                .attr("r", bubble_size * 1.2)
                .transition()
                .duration(t_duration)
                .attr("r", bubble_size)
                .on("end", function(d, i) {
                    if (i === data.length - 1) {
                        // Add labels after all circles are drawn
                        const labels = plot.append("g")
                            .attr("class", "labels");
            
                        // Group data points by position to handle overlapping
                        const positionGroups = d3.group(data, 
                            d => `${xScale(d.S_Queries_New)},${yScale(d.S_ResultDomain_New)}`
                        );
            
                        positionGroups.forEach((group, position) => {
                            const [x, y] = position.split(",").map(Number);
                            
                            group.forEach((d, i) => {
                                const offset = i * 15;
                                
                                labels.append("text")
                                    .attr("class", "bubble-label")
                                    .attr("id", "label_" + d.user_id)
                                    .attr("x", x)
                                    .attr("y", y - 20 - offset)
                                    .attr("text-anchor", "middle")
                                    .attr("fill", "black")
                                    .attr("font-size", "12px")
                                    .attr("opacity", 0)
                                    .text(d.user_id)
                                    .on("click", label_highlight)
                                    .transition()
                                    .duration(500)
                                    .attr("opacity", 0.7)
                            });
                        });
                    }
                });
        }

        function label_highlight(event, d) {
            
            const target = event.target.id
            const userId = target.replace('label_','')
            const listItem = document.getElementById(userId);
            
            // Reset all items
            document.querySelectorAll('.student_item').forEach(item => {
                item.style.borderLeft = "3px solid transparent";
            });
            document.querySelectorAll('.student_more').forEach(more => {
                more.style.display = "none";
            });
            document.querySelectorAll('.bubble').forEach(bubble => {
                bubble.style.stroke = "transparent";
                bubble.style.opacity = bubble_default_opacity;
                bubble.style.fillOpacity = 1;
            });
            d3.selectAll(".bubble-label").style("fill", "black");

            // Highlight selected items
            listItem.style.borderLeft = "3px solid red";
            document.getElementById(userId + '_more').style.display = "block";
            const bubble = document.getElementById("bubble_" + userId);
            bubble.style.stroke = "red";
            bubble.style.strokeWidth = 3;
            bubble.style.opacity = 1;
            bubble.style.fillOpacity = 0.2;
            
            // Highlight label
            d3.select(this)
                .style("fill", "red")
                .style("opacity", 1);

            // Scroll list item into view
            listItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        function make_grid() {

            const max_x = d3.max(data, d => d.S_Queries_New);
            const max_y = d3.max(data, d => d.S_ResultDomain_New);
            
            grid_box = plot.append("g")
                .attr("class", "grid_box")

            // Add X gridlines
            grid_box.append("g")
                .attr("class", "grid x-grid")
                .attr("transform", `translate(0,${height - margin.bottom})`)
                    .call(d3.axisBottom(xScale)
                        .ticks(max_x)
                        .tickSize(-height + margin.top + margin.bottom)
                        .tickFormat("")
                    )
                .attr("stroke-dasharray","5,5")
                .style("opacity", 0.2); 
                
            // Add Y gridlines
            grid_box.append("g")
                .attr("class", "grid y-grid")
                .attr("transform", `translate(${margin.left + 30},0)`)
                .call(d3.axisLeft(yScale)
                    .ticks(max_y)
                    .tickSize(-(width - margin.left - margin.right - 60))
                    .tickFormat("")
                )
                .attr("stroke-dasharray","5,5")
                .attr("stroke-width", 1)
                .style("opacity", 0.2); 
            }
    }
}
load_data()

function load_list(data, sort){
    const container = document.getElementById("student_list");
    let items = ''

    const max_duration = d3.max(data, d => d.Que_Pag)

    // sorting options
    const duration_sort = data.slice().sort((a,b) => b.Que_Pag - a.Que_Pag)
    const queries_sort = data.slice().sort((a,b) => b.queries_duration - a.queries_duration)
    const page_sort = data.slice().sort((a,b) => b.pages_duration - a.pages_duration)
    const alphabetical_sort = data.slice().sort((a,b) => String(a.user_id).localeCompare(String(b.user_id)));
    
    let sorted_dataset;
    if (sort == 'queries'){
        sorted_dataset = queries_sort
    }
    else if (sort == 'pages'){
        sorted_dataset = page_sort
    }
    else if (sort == 'name'){
        sorted_dataset = alphabetical_sort;
    }
    else {
        sorted_dataset = duration_sort
    }

    sorted_dataset.forEach((item, index) => {
        setTimeout(() => {
            const total_duration = convertSecondsToMinutes(item.queries_duration + item.pages_duration)
            const queries_duration = convertSecondsToMinutes(item.queries_duration)
            const pages_duration = convertSecondsToMinutes(item.pages_duration)
            const bar_width = ( (item.queries_duration + item.pages_duration) / max_duration) * 100;

            const the_duration_chart = duration_chart(item.queries_duration, item.pages_duration, bar_width)
            

            // link to the student page ---------------- 
            const student_page = "../?source=assets/data/search_story_task_5_user_1015.csv"
            // ------------------------------------------ 

            items += `
                <li class="student_item" id="${item.user_id}">
                    <div class="inside">
                        <div class="item_data">
                            <div>
                                <span>${item.user_id}</span>
                            </div>
                            <div style="color: #a2a2a2; font-size: 0.8rem; display: flex; justify-content: space-between; width: 3.5rem;">
                                <div>
                                    ${total_duration}
                                </div>
                                <div>
                                    <a href="${student_page}" target="blank" class="arrow_link">&rarr;</a>
                                </div>
                            </div>
                        </div>
                        <div style="width: ${bar_width}%; margin-top: 0.25rem;">
                            ${the_duration_chart}
                        </div>
                        <div id="${item.user_id}_more" class="student_more" style="color: #a2a2a2; font-size: 0.8rem;">
                            <div class="student_more_box">
                                <div>
                                    <div>queries: </div>
                                    <div style="justify-content: flex-end;" data-log="S_Queries_New">${item.S_Queries_New} / ${queries_duration}</div>
                                </div>
                                <div>
                                    <div>domains: </div>
                                    <div style="justify-content: flex-end;" data-log="?">${item.S_ResultDomain_New}</div>
                                </div>
                                <div>
                                    <div>pages: </div>
                                    <div style="justify-content: flex-end;" data-log="S_ResultDomain_New">${item.S_ResultDomain_New} / ${pages_duration}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            `

            container.innerHTML = items
            
            if (index === sorted_dataset.length - 1) {
                highlight();
            }
            
        }, index * 100);
                        
    }) 
}

function resort_list(){
    const sortSelect = document.getElementById('get_sort');

    document.getElementById('get_sort').addEventListener('change', () => {
        sortValue = sortSelect.value;
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
            border_size = "4px"

            // reset the list item border 
            items.forEach(item => {
                item.style.borderLeft = border_size + " solid transparent";
            });

            // highlight the list item border 
            const the_item = document.getElementById(id);
            const more_info = document.getElementById(id + '_more');
            the_item.style.borderLeft = border_size + " solid red";
            
            more_items.forEach(more => {
                more.style.display = "none";
            });
            
            // reset bubble style
            bubbles.forEach(bubble => {
                bubble.style.stroke = "transparent";
                bubble.style.opacity = bubble_default_opacity;
                bubble.style.fillOpacity = 1;
            });

            svg.selectAll(".bubble-label").style("fill", "black");
            
            // highlight bubble
            more_info.style.display = "block";

            const bubble = document.getElementById("bubble_" + id);
            const label_id = document.getElementById("label_" + id);

            if (bubble) {
                bubble.style.stroke = "red";
                bubble.style.strokeWidth = 3;

                bubble.style.opacity = 1;
                bubble.style.fillOpacity = 0.2;

                label_id.style.opacity = 1;
                label_id.style.fill = "red";
            }
        });
    });
}