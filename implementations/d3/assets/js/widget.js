// from http://stackoverflow.com/questions/9235304/how-to-replace-the-location-hash-and-only-keep-the-last-history-entry
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
        styles = stylesResult[0];

        var $svg = $('svg');

        /* GETTING SIZE FROM CONTEXT */
        var margin = 20,
            width = $svg.width(),
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

        var draw = function(d) {

          /* YOUR CODE HERE */
          console.log(d[0]);

        };

        /* OBTAINING DATA (uncomment whichever applies) */
        d3.csv('data/' + dataset + '.csv', draw);
        //d3.json('data/' + dataset + '.json', draw)


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
