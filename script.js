const dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
fetch(dataUrl)
  .then(response => response.json())
  .then(json => {
    const dataset = json;
    console.log(dataset.map(d => [d.Year, d.Doping]))
  
    const w = 800;
    const h = 600;
    const padding = 50;

  const years = d3.extent(dataset, d => d.Year);  
  const xScale = d3.scaleLinear()
    .domain([years[0] - 1, years[1] + 1])
    .range([padding, w - padding]);

    const parseTime = d3.timeParse("%M:%S");
    const times = dataset.map(d => parseTime(d.Time));
    const timeExtent = d3.extent(times);
    const yScale = d3.scaleTime()
    .domain([d3.timeMinute.offset(timeExtent[0], -0.3), d3.timeMinute.offset(timeExtent[1], .3)])
    .range([padding, h - padding]);

    const svg = d3.select("body")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h);
  
    /*
    const colorScale = d3.scaleOrdinal()
      .domain(["", "Doping"])  // Categories: empty string (no doping) and any non-empty (doping)
      .range(["#4da6ff", "#ff4d4d"]);  
    */

    svg.selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.Year))
      .attr("cy", d => yScale(parseTime(d.Time)))
      .attr("r", 10)
      .attr("data-xvalue", d => d.Year)
      .attr("data-yvalue", d => parseTime(d.Time))
      .attr("fill", d => d.Doping !== "" ? "#ff4d4d" : "#4da6ff")    
      .on("mouseover", function(event, d) {
        // Show tooltip
        d3.select("#tooltip")
          .style("visibility", "visible")
          .html(`${d.Name}: ${d.Nationality}<br>Year: ${d.Year}, Time ${d.Time}<br><br>${d.Doping}`)
          .attr("data-year", d.Year)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
    })
      .on("mouseout", function() {
        // Hide tooltip
        d3.select("#tooltip")
          .style("visibility", "hidden");
    });

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
  
    svg.append("text")
      .attr("x", w / 2)
      .attr("y", h - 10)
      .attr("text-anchor", "middle")
      .text("Year")
      .style("font-size", "12px")
      .style("fill", "#666");
  
    svg.append("text")
      .attr("transform", "rotate(-90)")  // Rotate 90 degrees counterclockwise
      .attr("x", -h / 2)
      .attr("y", 15)  // To the left of the y-axis
      .attr("text-anchor", "middle")
      .text("Time in Minutes")
      .style("font-size", "12px")
      .style("fill", "#666");

    svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(xAxis);

    svg.append("g")
      .attr("id", "y-axis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);
  
    const legend = svg.append("g")
      .attr("id", "legend")
      .attr("transform", "translate(" + (w - 150) + ", 10)");
  
    legend.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 10).attr("fill", "#4da6ff")
    legend.append("text").attr("x", 10).attr("y", 5).text("No Doping Allegations");
    legend.append("circle").attr("cx", 0).attr("cy", 20).attr("r", 10).attr("fill", "#ff4d4d");
    legend.append("text").attr("x", 10).attr("y", 25).text("Doping Allegations");
  
 
  });
