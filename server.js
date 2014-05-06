var net = require('net');

var clients = [];

Array.prototype.remove = function(obj){
	var index = this.indexOf(obj);
	if(index !== -1) {
		console.log("removing client");
		this.splice(index, 1);
	}
}

function write(client, msg) {
	client.write(msg, 'utf8');
}

function broadcast(msg, sender) {
	clients.forEach(function(client) {
		if(client === sender) return;
		write(client, msg);
	});
}

function serverMessage(msg) {
	var message = {};
	
	message.nickname = 'SERVER';
	message.content = msg;
	
	return JSON.stringify(message);
}

var server = net.createServer(function(client) { //'connection' listener
  console.log('client connected');
  //broadcast(serverMessage('A client has connected'));
  client.setEncoding('utf8');
  client.on('data', function(data) {
	broadcast(data, client);
  });
  client.on('end', function() {
    console.log('client disconnected');
	broadcast(serverMessage('A client has disconnected'));
  });
  client.on('error', function (e) {
	console.log('ERROR: ' + e.message);
	clients.remove(client);
  });
  write(client, serverMessage('You have succesfully connected to the server'));
  
  clients.push(client);
});

server.listen(8080, function() { //'listening' listener
  console.log('server bound');
});