
var Entity = function(ID, name){
	this.ID = ID;
	this.name = name;
}

Entity.prototype = {
	toString: function(){
		return this.name;
	}
}

module.exports = Entity;