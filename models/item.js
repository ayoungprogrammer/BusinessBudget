var mongoose = require('mongoose');


exports.ItemSchema = new mongoose.Schema({
	id: {type: String},
	desc: {type:String},
	cost : {type: Number, min:0 ,required : false},
	name: {type: String, require:true},
	folder:{type: Boolean},
	children:{type:[]}
	
});

