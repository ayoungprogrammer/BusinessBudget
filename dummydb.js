var data = {"items" : 	[{'name' : 'Transport',
							'id': 'transport',
							'folder': true,
							'children':[{'name': 'Truck',
									'id': 'transport.truck',
									'desc':'A truck',
									'cost': 31250},
										]
							},
			            {'name' : 'Staff',
							'id': 'staff',
							'folder':true,
							'children':[{'name': 'Programmer',
									'id': 'staff.programmer',
									'desc':'A programmer',
									'cost': 82250},
						           	]}
			            ]};

function clone(obj){
	return JSON.parse(JSON.stringify(obj));
}

exports.setData=function(tData){
	data = clone(tData);
};

exports.getItems = function(){
	return data.items;
};

exports.getItem = function(id){
	
	return getItem(data.items,id.split('.'));
};

exports.updateItem = function(item){
	if(!item){
		return false;
	}
	if(item.folder){
		if(!item.folder || !item.id || !item.name){
			console.log("UPDATE: ERROR ADDING FOLDER (MISSING PROPS)");
			return false;
		}
	}
	else{
		if(!item.name || !item.desc||!item.cost ||!item.name ||!item.id){
			console.log("UPDATE: ERROR ADDING ITEM (MISSING PROPS)");
			return false;
		}
	}
	
	return updateItem(data.items,item,item.id.split('.'));
};

exports.createItem=function(item){
	
	if(!item){
		return false;
	}
	if(item.folder){
		if(!item.folder || !item.id || !item.name){
			console.log("CREATE: ERROR ADDING FOLDER (MISSING PROPS)");
			return false;
		}
	}
	else{
		if(!item.name || !item.desc||!item.cost ||!item.name ||!item.id){
			console.log("CREATE: ERROR ADDING ITEM (MISSING PROPS)");
			return false;
		}
	}
	
	return insertItem(data.items,item,item.id.split('.'));
};

exports.deleteItem = function(id){
	return deleteItem(data.items,id.split('.'));
};

function getItem(data,tokens){
	if(!data){
		console.log("GET: ERROR INVALID ID(1)");
		return undefined;
	}
	
	
	if(tokens.length==0){
		return data;
	}
	
	for(var i = 0;i<data.length;i++){
		var id = data[i].id.split('.');
		
		
		if(id[id.length-1] == tokens[0]){
			if(tokens.length==1){
				return data[i];
			}
			else{
				tokens.splice(0,1);
				return getItem(data[i].children,tokens);
			}
		}
	}
	console.log("GET: ERROR INVALID ID(2)");
	return undefined;
}


function deleteItem(data,tokens){
	
	if(!data){
		console.log("DELETE: ERROR INVALID ID(1)");
		return false;
	}
	
	if(tokens.length==0){
		console.log("DELETE: ERROR INVALID ID(2)");
		return false;
	}
	
	for(var i = 0;i<data.length;i++){
		var id = data[i].id.split('.');
		
		
		if(id[id.length-1] == tokens[0]){
			if(tokens.length==1){
				data.splice(i,1);
				return true;
			}
			else{
				tokens.splice(0,1);
				return deleteItem(data[i].children,tokens);
			}
			
		}
	}
	console.log("DELETE: ERROR INVALID ID(3)");
	return false;
};

function updateItem(data,item,tokens){
	
	if(!data){
		console.log("UPDATE: ERROR INVALID ID(1)");
		return false;
	}
	
	
	for(var i = 0;i<data.length;i++){
		var id = data[i].id.split('.');
		
		if(id[id.length-1] == tokens[0]){
			if(tokens.length == 1){
				data[i] = item;
				return true;
			}else {
				tokens.splice(0,1);
				return updateItem(data[i].children,item,tokens);
			}
		}
	}
	console.log("UPDATE: ERROR INVALID ID(2)");
	return false;
}

function insertItem(data,item,tokens){
	
	if(!data){
		console.log("CREATE: ERROR INVALID ID");
		return false;
	}
	
	if(tokens.length==1){
		data.push(item);
		return true;
	}
	
	for(var i = 0;i<data.length;i++){
		var id = data[i].id.split('.');
		
		
		if(id[id.length-1] == tokens[0]){
			tokens.splice(0,1);
			return insertItem(data[i].children,item,tokens);
		}
	}
	console.log("CREATE: ERROR INVALID ID");
	return false;
};
