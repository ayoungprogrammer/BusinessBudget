

Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return '$'+s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };
 
 function Item(item){
	 
	 this.price = item;
	 this.id = item.id;
	 this.name = item.name;
	 this.cost = item.cost;
	 this.desc = item.desc;
	 this.quantity = 0;
	 
 }

function AdminController($scope,$http){
	
	const CREATE_MODE = 1;
	const EDIT_MODE = 2;
	
	$scope.selectID = '';
	
	$scope.items = [{'id':'','name':'root','folder':true}];
	var root = $scope.items[0];
	//$scope.$scope[tree].currentNode = root;
	$scope.search = '';
	$scope.name = '';
	$scope.folder = false;
	$scope.mode = 0;
	
	$scope.update = function(){
		$http.get('/api/items').success(function (data){
			root.children = data.items;
			$scope.items.forEach(function(item,i){
				console.log(item);
			});
		});
	};
	
	
	
	$scope.submit = function(){
		var newItem = {'id':$scope.id,
				'name':$scope.name,
				'desc':$scope.desc,
				'cost':$scope.cost,
				'folder':$scope.folder};
		if($scope.mode==EDIT_MODE){
			$http.put('/api/items/',newItem).success(function (){
				$scope.update();
			});
		}
		if($scope.mode==CREATE_MODE){
			$http.post('/api/items/',newItem).success(function (){
				$scope.update();
			});
		}
		$scope.mode = 0;
		
	};
	
	$scope.$watch('[name,mode]',function(){
		
		if($scope.mode==EDIT_MODE){
			$scope.id = $scope.selectID;
		}
		if($scope.mode==CREATE_MODE){
			if($scope.selectID.length>0){
				$scope.id = $scope.selectID+'.';
			}else {
				$scope.id = '';
			}
			
			$scope.id+=$scope.name.replace(/ /g,"_").toLowerCase();
					
		}
	},true);
	
	$scope.editItem = function(item){
		$scope.selectID = item.id;
		$scope.name = item.name;
		$scope.folder = item.folder?true:false;
		$scope.cost = item.cost;
		$scope.desc = item.desc;
		$scope.mode = EDIT_MODE;

	};
	
	$scope.create = function(){
		var node = $scope.tree.currentNode;
		if(node){
			if(node.folder){
				$scope.selectID = node.id;
				$scope.id = node.id;
				$scope.name = '';
				$scope.folder = false;
				$scope.cost = undefined;
				$scope.desc = undefined;
				$scope.mode = CREATE_MODE;
			}
		}
	};
	
	$scope.deleteItem = function (item){
		$http.delete('/api/items/'+item.id).success(function(data){
			$scope.update();
		});
	};
	
	
	$scope.update();
	
}

function ItemController($scope,$http){
	
	$scope.items = [];
	$scope.basket = [];
	$scope.search = '';
	
	$scope.items = [{'id':'','name':'root','folder':true}];
	var root = $scope.items[0];
	
	$http.get('/api/items').success(function (data){
		root.children = data.items;
	});
	
	$scope.total = function(){
		
		var sum = 0;
		$scope.basket.forEach(function(item){
			sum+=item.cost * item.quantity;
		});
		return sum.formatMoney(2,'.',',');
	};
	
	$scope.addItem = function (item){
		if(item){
			$scope.basket.push(new Item(item));
		}
	};
	
	$scope.removeItem = function(item){
		var index = $scope.basket.indexOf(item);
		if(index >= 0){
			$scope.basket.splice(index,1);
		}
	};
	
	
};