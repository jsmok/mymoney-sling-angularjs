myMoneyApp.controller('billsCtrl', function($scope, $http) {
	$scope.products = [ {
		"name" : "Majonez",
		"value" : 3.5
	}, {
		"name" : "Papryka",
		"value" : 3
	}, {
		"name" : "Bulka",
		"value" : 2
	} ];

	$scope.addProduct = function() {
		name = $scope.enteredValue
		$scope.products.push({
			"name" : $scope.enteredName,
			"value" : $scope.enteredValue
		});
		$scope.enteredName = '';
		$scope.enteredValue = '';
		
		$scope.total = 0;
		angular.forEach($scope.products, function(value, key) {
			$scope.total = $scope.total + +value.value;
		});
	};

	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope.opened = true;
	};
	
	$scope.postReceipt = function() {
		
		var yyyy = $scope.date.getFullYear().toString();
		var mm = ($scope.date.getMonth()+1).toString(); // getMonth() is zero-based
		mm = mm[1]?mm:"0"+mm[0];
		var dd  = $scope.date.getDate().toString();
		dd = dd[1]?dd:"0"+dd[0];
		
		$http({
	        method  : 'POST',
	        url     : '/content/mymoney/bills/'+yyyy+'/'+mm+'/'+dd+'/'+$scope.desc,
	        data    : $.param({
	        	desc			: $scope.desc,
	        	"date@TypeHint"	: "Date",
	        	date			: $scope.date
	        }), // jQuery needed - why AngularJS, why?
	        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
	    })
	        .success(function(data) {
	            console.log(data);

	            if (!data.success) {
	            	// if not successful, bind errors to error variables
	                //$scope.errorName = data.errors.name;
	                //$scope.errorSuperhero = data.errors.superheroAlias;
	            } else {
	            	// if successful, bind success message to message
	                //$scope.message = data.message;
	            }
	        });
	};
});