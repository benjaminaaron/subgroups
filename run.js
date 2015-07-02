var fs = require('fs');
var Strinc = require('strinc');

var allSubgroups = [];
var allChosenSubgroups = [];

createAllSubgroups();
createChosenSubgroups(counting);


function counting(){

	var countingVector = [];
	for(var i in allSubgroups)
		countingVector.push(0);

	for(var i in allChosenSubgroups){
		var chosenSubgroup = allChosenSubgroups[i];
		var occurenceIndex = getOccurenceIndex(chosenSubgroup, allSubgroups);
		countingVector[occurenceIndex] ++;
	}

	var rankingVector = [];

	for(var i in allSubgroups)
		rankingVector.push(countingVector[i] * allSubgroups[i].length);

	var rankedEntries = [];

	for(var i in allSubgroups)
		if(countingVector[i] > 0)
			rankedEntries.push(new RankedEntry(rankingVector[i], countingVector[i], allSubgroups[i]));

	rankedEntries.sort(compareRanking);

	var str = '';
	for(var i in rankedEntries)
		str += rankedEntries[i].str + '\n';

	fs.writeFile('output_rankedChosenSubgroups.txt', str.substring(0, str.length - 1), function (err) {});
};

var RankedEntry = function(ranking, occurence, subgroup){
	this.ranking = ranking;
	this.str = ranking + ': ' + occurence + ': ' + subgroup;
};

function compareRanking(a, b) {
  if (a.ranking > b.ranking)
    return -1;
  if (a.ranking < b.ranking)
    return 1;
  return 0;
}



function getOccurenceIndex(element, array){
	for(var i in array)
		if(JSON.stringify(array[i]) == JSON.stringify(element))
			return i;
	return null;
};

function createAllSubgroups(){
	fs.readFile('input_memberlist.txt', 'utf8', function (err, data) {
		var lines = data.split('\n');
		var allmembers = [];

		for(var i in lines)
			allmembers.push(lines[i]);

		var binStrings = generateBinStrings(allmembers.length);
		allSubgroups = generateSubgroups(binStrings, allmembers);
		exportSubgroups(allSubgroups, 'output_allSubgroups');
	});
};

function createChosenSubgroups(callback){
	fs.readFile('input_groupChoices.txt', 'utf8', function (err, data) {
		var groupChoices = data.split('\n');

		for(var i in groupChoices)
			if(groupChoices[i].length > 0){
				var groupMembers = groupChoices[i].split(' ');

				var binStrings = generateBinStrings(groupMembers.length);
				var subgroups = generateSubgroups(binStrings, groupMembers);
				allChosenSubgroups = allChosenSubgroups.concat(subgroups);
			}
		exportSubgroups(allChosenSubgroups, 'output_chosenSubgroups');

		callback();
	});
};

function generateBinStrings(memberCount){
	var binStrings = [];
	var generate = Strinc(Strinc.BIN);
	for (var i = 0; i < Math.pow(2, memberCount); i ++){
		var binStr = generate();
		var diff = memberCount - binStr.length;
		for(var j = 0; j < diff; j ++)
			binStr = '0' + binStr;
		binStrings.push(binStr);
	}
	return binStrings;
};

function generateSubgroups(binStrings, entities){
	var allSubgroups = [];
	for(i in binStrings){
		var binStr = binStrings[i].split('').reverse().join(''); // reverse
		var subgroup = [];
		for(j in binStr)
			if(binStr[j] == '1')
				subgroup.push(entities[j]);
		if(subgroup.length > 0)
			allSubgroups.push(subgroup.sort()); //alphabetically, makes it much easier to count in counting
	}
	return allSubgroups;
};

function exportSubgroups(subgroups, filename){
	var str = '';
	for(var i in subgroups){
		var line = '';
		for(var j in subgroups[i])
			line += subgroups[i][j] + ' ';
		str += line.length > 0 ? line.trim() + '\n' : '';
	}
	fs.writeFile(filename + '.txt', str.substring(0, str.length - 1), function (err) {});
};
