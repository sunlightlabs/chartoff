d3.json('styles.json', function(error, s) {

        // Parameters for top-level sizing of plot
        var blog_or_feature = 'blog';
        var desired_height = 400;
        var div_selector = "#line-chart";

        var colors = {  "republican" : s.colors.data.parties.republican.hex,
                        "democrat"   : s.colors.data.parties.democrat.hex   }

        // TODO: (optionally?) Apply styles dynamically

        d3.json('test_data_line.json', function(error, data) {

            var svg = d3.select(div_selector+' svg');


            var yFormatter = d3.format(",.0$");

            var parseDate = d3.time.format("%Y").parse;

            // convert time input to d3 time objects
            data.forEach(function(d) {
                d.date = parseDate(d.year);
            });

            // pivot data
            var parties = d3.keys(colors).map(function(party) {
                return {
                    party: party,
                    values: data.map(function(d) {
                        return {date: d.date, amount: +d[party], party: party};
                    })
                };
            });

            console.log(parties);

            var maxValue = d3.max(parties, function(c) { return d3.max(c.values, function(v) { return v.amount; }); });

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
                              .text(function(d){ return "$" + yFormatter(maxValue); });
            
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

            var x = d3.time.scale()
                    .range([0, width]);

            var y = d3.scale.linear()
                    .range([height, 0]);

            x.domain([
                        d3.min(data, function(d) { return d3.time.year.offset(d.date, -1);}),
                        d3.max(data, function(d) { return d3.time.year.offset(d.date, 1);})
                            ]);
            
            y.domain([
                    // Style guide says to start at zero
                    //d3.min(parties, function(c) { return d3.min(c.values, function(v) { return v.amount; }); }),
                    0,
                    d3.max(parties, function(c) { return d3.max(c.values, function(v) { return v.amount; }); }) + 100
                ]);

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
                .tickFormat(function(d){ return "$"+yFormatter(d);});

            /*
             * Drawing chart
             */

            var lineChart = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            //  ... add x axis
            lineChart.append("g")
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
            lineChart.append("g")
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

            // line drawing function
            var line = d3.svg.line()
                //.interpolate("basis")
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.amount); });

            var party = lineChart.selectAll(".party")
                .data(parties)
              .enter().append("g")
                .attr("class", "party");

            party.append("path")
                .attr("class", "line")
                .attr("d", function(d) { return line(d.values); })
                .style("stroke-width", s.plot_elements.line.width)
                .style("fill", "none")
                .style("stroke", function(d) { return colors[d.party]; });

            var point = party.append("g")
                .attr("class", "line-point");

            point.selectAll("circle")
                .data(function(d,i){ return d.values; })
              .enter().append("circle")
                .attr("cx", function(d) { return x(d.date); })
                .attr("cy", function(d) { return y(d.amount); })
                .attr("r", 3)
                .style("fill", function(d) { return colors[d.party]; })
               
            var point_labels = party.append("g")
                .attr("class", "point-label");

            point_labels.selectAll("text")
                .data(function(d,i){ return d.values; })
              .enter().append("text")
                .style("fill", s.text_styles.point_label.color)
                .style("font-size", s.text_styles.point_label['font-size'])
                .style("font-family", s.text_styles.point_label['font-family'])
                .attr("x", function(d) { return x(d.date); })
                .attr("y", function(d) { return y(d.amount); })
                //.attr("dx", function(d) { return -(longestLabel); })
                .style("text-anchor","end")
                .attr("dy", function(d) { return -(parseInt(s.text_styles.point_label['font-size']) / 3);})
                .attr("dx", -5)
                .text(function(d) { return "$" + yFormatter(d.amount); })

            // TODO: Add Legend

        });

});
