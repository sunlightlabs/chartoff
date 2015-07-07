
d3.json('assets/specs/styles.json', function(error, s) {

        // Parameters for top-level sizing of plot
        var blog_or_feature = 'blog';
        var desired_height = 400;
        var units = 'units';
        var div_selector = "#cfpb-bar-chart";
        var color = d3.scale.ordinal()
            .range([s.colors.network_graph.yellows[2].hex,
                s.colors.network_graph.teals[0].hex,
                s.colors.network_graph.reds[1].hex,
                s.colors.network_graph.mints[2].hex,
                s.colors.network_graph.magentas[1].hex,
                s.colors.network_graph.blues[2].hex,
                s.colors.network_graph.cyans[0].hex,
                s.colors.network_graph.oranges[1].hex,
                s.colors.network_graph.pinks[2].hex,
                s.colors.network_graph.greens[0].hex]);

        // TODO: (optionally?) Apply styles dynamically

        d3.csv('data/post_debt.csv', function(error, data) {

            var svg = d3.select(div_selector+' svg');

            var maxValue = 32000;

            var yFormatter = d3.format(",.0d");

            /*
             * Setting margins according to longest yAxis label, default to styles.json
             */

            //  ... get default margins from specs
            var margin = s.plot_elements.canvas.margin;

            //  ... create invisible text object
            var testText = svg.append("g")
                              .attr("class", "axis")
                            .append("text")
                              .attr("class", "test-text")
                              .attr("x", -1000)
                              .classed("axis", "true")
                              .text(function(d){ return yFormatter(maxValue) });
            
            testText.append("tspan")
                    .classed("unit", true)
                    .text(" " + units);

            //  ... measure width of invisible text object
            var yLabelWidth = Math.max(testText[0][0].getBoundingClientRect().width,0);

            testText.data([]).exit().remove();

            //  ... use larger of two margins
            var suggestedLeftMargin = yLabelWidth + parseInt(s.text_styles.axis_title['font-size']) + 2 + s.plot_elements.axis.title_padding;  // plus 2 related to space above/below text

            margin.left = Math.max(margin.left, suggestedLeftMargin);

            //  ... follow D3 margin convention as normal
            var width = s.plot_elements.canvas.width[blog_or_feature] - margin.left - margin.right,
                height = desired_height - margin.top - margin.bottom;

            svg.attr("width", width + margin.left + margin.right)
               .attr("height", height + margin.top + margin.bottom);

            /*
             * Creating scales
             */


            var x = d3.scale.ordinal()
                    .rangeRoundBands([0, width], .1)
                    .domain(data.map(function(d) { return d.Company; }));

            var y = d3.scale.linear()
                    .rangeRound([height, 0])
                    .domain([0, maxValue + 2]);

            /*
             * Creating Axes and Gridlines (innerTick)
             */

            var xAxis = d3.svg.axis()
                .scale(x)
                .innerTickSize(-height) // really long ticks become gridlines
                .outerTickSize(0)
                .tickPadding(5)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .innerTickSize(-width) // really long ticks become gridlines
                .outerTickSize(0)
                .tickPadding(5)
                .tickValues([10, 20, 30]) // setting tick values explicitly
                .tickFormat(yFormatter);

            /*
             * Drawing chart
             */

            color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Company"; }));

            data.forEach(function(d) {
                var y0 = 0;
                d.products = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
                d.total = d.products[d.products.length - 1].y1;
            });

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                    .selectAll("text")
                    .attr("y", 0)
                    .attr("x", 9)
                    .attr("dy", ".35em")
                    .attr("transform", "rotate(90)")
                    .style("text-anchor", "start");

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Number of complaints");

            var company = svg.selectAll(".company")
                .data(data)
                .enter().append("g")
                .attr("class", "g")
                .attr("transform", function(d) { return "translate(" + x(d.Company) + ",0)"; });

            company.selectAll("rect")
                .data(function(d) {;return d.products; })
                .enter().append("rect")
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.y1); })
                .attr("height", function(d) { return y(d.y0) - y(d.y1); })
                .style("fill", function(d) { return color(d.name); });
        
              var legend = svg.selectAll(".legend")
      .data(color.domain().slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 50)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 56)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });


        });

});
