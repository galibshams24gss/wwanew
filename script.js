var app = angular.module("Weatherapp", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "home.html",
		controller : "homeController" 
    })
	.when('/current', {
		templateUrl: "current.html",
		controller : "currentController"
	})
    .when("/forecast", {
        templateUrl : "forecast.html",
		controller : "forecastController"
	})
	.when("/global", {
        templateUrl : "global.html",
		controller : "globalController"
    })
})
	.controller("homeController", function($scope){
	$scope.message = "Home";
	})
	
	.controller("forecastController", function($scope, $http){
		var vm = $scope;
		vm.forecastWeather = {
			heading: "5 Days Local Forecast with Every 3 Hours"
		};
		$http.get("http://ip-api.com/json").then(function(data){
        vm.lat = data.data.lat;
        vm.lon = data.data.lon;
        var apiKey = "67253160592ac81fbbb5d28c91d67d5c";
        var openWeatherUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + vm.lat + "&lon=" + vm.lon + "&appid=" + apiKey;
		$http.get(openWeatherUrl).then(function(data){
			//console.log(openWeatherUrl);
			//console.log(data);
			vm.currentlist = data.data.list;

			vm.convertToMph = function(ws){
				return (2.237*ws).toFixed(1);
			}

		},function(error){
        console.log(error, 'can not get data.');
		});
     },function(error){
        console.log(error, 'can not get data.');
	});
	})
	
	.controller("currentController", function($scope, $http){
	var vm = $scope;
    vm.currentWeather = {
		heading1: "Weather Today",
		heading2: "Location",
		heading3: "Weather Type"
    };
	$http.get("http://ip-api.com/json").then(function(data){
        vm.lat = data.data.lat;
        vm.lon = data.data.lon;
        var apiKey = "67253160592ac81fbbb5d28c91d67d5c";
        var openWeatherUrl = "http://api.openweathermap.org/data/2.5/weather?lat=" + vm.lat + "&lon=" + vm.lon + "&appid=" + apiKey;
        $http.get(openWeatherUrl).then(function(data){
            //console.log(openWeatherUrl);
			vm.currentdate = data.data.dt*1000;
            vm.description = data.data.weather[0].description;
            vm.speed = (2.237*data.data.wind.speed).toFixed(1) + " mph";
			vm.name = data.data.name;
			
            vm.temp = data.data.main.temp;
            vm.fTemp = (vm.temp*(9/5)-459).toFixed(1) + " °F";
			vm.cTemp = (vm.temp-273).toFixed(1) + " °C";

			vm.tempmax = data.data.main.temp_max;
			vm.fTempmax = (vm.tempmax*(9/5)-459).toFixed(1) + " °F";
			vm.cTempmax = (vm.tempmax-273).toFixed(1) + " °C";
			vm.tempmin = data.data.main.temp_min;
			vm.fTempmin = (vm.tempmin*(9/5)-459).toFixed(1) + " °F";
			vm.cTempmin = (vm.tempmin-273).toFixed(1) + " °C";
            vm.icon = "http://openweathermap.org/img/w/" + data.data.weather[0].icon + ".png";
			
       },function(error){
        console.log(error, 'can not get data.');
    });
    },function(error){
        console.log(error, 'can not get data.');
    });
	})

	.controller("globalController", function($scope, $http){
		var vm = $scope;
		vm.global = {
			heading: "5 Days Global Forecast with Every 3 Hours"
		};
		vm.city = null;
		vm.processSearch = function () {
			//console.log(vm.city);
			var apiKey = "67253160592ac81fbbb5d28c91d67d5c";
			var openWeatherUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + vm.city + ",us&appid=" + apiKey;
			//console.log(openWeatherUrl);
			$http.get(openWeatherUrl).then(function(data){
			//console.log(openWeatherUrl);
			//console.log(data);
			vm.currentlist = data.data.list;
			vm.validTable = data.data.list !==false;
			vm.convertToMph = function(ws){
				return (2.237*ws).toFixed(1);
			}
			},function(error){
				vm.err = "Sorry, " + vm.city + " not found";
				vm.notFound = vm.err !== false;
			});
		}
	})