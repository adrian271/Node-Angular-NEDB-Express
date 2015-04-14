'use strict';

var path = require('path');

var Datastore = require('nedb');

var db = {
		mappings: new Datastore({filename: path.join(__dirname, 'mappings.db'),autoload: true })
};



/*var data = {
	g: 'http://www.google.com',
	f: 'http://www.futuresfins.com'
	y: 'http://www.yahoo.com',
		
};*/

var mappings = {
	get: function(alias, callback){
		db.mappings.findOne({alias: alias}, function(err, mapping) {
			if (err || !mapping) { return callback(new Error('Alias not found'));}//change from returning undefined to return callback
			callback(null, mapping.url); //using callback makes it asynchronous
		});
	},
	
	create: function(alias, url, callback) {
		db.mappings.insert({alias: alias,url:url}, callback);	
	},
	
	list: function(callback) {
		db.mappings.find({}).sort({alias:1}).exec(callback);
	}	
};



module.exports = mappings; //Important because everything is private so to make this part of the file public we need to export it