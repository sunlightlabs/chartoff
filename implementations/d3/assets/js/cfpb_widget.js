// from http://stackoverflow.com/questions/9235304/how-to-replace-the-location-hash-and-only-keep-the-last-history-entry

var testvar;

(function(namespace) { // Closure to protect local variable "var hash"
    if ('replaceState' in history) { // Yay, supported!
        namespace.replaceHash = function(newhash) {
            if ((''+newhash).charAt(0) !== '#') newhash = '#' + newhash;
            history.replaceState('', '', newhash);
        }
    } else {
        var hash = location.hash;
        namespace.replaceHash = function(newhash) {
            if (location.hash !== hash) history.back();
            location.hash = newhash;
        };
    }
})(window);

(function($) {
    // grab the query dict and see if this is a special one
    var queryDict = {};
    location.search.substr(1).split("&").forEach(function(item) {queryDict[item.split("=")[0]] = item.split("=")[1]});
    var dataset = queryDict.t ? queryDict.t : 'data';
    
    var stylesXHR = $.getJSON('assets/specs/styles.json');

    $.when(stylesXHR).done(function(stylesResult) {
        var styles = stylesResult;

        var $svg = $('svg');

        /* GETTING SIZE FROM CONTEXT */
        var width = $svg.width(),
            height = $svg.height();

        var focus;

        /* USEFUL UTILS */
        
        /* D3 formats */
        var format = d3.format("0,000");
        var percentFormat = d3.format(".4p");

        /* opening the modal */
        var openModalDetail = function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var dialog = $('#doc-dialog');
            dialog.modal('toggle');

           window.replaceHash(focus.id);

           /* Add stuff to the modal dialog here */

        };

        var setFocus = function(d) {
            var focus0 = focus;
            focus = d;
        };

        var draw = function(data) {
            var svg = d3.select($svg[0]);
            
            var all_keys = d3.keys(data[0])
                             .filter(function(key) { return key !== "quarter";});

            var filtered_keys;

            if (window.location.hash != "") {
                filtered_keys = window.location.hash.replace('%20',' ').replace('#','').split(',');
            } else {
                filtered_keys = all_keys;
            };
               
            colors = [ 
                    styles.colors.network_graph.yellows[2].hex,
                    styles.colors.network_graph.teals[0].hex,
                    styles.colors.network_graph.reds[1].hex,
                    styles.colors.network_graph.mints[2].hex,
                    styles.colors.network_graph.magentas[1].hex,
                    styles.colors.network_graph.blues[2].hex,
                    styles.colors.network_graph.cyans[0].hex,
                    styles.colors.network_graph.oranges[1].hex,
                    styles.colors.network_graph.pinks[2].hex,
                    styles.colors.network_graph.greens[0].hex
            ]

            var color = d3.scale.ordinal()
                        .domain(all_keys)
                        .range(colors);

            var parseDate = d3.time.format("%Y%m%d").parse;

            data.forEach(function(d) {
                d.date = parseDate(d.quarter);
            });

            //console.log(data);
            
            var products;

            // pivot data
            products = filtered_keys.map(function(name) {
                return {
                    name: name,
                    values: data.map(function(d) {
                        return {date: d.date, amount: +d[name], name:name};
                    })
                };
            });
                


            //console.log(products);
            console.log(all_keys);

            var maxValue = d3.max(data, function(d) {
                return d3.max(all_keys, function(k) { 
                    console.log(d[k]);
                    return +d[k];}); 
            });

            console.log(maxValue);
            //testvar = maxValue;

            /*
             * Setting margins according to longest yAxis label, default to styles.json
             */

            //  ... get default margins from specs
            var margin = styles.plot_elements.canvas.margin;
            testvar = margin;

            //  ... create invisible text object
            var testText = svg.append("g")
                              .attr("class", "axis")
                            .append("text")
                              .attr("class", "test-text")
                              .attr("x", -1000)
                              .classed("axis", "true")
                              .text(function(d){ return maxValue; });
            
            //  ... measure width of invisible text object
            var yLabelWidth = Math.max(testText[0][0].getBoundingClientRect().width,0);

            testText.data([]).exit().remove();

            //  ... use larger of two margins
            var suggestedLeftMargin = yLabelWidth + parseInt(styles.text_styles.axis_title['font-size']) + 2 + styles.plot_elements.axis.title_padding;  // plus 2 related to space above/below text

            margin.left = Math.max(margin.left, suggestedLeftMargin);

            //svg.attr("width", width + margin.left + margin.right)
            //   .attr("height", height + margin.top + margin.bottom);

            /*
             * Creating scales
             */

            chart_width = width - margin.left - margin.right;
            chart_height = height - margin.top - margin.bottom;

            var x = d3.time.scale()
                    .range([0, chart_width]);

            var y = d3.scale.linear()
                    .range([chart_height, 0]);

            x.domain([
                        d3.min(data, function(d) { return d3.time.month.offset(d.date, -1);}),
                        d3.max(data, function(d) { return d3.time.month.offset(d.date, 11);})
                            ]);
            
            y.domain([
                    // Style guide says to start at zero
                    //d3.min(parties, function(c) { return d3.min(c.values, function(v) { return v.amount; }); }),
                    0,
                    maxValue + 500
                ]);

            /*
             * Creating Axes and Gridlines (innerTick)
             */

            var xAxis = d3.svg.axis()
                .scale(x)
                .ticks(d3.time.month, 20)
                .innerTickSize(-chart_height) // really long ticks become gridlines
                .outerTickSize(0)
                .tickPadding(5)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .innerTickSize(-chart_width) // really long ticks become gridlines
                .outerTickSize(0)
                .tickPadding(5)
                .tickFormat(function(d){ return d;});

            /*
             * Drawing chart
             */

            var lineChart = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            //  ... add x axis
            lineChart.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + chart_height + ")")
                .call(xAxis)
              .append("text")
                .classed("title",true)
                .attr("x", function() { return (chart_width / 2.0);}) // anchors title in middle of chart
                .attr("y", function() { return (margin.bottom - 10);})
                .style("text-anchor", "middle") // centers title around anchor
                .text("Date");

            //  ... add y axis with value labels
            lineChart.append("g")
                .attr("class", "y axis")
                .call(yAxis)
              .append("text")
                .classed("title",true)
                .attr("transform", "rotate(-90)")
                .attr("x", function() { return -(chart_height / 2.0);})
                .attr("y", function() { return -(margin.left - 10);})
                .attr("dy", function() { return (parseInt(styles.text_styles.axis_label['font-size'])-2); }) // minus 2 related to space above/below text
                .style("text-anchor", "middle")
                .text("Number of Complaints");

            // line drawing function
            var line = d3.svg.line()
                .interpolate("monotone")
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.amount); });

            var product = lineChart.selectAll(".product")
                .data(products)
              .enter().append("g")
                .attr("class", "product");

            product.append("path")
                .attr("class", "line")
                .attr("d", function(d) { return line(d.values); })
                .style("stroke-width", styles.plot_elements.line.width)
                .style("fill", "none")
                .style("stroke", function(d) { return color(d.name); });

            product.append("text")
                .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
                .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.amount) + ")"; })
                .attr("x", 10)
                .attr("dy", ".35em")
                .style("font-size", styles.text_styles.point_label['font-size'])
                .style("font-family", styles.text_styles.point_label['font-family'])
                .text(function(d) { return d.name; })
                .on('click', function(d) {
                    window.replaceHash(d.name);
                });

            var point = product.append("g")
                .attr("class", "line-point");

            point.selectAll("circle")
                .data(function(d,i){ return d.values; })
              .enter().append("circle")
                .attr("cx", function(d) { return x(d.date); })
                .attr("cy", function(d) { return y(d.amount); })
                .attr("r", 3)
                .style("fill", function(d) { return color(d.name); })

        };

        /* OBTAINING DATA (uncomment whichever applies) */
        d3.csv('data/' + dataset + '.csv', draw);
        //d3.json('data/' + dataset + '.json', draw)
        
        window.addEventListener("hashchange", function(){
            console.log('Hash changed!');
            d3.csv('data/' + dataset + '.csv', draw);
        });

        $('#doc-dialog').on('hidden.bs.modal', function () {
            window.replaceHash(focus.id);
        });

        /* make the embed link work */
        $('#embed-link').on('click', function(evt) {
            evt.preventDefault();
            var dialog = $('#embed-dialog');
            dialog.modal('toggle');
            dialog.find('.iframe-src').html(window.location.href);
            dialog.find('.iframe-height').html($(window).height());
            dialog.find('.iframe-width').html($(window).width());
        })

        /* make the new window link work */
        $('#new-link').on('click', function(evt) {
            evt.preventDefault();
            window.open(window.location.href);
        })

        /* check see if there's a hash and load it */
        if (window.location.hash) {
            var hparts = window.location.hash.slice(1).split("/");
        }
    });

    var formatDate = function(d) {
        months = ["January", "February", "March", 
            "April", "May", "June", "July", "August", "September", 
            "October", "November", "December"];

        return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
    }
})(jQuery);
