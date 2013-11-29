var mongoose = require('mongoose');

exports.ItemSchema = new mongoose.Schema({
	image: {type: String},
	desc: {type:String},
	cost : {type: Number, min:0 ,required : true},
	name: {type: String, require:true}
});