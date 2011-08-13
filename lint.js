/*globals fs, require, process, JSLINT, console */
/*jslint evil:true*/
var fs = require("fs");

fs.readFile("jslint.js", function (err, data) {
	"use strict";
	if (err) { throw err; }
	var jslintText = data.toString(),
		inputFileName = process.argv[2],
		options = "\n";
	/* Specify options like these */
	// options = "/*jslint white: true, forin: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, maxerr: 10 */\n";

	eval(jslintText);

	fs.readFile(inputFileName, function (err, data) {
		if (err) { throw err; }
		var inputText = data.toString();

		(function () {
			if (!JSLINT(options + inputText, { passfail: false }) ||
				(JSLINT.data().unused !== undefined && JSLINT.data().unused.length > 0)) {
				var i, e;
				if (JSLINT.data().errors !== undefined && JSLINT.data().errors.length > 0) {
					for (i = 0; i < JSLINT.data().errors.length; i += 1) {
						e = JSLINT.data().errors[i];
						if (e) {
							console.error('Lint at line ' + (e.line - 1) + ' character ' + e.character + ': ' + e.reason);
							console.error('\t' + (e.evidence || '').replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"));
						}
					}
					console.error("");
				}
				if (JSLINT.data().unused !== undefined && JSLINT.data().unused.length > 0) {
					for (i = 0; i < JSLINT.data().unused.length; i += 1) {
						e = JSLINT.data().unused[i];
						console.error("Unused variable '" + e.name + "' at line " + e.line + " and function " + e["function"]);
					}
					console.error("");
				}

				process.exit(1);
			} else {
				if (JSLINT.data().globals !== undefined && JSLINT.data().globals !== null && JSLINT.data().globals.length > 0) {
					console.error("Used globals: " + JSLINT.data().globals.join(", "));
				} else {
					console.error("No globals");
				}
				process.exit(0);
			}
		}());
	});
});