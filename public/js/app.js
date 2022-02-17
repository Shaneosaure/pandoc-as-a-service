'use strict';


// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', []);

myApp.service('FormatsService', function() {
  return {
    input: [
      'markdown',
    ],
    output: [
      'pdf',
    ]
  };
});


myApp.controller('AppCtrl', function($scope, $http, FormatsService) {

  $scope.inputFormat = 'markdown';
  $scope.outputFormat = 'pdf';
  
  $scope.inputFormats = FormatsService.input;
  $scope.outputFormats = FormatsService.output
  
  $scope.input = "# hello";
  
  $scope.download = function (inputFormat, outputFormat) {
  	if (outputFormat === 'pdf' && inputFormat === 'markdown'){
      $scope.output = 'Downloading..';
      var request = {
          method: 'GET',
          url: '/convert/download'
      };
      $http(request).success(function(data, status, headers, config) {
          $scope.output = 'File downloaded !';
    	}).error(function(data, status, headers, config) {
      		$scope.output = 'Oh no, a mistake...';
    	});
    };  
  };
  $scope.convertPDF = function (inputFormat, outputFormat, data) {
  	if (outputFormat === 'pdf' && inputFormat === 'markdown'){
      $scope.output = 'Converting...';
      var request = {
          method: 'POST',
          url: '/convert/download',
          data: data
      };
      $http(request).success(function(data, status, headers, config) {
          $scope.output = 'You can now download your file';
    	}).error(function(data, status, headers, config) {
      		$scope.output = 'Oh no, a mistake...';
    	});
	  }else {
		  $scope.output= 'Only works for Markdown to PDF';
	  };
  };
  $scope.convert = function (inputFormat, outputFormat, data) {
    if (outputFormat === 'pdf'){
    	$scope.output = 'Click on convert to PDF instead';
    }else { 
      var request = {
          method: 'POST',
          url: '/convert' + outputFormat,
          headers: {
            'Content-Type': "text/" + inputFormat
          },
            data: data
      };

    	$http(request).success(function(data, status, headers, config) {
      		$scope.output = data;
    	}).error(function(data, status, headers, config) {
      		$scope.output = data;
    	});
    };
  };
});
