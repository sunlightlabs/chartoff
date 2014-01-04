
d3.json('styles.json', function(error, s) {

        // Parameters for top-level sizing of plot
        var blog_or_feature = 'blog';
        var desired_height = 400;
        var units = 'units';
        var div_selector = "#basic-structure";
        
        // D3 margin convention
        var margin = s.plot_elements.canvas.margin,
            width = s.plot_elements.canvas.width[blog_or_feature] - margin.left - margin.right,
            height = desired_height - margin.top - margin.bottom;
       
        var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
                .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .innerTickSize(-height)
            .outerTickSize(0)
            .orient("bottom");

        var yFormatter = d3.format(",.0d");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .innerTickSize(-width)
            .outerTickSize(0)
            .tickValues([10, 20, 30])
            .tickFormat(yFormatter);

        d3.json('test_data.json', function(error, data) {
            maxValue = d3.max(data, function(d) { return d.value; });

            x.domain(data.map(function(d) { return d.label; }));
            y.domain([0, maxValue + 2]);
            
            var svg = d3.select(div_selector);

            var testText = svg.append("g")
                            .append("text")
                              .classed("test-text", "true")
                              .text(function(d){ return yFormatter(maxValue) + " " + units; });

            var yLabelWidth = Math.max(testText[0][0].clientWidth,0)
            var suggestedLeftMargin = yLabelWidth + parseInt(s.text_styles.axis_title['font-size']) + 22 + 5;

            margin.left = Math.max(margin.left, suggestedLeftMargin);
                
            svg.attr("width", width + margin.left + margin.right)
               .attr("height", height + margin.top + margin.bottom);
        
            var basicChart = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            basicChart.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
              .append("text")
                .classed("title",true)
                .attr("x", function() { return (width / 2.0);})
                .attr("y", function() { return (margin.bottom);})
                .style("text-anchor", "middle")
                .text("Y Axis Title");
            
            basicChart.append("g")
                .attr("class", "y axis")
                .call(yAxis)
              .append("text")
                .classed("title",true)
                .attr("transform", "rotate(-90)")
                .attr("x", function() { return -(height / 2.0);})
                .attr("y", function() { return -(margin.left - s.basic_structure.chart_area.padding.left);})
                .style("text-anchor", "middle")
                .text("Y Axis Title");

            d3.select('.y.axis')
                .selectAll('.tick')
                .select('text')
              .append("tspan")
                .classed("unit", true)
                .text(" " + units);
            
            d3.select('.x.axis')
                .selectAll('.tick')
                .select('text')
                .attr("y",5);
            
        });

});
