myMoneyApp.controller('billsCtrl', function($scope, $http) {
//	view switches
	$scope.toggleAddProduct = false;
//	bills list
	$scope.bills = [];
//  products section in bill create / update	
	$scope.products = [];
	$scope.total = 0;
	
	$scope.isEditMode = false;	
	
	getSimpleDate = function(date) {
		var yyyy = date.getFullYear().toString();
		var mm = (date.getMonth() + 1).toString();
		mm = mm[1] ? mm : "0" + mm[0];
		var dd = date.getDate().toString();
		dd = dd[1] ? dd : "0" + dd[0];
		var simpleDate = {
			year  :  yyyy,
			month : mm,
			day   : dd
		};
		return simpleDate;
	}
	
	getSimpleDateString = function(date) {
		var simpleDate = getSimpleDate(date);
		return simpleDate.year + '-' + simpleDate.month + '-' + simpleDate.day
	}
	
	$scope.createOrUpdateBill = function() {
		if($scope.isEditMode) {
			$scope.updateBill();
		} else {
			$scope.createBill();
		}
	}

	$scope.createBill = function() {
		
		var simpleDate = getSimpleDate($scope.billDate);

		var params = {};
		params["sling:resourceType"] = "mymoney:bill";
		params["name"] = $scope.billName;
		params["date@TypeHint"] = "Date";
		params["date"] = $scope.billDate;
		params["total"] = $scope.total;
		params["total@TypeHint"] = "Double";
		angular.forEach($scope.products, function(value, key) {
			params['products/' + value.name + '/value'] = value.value;
		});
		
		$http({
			method : 'POST',
			url : '/content/mymoney/bill-data/' + simpleDate.year
					+ '/' + simpleDate.month + '/' + simpleDate.day + '/'
					+ $scope.billName,
			data : $.param(params), // jQuery needed - why AngularJS, why?
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
			// set the headers so angular passing info as
			// form data (not request payload)
		})
		.success(function(data) {
			console.log(data);
			$scope.billName = '';
			$scope.billDate = '';
			$scope.products = [];
			$scope.getBills();
		});
	};
	
	$scope.editBill = function(path) {
		 $http({
			 method : 'GET',
			 url : path+".harray.infinity.json"
	     })
	     .success(function(data) {
	    	 console.log(data);
	    	 $scope.billName = data.name;
	    	 $scope.billDate = getSimpleDateString(new Date(data.date));
	    	 $scope.products = data.__children__[0].__children__;
	    	 $scope.total = 0;
	    	 angular.forEach($scope.products, function(value, key) {
	 			value.name = value.__name__;
	 			$scope.total = $scope.total + +value.value;
	 		 });
	    	 $scope.isEditMode = true;
	    	 console.log( $scope.products);
	     });
	}
	
	$scope.deleteBill = function(path) {
		$http({
			method : 'POST',
			url : path,
			data : $.param({
				":operation": 'delete'
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		})
		.success(function(data) {
			console.log(data);
			$scope.getBills();
		});
	}
	
	$scope.getBills = function() {
        $http({
        	method : 'GET',
        	url : "/content.query.tidy.inifinity.json?queryType=xpath&statement=//*[@sling:resourceType = 'mymoney:bill'] order by @date descending&property=total&property=date"
        })
        .success(function(data, status) {
        	console.log(data);
        	angular.forEach(data, function(value, key) {
    			value.date = new Date(value.date);
    		});
        	$scope.bills = data;
        });
    };
    $scope.bills = $scope.getBills();
    
	$scope.addProduct = function() {
		name = $scope.productValue
		$scope.products.push({
			"name" : $scope.productName,
			"value" : $scope.productValue
		});
		$scope.productName = '';
		$scope.productValue = '';

		$scope.total = 0;
		angular.forEach($scope.products, function(value, key) {
			$scope.total = $scope.total + +value.value;
		});
	};
	
	$scope.showAddProduct = function() {
		$scope.productName = '';
		$scope.productValue = '';
		$scope.toggleAddProduct = true;
	}
	
	$scope.cancelAddProduct = function() {
		$scope.productName = '';
		$scope.productValue = '';
		$scope.toggleAddProduct = false;
	}
    
//	datepicker
	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope.opened = true;
	};
	
	
});

