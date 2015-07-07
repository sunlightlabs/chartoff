
d3.json('assets/specs/styles.json', function(error, s) {

        // Parameters for top-level sizing of plot
        var blog_or_feature = 'blog';
        var desired_height = 400;
        var units = 'units';
        var div_selector = "#hbar-chart";
        var bar_color = "yellow";

        // TODO: (optionally?) Apply styles dynamically

        d3.json('data/test_data.json', function(error, data) {

            var svg = d3.select(div_selector+' svg');

            var maxValue = d3.max(data, function(d) { return d.value; });

            var xFormatter = d3.format(",.0d");

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
                              .attr("y", -1000)
                              .classed("axis", "true")
                              .text(function(d){ return xFormatter(maxValue) });

            testText.append("tspan")
                    .classed("unit", true)
                    .text(" " + units);

            //  ... measure width of invisible text object
            var yLabelHeight = Math.max(testText[0][0].getBoundingClientRect().width,0);

            testText.data([]).exit().remove();

            //  ... use larger of two margins
            var suggestedLeftMargin = yLabelHeight + parseInt(s.text_styles.axis_title['font-size']) + 2 + s.plot_elements.axis.title_padding;  // plus 2 related to space above/below text

            margin.left = Math.max(margin.left, suggestedLeftMargin);

            //  ... follow D3 margin convention as normal
            var width = s.plot_elements.canvas.width[blog_or_feature] - margin.left - margin.right,
                height = desired_height - margin.top - margin.bottom;

            svg.attr("width", width + margin.left + margin.right)
               .attr("height", height + margin.top + margin.bottom);

            /*
             * Creating scales
             */

            var y = d3.scale.ordinal()
                    .rangeRoundBands([0, height], .1)
                    .domain(data.map(function(d) { return d.label; }));

            var x = d3.scale.linear()
                    .range([0, width])
                    .domain([0, maxValue + 2]);

            /*
             * Creating Axes and Gridlines (innerTick)
             */

            var yAxis = d3.svg.axis()
                .scale(y)
                .innerTickSize(-width) // really long ticks become gridlines
                .outerTickSize(0)
                .tickPadding(5)
                .orient("left");

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .innerTickSize(-height) // really long ticks become gridlines
                .outerTickSize(0)
                .tickPadding(5)
                .tickValues([10, 20, 30]) // setting tick values explicitly
                .tickFormat(xFormatter);

            /*
             * Drawing chart
             */

            var basicChart = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            //  ... add x axis
            basicChart.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
              .append("text")
                .classed("title",true)
                .attr("x", function() { return (width / 2.0);}) // anchors title in middle of chart
                .attr("y", function() { return (margin.bottom);})
                .style("text-anchor", "middle") // centers title around anchor
                .text("X Axis Title");

            //  ... add y axis with value labels
            basicChart.append("g")
                .attr("class", "y axis")
                .call(yAxis)
              .append("text")
                .classed("title",true)
                .attr("transform", "rotate(-90)")
                .attr("x", function() { return -(height / 2.0);})
                .attr("y", function() { return -(margin.left);})
                .attr("dy", function() { return (parseInt(s.text_styles.axis_label['font-size'])-2); }) // minus 2 related to space above/below text
                .style("text-anchor", "middle")
                .text("Y Axis Title");

            //  ... add value units to value labels in separate span for distinct styling
            d3.select(div_selector + ' .x.axis')
                .selectAll('.tick')
                .select('text')
              .append("tspan")
                .classed("unit", true)
                .text(" " + units);

            //  ... add bars using bar_color (set above) for fill
            basicChart.selectAll(".bar")
                .data(data)
              .enter().append("rect")
                .attr("class","bar")
                .attr("y", function(d) { return y(d.label); })
                .attr("height", y.rangeBand())
                .attr("x", function(d) { return 0; })
                .attr("width", function(d) { return x(d.value); })
                .style("fill", function(d) { return s.colors.data.main[bar_color].hex;} );
        });

});
