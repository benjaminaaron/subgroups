/*var prompt = require('prompt');
prompt.start();
prompt.get(['this', 'that'], function (err, result) {
    console.log('this: ' + result.this);
    console.log('that: ' + result.that);
 });*/

var fs = require('fs');
var Strinc = require('strinc');
var Entity = require('./js/Entity.js');

var entities = [];
var allsubgroups = [];

fs.readFile("entities.txt", "utf8", function (err, data) {
	var lines = data.split('\n');
	for(var i in lines)
		entities.push(new Entity(entities.length, lines[i]));
	generateAllSubgroups(generateBinStrings(entities.length));

	exportAllSubgroups();
});

function generateBinStrings(entitiesCount){
	var binStrings = [];
	var generate = Strinc(Strinc.BIN);
	for (var i = 0; i < Math.pow(2, entitiesCount); i ++){
		var binStr = generate();
		var diff = entitiesCount - binStr.length;
		for(var j = 0; j < diff; j ++)
			binStr = "0" + binStr;
		binStrings.push(binStr);
	}
	return binStrings;
}

function generateAllSubgroups(binStrings){
	for(i in binStrings){
		var binStr = binStrings[i].split('').reverse().join(''); // reverse
		var subgroup = [];
		for(j in binStr)
			if(binStr[j] == '1')
				subgroup.push(entities[j]);
		allsubgroups.push(subgroup);
	}
}

function exportAllSubgroups(){
	var str = "";
	for(var i in allsubgroups){
		var line = "";
		for(var j in allsubgroups[i])
			line += allsubgroups[i][j] + " ";
		str += line.trim() + "\n";
	}
	
	fs.writeFile('allsubgroups.txt', str, function (err) {});
}


/*
var subgroup_choices = [];
fs.readFile("subgroup_choices.txt", "utf8", function (err, data) {
	subgroup_choices = data.split('\n');
});
*/