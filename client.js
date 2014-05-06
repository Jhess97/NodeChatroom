var net = require('net');
var readline = require('readline');

var rl = readline.createInterface({input: process.stdin, output: process.stdout});

rl.question('Enter the IP of the server you want to connect to: ', function(serverIP) {
	connect(serverIP);
});

var connect = function(serverIP) {
	var server = net.connect('8080', serverIP, function() {
		console.log('*** Connected Successfully ***');
		
		rl.question('Enter a nickname: ', function(nick) {
			server.on('data', function(data) {
				var parsedData = JSON.parse(data);
				console.log(parsedData.nickname.toUpperCase() + ": " + parsedData.content + "\n");
			});

			rl.on('line', function (cmd) {
				var message = {
					nickname: nick,
					content: cmd
				};
				server.write(JSON.stringify(message), 'utf8');
			});
		});
	});
	
	server.on("error", function (err) {
			rl.write("Major Server Error! You have been TERMINATED!");
			rl.write("Major Server Error! You have been TERMINATED!");
			rl.write("This is totally a server error.");
	});		
}