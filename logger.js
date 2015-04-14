'use strict';

var setup = function(appName){
	return function(req,res, next){
	console.log(appName+': '+req.method+' '+req.url);
	next();
}
};



module.exports = setup;