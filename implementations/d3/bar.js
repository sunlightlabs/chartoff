
d3.json('styles.json', function(error, s) {

        // Parameters for top-level sizing of plot
        var blog_or_feature = 'blog';
        var desired_height = 400;
        var units = 'units';
        var div_selector = "#bar-chart";
        var bar_color = "yellow";

        // TODO: (optionally?) Apply styles dynamically

        d3.json('test_data.json', function(error, data) {

            var svg = d3.select(div_selector+' svg');

            var maxValue = d3.max(data, function(d) { return d.value; });

            var yFormatter = d3.format(",.0d");

            /*
             * Setting margins according to longest yAxis label, default to styles.json
             */

            //  ... get default margins from specs
            var margin = s.plot_elements.canvas.margin;

            //  ... create invisible text object
            var testText = svg.append("g")
                            .append("text")
                              .classed("test-text", "true")
                              .text(function(d){ return yFormatter(maxValue) + " " + units; });

            //  ... measure width of invisible text object
            var yLabelWidth = Math.max(testText[0][0].getBBox().width,0)

            //  ... use larger of two margins
            //  TODO: specify 22 and 5 in styles.json so that they're not hardcoded here
            var suggestedLeftMargin = yLabelWidth + parseInt(s.text_styles.axis_title['font-size']) + 22 + 5;

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
                    .domain(data.map(function(d) { return d.label; }));

            var y = d3.scale.linear()
                    .range([height, 0])
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
                .attr("dy", function() { return s.text_styles.axis_label['font-size']; })
                .style("text-anchor", "middle")
                .text("Y Axis Title");

            //  ... add value units to value labels in separate span for distinct styling
            d3.select(div_selector + ' .y.axis')
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
                .attr("x", function(d) { return x(d.label); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.value); })
                .attr("height", function(d) { return height - y(d.value); })
                .style("fill", function(d) { return s.colors.data.main[bar_color].hex;} );
        });

});
