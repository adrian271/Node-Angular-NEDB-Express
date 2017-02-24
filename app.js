'use strict';

//Integrated Modules
var http = require('http'); //adds the http server part of node
var path = require('path'); //This will make paths work better so you can use something like __dirname without OS frustration

//3rd Pary Modules
var express = require('express'), //don't need to add full directory (./node_modules/connect), node already knows it exists
	socket = require('socket.io'); //don't need to add full directory (./node_modules/connect), node already knows it exists

//Custom Modules
var logger = require('./logger'),
	mappings = require('./data/mappings');

var app = express();

app.set('views', path.join(__dirname, 'views')); // '__dirname' gets the current directory where your file resides... path.join helps concatenate so you don't end up with different OS conflicts on your node install
app.set('view engine', 'ejs'); // Note that we didn't need to decalre EJS in the above variables, Express already works this out for EJS

app.use(logger("Requested: "));
app.use(express.static(path.join(__dirname, 'public'))); //This automatically comes from express and serves as a static file server

app.get('/', function(req,res){
	mappings.list(function (err, documents){
		res.render('index');
	})
});

app.get('*', function(req, res){
	// mappings.get(req.params.alias, function(err, mapping){
	// 	if (err) {return res.status(404).end();}
	// 	res.redirect(mapping);
	// });
	res.send('');
});


//mappings.create("v","http://www.vimeo.com",function(alias, url){console.log(alias+" "+url)}); //Edit this line to add more

var port = 3005;


var server = http.createServer(app);
server.listen(port);//sets up which port to listen on

var io = socket.listen(server); //Can use to communicate with the client

io.sockets.on('connection', function(socket){ //Once there is a connection will get our mappings documents
	mappings.list(function (err, documents){
		socket.emit('list',documents);
	});
	socket.on('addMapping', function(mapping){
		mappings.create(mapping.alias, mapping.url, function(){
			io.sockets.emit('newMapping', mapping); //Basically says that when a new mapping is added, all connected users will be pushed the update
		});
	});
});

var lines = 20;
for(var i = 0; i < lines; i++) {
    console.log('\r\n');
}
console.log("Listening on Port "+port);