var exec = require('child_process').exec;
var fs = require('fs');

// based on http://stackoverflow.com/a/13928240
var format = '{%n"hash":"%h","parent":"%p",%n"author":"%an",%n"date":"%at",%n"message":"%s",%n"commitDate":"%ct", "subject": "%s"}'.replace(/\"/g, '^@^');
var cmd = 'git log --pretty=format:\'' + format + ',\' > result.json';
var cwd = ''
var target = 'data/test.json'


var child = exec(cmd, {cwd: cwd},
	function (error, stdout, stderr) {
		if (error !== null) {
			console.log('exec error: ' + error);
			return;
		}
		convert();
});

function convert() {

	var result = fs.readFileSync(cwd + 'result.json', 'utf8');
	fs.unlinkSync(cwd + 'result.json');
	var out = result.replace(/"/gm, '\\"').replace(/\^@\^/gm, '"').replace(/w+/g, ' ');
	if (out[out.length - 1] == ',') {
		out = out.substring (0, out.length - 1);
	}

	// quick hack!
	var log = eval('[' + out + ']');

	var json = JSON.stringify(log, null, '\t');

	fs.writeFileSync(target, json, 'utf8');

}