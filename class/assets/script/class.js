const bubble_size = 12;
const bubble_default_opacity = 0.5;
let the_data;
const t_duration = 100;

let svg, plot, xScale, yScale;
let width, height, margin;

const min_x = 8;
const min_y = 8;

function load_data() {

    const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	const clazz_id = urlParams.get('clazz_id');
    const task_id = urlParams.get('task_id');
    // const lang = urlParams.get('lang');

	// const apiEndpoint_class = `assets/data/${clazz_id}_task_${task_id}_aggregated_stats.csv`
    const apiEndpoint_class = `https://search.rose.education/api/analytics/aggregated-stories-extraction?clazz_id=${clazz_id}&task_id=${task_id}`
    const apiEndpoint_classInfo = `https://search.rose.education/api/dashboard/clazzes/${clazz_id}`
    const apiEndpoint_taskInfo = `https://search.rose.education/api/dashboard/tasks/${task_id}`
    const apiEndpoint_recapInfo = `https://search.rose.education/api/analytics/url-stats/summary?clazz_id=${clazz_id}&task_id=${task_id}`

    // url = http://127.0.0.1:5501/class/index.html?clazz_id=LME-1C&task_id=1 
    // console.log(clazz_id,task_id)

    Promise.all([
        d3.csv(apiEndpoint_class),
        d3.json(apiEndpoint_classInfo),
        d3.json(apiEndpoint_taskInfo),
        d3.json(apiEndpoint_recapInfo)
    ])
    .then(([classData, classInfo, taskInfo, recapInfo]) => {
        // console.log(recapInfo)
        // console.log(classData)
        
        classData.forEach(item => {
            // console.log(item)

            item.user_id = +item.user_id;
            item.S_Queries_New = +item.S_Queries_New;
            item.S_ResultDomain_New = +item.S_ResultDomain_New;
            item.S_Duration_Net = +item.S_Duration_Net;
            item.S_Duration_ResAvg = +item.S_Duration_ResAvg;
            item.S_Duration_SeaAvg = +item.S_Duration_SeaAvg;
            item.queries_duration = item.S_Duration_SeaAvg * item.S_Actions_Sea;
            item.pages_duration = item.S_Duration_ResAvg * item.S_Actions_Res;
            item.Que_Pag = item.queries_duration + item.pages_duration;
        });
        // console.log(classData)

        // Store both datasets
        the_data = classData;
        the_classInfo = classInfo;
        the_date = formatDate(classData[0].S_Start_Time);

        document.getElementById("the_class").innerHTML = classInfo.name; //clazz_id;
        document.getElementById("the_task").innerHTML = `${taskInfo.title} (id: ${task_id})`;
        document.getElementById("the_date").innerHTML = the_date;
        document.getElementById("n_stories").innerHTML = classData.length;

        // Initialize visualizations with both datasets
        loaded(classData)
        load_list(classData, 'total');
        highlight();

        // statistics
        load_statistics(recapInfo)
        open_tabs('statistics_container','');
    })
    .catch(function (error) {
        if (error.message.includes("404")) {
            console.log("Something went wrong with the data loading");
        } 
        else {
            console.error("Data loading error:", error);
        }
        no_data()
    });

    function loaded(data) {

        function createChart() {
            const container = "#container";
            let window_w = document.getElementById("container").offsetWidth;
            window_h = document.getElementById("container").offsetHeight;
        
            margin = { top: 40, left: 10, bottom: 20, right: 20 };
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

            the_max_x = min_x
            if (max_x > min_x) {
                the_max_x = max_x
            }

            the_max_y = min_y
            if (max_y > min_y) {
                the_max_y = max_y
            }
        
            // Set the global scale variables
            xScale = d3.scaleLinear()
                .domain([0, the_max_x])
                .range([margin.left + 30, width - margin.right - 30]);
                
            yScale = d3.scaleLinear()
                .domain([0, the_max_y])
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
            
            let x_Axis_group_position = width - 180
            let x_Axis_group = x_Axis.append("g")
                .attr("transform", `translate(${x_Axis_group_position}, -20)`)
            
            let uniqueQueries = i18next.t('uniqueQueries')
            x_Axis_group.append("text")
               .attr("class", "axis-label")
               .attr("x", 15)
               .attr("y", 10)
               .attr("dy", -2)
               .attr("fill", "black")
               .attr("text-anchor", "start")
               .text(uniqueQueries);
    
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
    
            let uniquePages = i18next.t('uniquePages')
            y_Axis_group.append("text")
                .attr("class", "axis-label")
                .attr("x", 15)
                .attr("y", 10)
                .attr("dy", -2)
                .attr("fill", "black")
                .attr("text-anchor", "start")
                .text(uniquePages);
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
                            const shift = group.length * 10
                            // console.log(group.length, shift)
                            
                            let the_group = labels.append("g")
                                .attr("transform", `translate(${x + 20}, ${y + (bubble_size/2) - (shift/2)})`)

                            group.forEach((d, i) => {
                                const offset = i * 15;
                                
                                // Find student in classInfo data
                                const student = the_classInfo.students.find(s => s.id === d.user_id);
                                const student_name_0 = student?.username || `#${d.user_id}`;
                                const student_name = student_name_0.split('#')[0];
                                // console.log(i, offset, student_name)

                                the_group.append("text")
                                    .attr("class", "blabel")
                                    .attr("id", "label_" + d.user_id)
                                    .attr("y", offset)
                                    .attr("text-anchor", "left")
                                    .attr("fill", "black")
                                    .attr("font-size", "12px")
                                    .attr("opacity", 0)
                                    .text(student_name)
                                    .on("click", label_highlight)
                                    .transition()
                                    .duration(500)
                                    .attr("opacity", 1)
                            });
                        });
                    }
                });
        }

        function label_highlight(event, d) {
            
            const target = event.target.id
            const userId = target.replace('label_','')
            const listItem = document.getElementById(userId);

            const bubbles = document.querySelectorAll('.bubble');
            
            // Reset all items
            document.querySelectorAll('.student_item').forEach(item => {
                item.style.borderLeft = "3px solid transparent";
            });
            document.querySelectorAll('.student_more').forEach(more => {
                more.style.display = "none";
            });
            // document.querySelectorAll('.bubble').forEach(bubble => {
            //     bubble.style.stroke = "transparent";
            //     bubble.style.opacity = bubble_default_opacity;
            //     bubble.style.fillOpacity = 1;
            // });
            
            bubbles.forEach(item => {
                item.style.stroke = "transparent";
                item.style.opacity = bubble_default_opacity;
                item.style.fillOpacity = 1;
            })

            d3.selectAll(".blabel")
                .attr("fill","black")
                .attr("opacity", 1);

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
                .attr("fill","red")
                .style("opacity", 1);

            // Scroll list item into view
            listItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        function make_grid() {

            const max_x = d3.max(data, d => d.S_Queries_New);
            const max_y = d3.max(data, d => d.S_ResultDomain_New);
            
            the_max_x = min_x
            if (max_x > min_x) {
                the_max_x = max_x
            }

            the_max_y = min_y
            if (max_y > min_y) {
                the_max_y = max_y
            }

            grid_box = plot.append("g")
                .attr("class", "grid_box")

            // Add X gridlines
            grid_box.append("g")
                .attr("class", "grid x-grid")
                .attr("transform", `translate(0,${height - margin.bottom})`)
                    .call(d3.axisBottom(xScale)
                        .ticks(the_max_x)
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
                    .ticks(the_max_y)
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
    // container.style.height = data.length * 3 + "rem";
    let items = ''

    const max_duration = d3.max(data, d => d.Que_Pag)

    // sorting options
    const duration_sort = data.slice().sort((a,b) => b.Que_Pag - a.Que_Pag)
    const queries_sort = data.slice().sort((a,b) => b.queries_duration - a.queries_duration)
    const page_sort = data.slice().sort((a,b) => b.pages_duration - a.pages_duration)
    const alphabetical_sort = data.slice().sort((a,b) => {
        const studentA = the_classInfo.students.find(s => s.id === a.user_id);
        const studentB = the_classInfo.students.find(s => s.id === b.user_id);
        const nameA = (studentA?.username || `#${a.user_id}`).toLowerCase();
        const nameB = (studentB?.username || `#${b.user_id}`).toLowerCase();
        return nameA.localeCompare(nameB);
    });
    
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
            const bar_width = (( (item.queries_duration + item.pages_duration) / max_duration) * 100);

            const the_duration_chart = duration_chart(item.queries_duration, item.pages_duration, bar_width, 'class')
            const user_id = item.user_id
            const task_id = item.task_id
            // const clazz_id = item.clazz_id

            const student = the_classInfo.students.find(s => s.id === item.user_id);
            const student_name_0 = student?.username || `#${item.user_id}`;
            const student_name = student_name_0.split('#')[0];
            // console.log(student, student_name)

            // link to the student page ---------------- 
            const student_page = `https://search.rose.education/dashboard?userId=${user_id}&taskId=${task_id}` // clazzId=${clazz_id}
            
            // ------------------------------------------ 

            items += `
                <li class="student_item" id="${item.user_id}">
                    <div class="inside">
                        <div class="item_data">
                            <div>
                                <span class="student_name">${student_name}</span>
                            </div>
                            <div style="color: #a2a2a2; font-size: 0.8rem; display: flex; justify-content: space-between; width: 3.5rem;">
                                <div>
                                    ${total_duration}
                                </div>
                                <div>
                                    <a href="${student_page}" target="_blank" class="arrow_link">&rarr;</a>
                                </div>
                            </div>
                        </div>
                        <div style="width: calc(${bar_width}%); margin-top: 0.25rem;">
                            ${the_duration_chart}
                        </div>
                        <div id="${item.user_id}_more" class="student_more" style="color: #a2a2a2; font-size: 0.8rem;">
                            <div class="student_more_box">
                                <div>
                                    <div>${i18next.t('queries')}: </div>
                                    <div style="justify-content: flex-end;" data-log="S_Queries_New">${item.S_Queries_New} / ${queries_duration}</div>
                                </div>
                                <div>
                                    <div>${i18next.t('pages')}: </div>
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
    // const bubble_labels = document.querySelectorAll('.blabel');
    // document.querySelectorAll('.blabel'); // svg.selectAll(".bubble_label")

    // const svg = document.getElementById('plot_main')
    // console.log(svg)
    // const bubble_labels = document.querySelectorAll('#svg_main .bubble_label');
    
    // document.getElementById('svg_main').getElementsByClassName('.bubble-label');

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
            // -------------------------
            bubbles.forEach(bubble => {
                bubble.style.stroke = "transparent";
                bubble.style.opacity = bubble_default_opacity;
                bubble.style.fillOpacity = 1;
            });
            
            the_bubble_id = 'bubble_' + id

            d3.selectAll('.blabel:not(#' + the_bubble_id + ')')
                .attr("fill", "black")
                .attr("opacity", 0.7);

            // highlight bubble
            // -------------------------
            more_info.style.display = "block";

            const bubble = document.getElementById("bubble_" + id);
            // const label_id = document.getElementById("label_" + id);
            // console.log(bubbles)

            if (bubble){
                bubble.style.stroke = "red";
                bubble.style.strokeWidth = 3;
                bubble.style.opacity = 1;
                bubble.style.fillOpacity = 0.2;
            }

            d3.select("#label_" + id)
                .attr("fill", "red")
                .attr("opacity", 1);
        });
    });
}

function no_data() {
    const container = document.getElementById("container");

    container.innerHTML = `
        <div style='width: 100%; height: 100%; display: flex; justify-content: space-around; align-items: center; text-align: center'>
            :( 
            <br/><br/>
            Purtroppo non ci sono dati disponibili. <br/>
            Prova a cercare un’altra classe.
        </div>
    `
}

function load_statistics(data){
    // console.log(data)

    const container_a = document.getElementById("statistics_a");
    const container_b = document.getElementById("statistics_b");
    // const container_c = document.getElementById("statistics_c");

    // queries
    // --------------------------------------------

    const onlyQueries = data.filter((item) => item.query != "")

    const queriesCount = Object.values(
        onlyQueries.reduce((acc, { query, count }) => {
            acc[query] ??= { query, total_count: 0 };
            acc[query].total_count += count;
            return acc;
        }, {})
    );

    const queriesCountSort = queriesCount.sort((a, b) => {
        if (b.total_count !== a.total_count) {
            return b.total_count - a.total_count;
        }

        return a.query.localeCompare(b.query);
    });
    console.log(queriesCountSort)

    // domains
    // --------------------------------------------

    const onlyDomains = data.filter((item) => item.domain != "" && item.query == "")

    const domainsCount = Object.values(
        onlyDomains.reduce((acc, { domain, count }) => {
            acc[domain] ??= { domain, total_count: 0 };
            acc[domain].total_count += count;
            return acc;
        }, {})
    );

    const domainsCountSort = domainsCount.sort((a, b) => {
        if (b.total_count !== a.total_count) {
            return b.total_count - a.total_count;
        }

        const cleanA = a.domain.replace(/^www\./, "");
        const cleanB = b.domain.replace(/^www\./, "");
        
        return cleanA.localeCompare(cleanB);
    });
    console.log(onlyDomains)

    // column A
    // --------------------------------------------
    let output_a = ''
    
    output_a += `<span style="margin-bottom: 1rem; display: block;"><strong>${i18next.t('searches')}</strong></span>`;
    output_a += '<hr/ style="border: 0.1px solid #ccc">'

    output_a += `
        <div class="sort_tables">
            <span style="font-size: 0.8rem; margin-right: 0.5rem;" id="t_sortBy">
                sort by
            </span>
            <select id="get_querySort" style="width: 80%;">
                <option value="count" id="t_totalTime">count</option>
                <option value="query" id="t_totalTime">query</option>
            </select>
        </div>
    `
    // output_a += '<div id="queryTable">'
    output_a += '<table id="queryTable" class="table_counters">'

    // output_a += buildTable(queriesCountSort, 'query')
    // console.log(queriesCountSort, buildTable(queriesCountSort, 'query'))

    output_a += '<tr><td><ul class="list">'
    queriesCountSort.forEach(item => {
        output_a += `<tr>
            <td>${item.query}</td>
            <td>${item.total_count}</td>
        </tr>`;
	});

    output_a += '</table>'
    // output_a += '</div>'

    // column B
    // --------------------------------------------
    let output_b = ''
    
    output_b += `<span style="margin-bottom: 1rem; display: block;"><strong>${i18next.t('domains')}</strong></span>`;
    output_b += '<hr/ style="border: 0.1px solid #ccc">'

    output_b += '<table class="table_counters">'

    output_b += `
        <div class="sort_tables">
            <span style="font-size: 0.8rem; margin-right: 0.5rem;" id="t_sortBy">sort by</span>
            <select id="get_sort" style="width: 80%;">
                <option value="total" id="t_totalTime">count</option>
            </select>
        </div>
    `
    
    domainsCountSort.forEach(item => {
        domain = item.domain.replace(/^www\./, "")

        output_b += `<tr>
            <td><a href="https://${item.domain}" target="blank">${domain}</a></td>
            <td>${item.total_count}</td>
        </tr>`;
	});
    output_b += '</table>'

    // append content
    // --------------------------------------------
    container_a.innerHTML = output_a;
    container_b.innerHTML = output_b;

    function sortTables(){
        const sortSelect = document.getElementById('get_querySort');
        const container = document.getElementById('queryTable');

        get_querySort.addEventListener('change', () => {
            sortValue = sortSelect.value;
            console.log(sortValue)


            if (sortValue == 'query'){
                newSort = queriesCount.sort((a, b) => {
                    return a.query.localeCompare(b.query);
                });
            }
            else if (sortValue == 'count'){
                newSort = queriesCount.sort((a, b) => {
                    if (b.total_count !== a.total_count) {
                        return b.total_count - a.total_count;
                    }

                    return a.query.localeCompare(b.query);
                });
            }
            
            let newOutput = '<tr><td><ul class="list">'
            newSort.forEach(item => {
                newOutput += `<tr>
                <td>${item.query}</td>
                <td>${item.total_count}</td>
                </tr>`;
            });
            
            container.innerHTML = newOutput

        });
    }
    sortTables()
}
