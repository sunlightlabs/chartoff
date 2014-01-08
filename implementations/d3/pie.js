d3.json('styles.json', function(error, s) {

        console.warn(error);

        // Parameters for top-level sizing of plot
        var blog_or_feature = 'blog';
        var desired_height = 400;
        var units = 'units';
        var div_selector = "#pie-chart";
        var rotate_angle = 70;

        var colors = { "pro":   s.colors.data.pro_con.pro.hex, 
                       "con":   s.colors.data.pro_con.con.hex,
                       "other": s.colors.data.main.neutral.hex }

        console.log(colors);

        // TODO: (optionally?) Apply styles dynamically

        d3.json('test_data_pie.json', function(error, data) {

            var svg = d3.select(div_selector+' svg');

            var yFormatter = d3.format(",.0d");

            /*
             * Setting margins according to longest yAxis label, default to styles.json
             */

            //  ... get default margins from specs
            var margin = s.plot_elements.canvas.margin.pie;

            var width = s.plot_elements.canvas.width[blog_or_feature] - margin.left - margin.right,
                height = desired_height - margin.top - margin.bottom;

            svg.attr("width", width + margin.left + margin.right)
               .attr("height", height + margin.top + margin.bottom);

            /*
             * Creating arc
             */

            var radius = Math.min(width, height) / 2;

            var arc = d3.svg.arc()
                .outerRadius(radius)
                .innerRadius(0);

            var pie = d3.layout.pie()
                .sort(null)
                .value(function(d) { return d.percentage; });

            /*
             * Drawing chart
             */

            var pieChartContainer = svg.append("g")
                .attr("transform", "translate(" + width / 3 + "," + height / 2 + ")");

            labelContainer = pieChartContainer.append("g")
                .classed("pie-labels","true");

            labels = labelContainer.selectAll(".pie-label")
                .data(pie(data))
              .enter().append("g")
                .classed("pie-label", true);

            labels.append("text")
                .attr("transform", function(d) {
                    var c = arc.centroid(d),
                        x = c[0],
                        y = c[1],
                        h = Math.sqrt(x*x + y*y);
                        
                        label_line = width * 1/2;

                        label_x = x + (label_line - x);
                    
                    return "translate(" + label_x + "," + y + ")";
                })
                .style("font-family", s.text_styles.axis_label['font-family'])
                .style("font-size", s.text_styles.axis_label['font-size'])
                .style("fill", s.text_styles.axis_label['color'])
                .style("stroke", "none")
                //.attr("dy", ".35em")
                .attr("text-anchor", "start")
                /*function(d) {
                    return (d.endAngle + d.startAngle) / 2 > Math.PI ? "end" : "start";
                })*/
                .text(function(d) { return d.data.label; })
                .append("tspan")
                .style("font-family", s.text_styles.axis_title['font-family'])
                .text(function(d) { return " (" + d.value + "%)"; });

            //var textBoxes 

            labels.each(function(d,i) {
                if(i > 0) {
                    var textOffset = 0;

                    var thisbb = this.getBoundingClientRect(),
                        prevbb = prev.getBoundingClientRect();
                    console.log(thisbb);
                    console.log(prevbb);

                    if(!(thisbb.right < prevbb.left || 
                        thisbb.left > prevbb.right || 
                        thisbb.bottom < prevbb.top || 
                        thisbb.top > prevbb.bottom)) {
                    console.log("clash:");
                    console.log(thisbb);
                    console.log(prevbb);
                    var ctx = thisbb.left + (thisbb.right - thisbb.left)/2,
                        cty = thisbb.top + (thisbb.bottom - thisbb.top)/2,
                        cpx = prevbb.left + (prevbb.right - prevbb.left)/2,
                        cpy = prevbb.top + (prevbb.bottom - prevbb.top)/2,
                        off = Math.sqrt(Math.pow(ctx - cpx, 2) + Math.pow(cty - cpy, 2))/2;
                    d3.select(this).attr("transform","translate(0,20)");
                    }
              }
              prev = this;
           });

           labels.append("path")
                .attr("d", function(d) { 
                    var label_line = width * 1/2; 
                    return "M 0 1 H -" + label_line;
                })
                .attr("transform", function(d) {
                    var c = arc.centroid(d),
                        x = c[0],
                        y = c[1],
                        h = Math.sqrt(x*x + y*y);
                        
                        label_line = width * 1/2;

                        label_x = x + (label_line - x);
                    
                    return "translate(" + label_x + "," + y  + ")";
                })
                .style("stroke-width", s.plot_elements.indicator.line['width'])
                .style("stroke", s.plot_elements.indicator.line.color);
            
           var pieChart = pieChartContainer.append("g")
                .attr("transform", "rotate("+rotate_angle+")");
        
           var arcs = pieChart.selectAll(".arc")
                .data(pie(data))
              .enter().append("g")
                .attr("class", "arc");

           arcs.append("path")
                .attr("d", arc)
                .style("stroke", s.plot_elements.pie.stroke)
                .style("fill", function(d) { 
                    return colors[d.data.label]; 
                });

        });
        
});
