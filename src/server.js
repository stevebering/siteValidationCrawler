var Crawler = require('crawler').Crawler;

var root = 'http://api.meracord.com/docs';
var regex = new RegExp(root);
var errorPages = [];

var c = new Crawler({
	"maxConnections": 10,
	"cache": true,
	"skipDuplicates": true,

	"callback": function(error, result, $) {

		if (error) {
			console.error(error);
			return error;
		}

		if (result.statusCode >= 400) {
			console.error("An error occurred with loading page '" + result.uri + "'");
			errorPages.push(result.uri);
			return error;
		}

		if (new RegExp('#').test(result.uri)) {
			return;
		}

		console.log(result.uri);
/*
		console.log("Details: ");
		console.log(result);
*/

		$("a[href]").each(function(index,a) {
			if (regex.test(a.href)) {
       		 	c.queue(a.href);
       		}
    	});
	},

	"onDrain": function() {
		console.log ('');
		console.log ("Completed running all queues: " + errorPages.length + ' errors.');
		console.log ('');
		errorPages.forEach(function(p) { console.log(p) });
		console.log ('');
	}
})

c.queue(root);
//c.queue('http://api.meracord.com/docs/reporting/accountdetails');