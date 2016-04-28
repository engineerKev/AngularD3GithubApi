//CONTROLLERS
githubApiD3App.controller('homeController', ['$scope', '$location', function($scope, $location){
    
    $scope.username = '';
    
    $scope.submit = function(){
        $location.path("/usernames/"+$scope.username);
    }
    
}]);

githubApiD3App.controller('usernameDataController', ['$scope', '$routeParams', '$location', 'githubApiService', function($scope, $routeParams, $location, githubApiService){
    var start = 0;
    var deleteCount = 5;
    var loginCharsArray = [];
    var chartDataObj = {};
    
    $scope.username = '';
    
    $scope.searchString = $routeParams.usernameQuery;
    
    $scope.submit = function(){
        $location.path("/usernames/"+$scope.username);
    };

    githubApiService.getUsernames($scope.searchString).then(function(results){
        
        $scope.returnedUsers = results.data.items.splice(start, deleteCount);
        
        $scope.sortedUsers = $scope.returnedUsers.sort(loginCompare);
        
        $scope.sortedUsers.forEach(function(elem){
            loginCharsArray.push(elem.login.split(''));
        });

        for(var i = 0; i < loginCharsArray.length; i++){
            chartDataObj = getLetterCount(chartDataObj, loginCharsArray[i]);
        }

        $scope.chartData = [];

        for(var elm in chartDataObj){
            if(elm !== 'other')
                $scope.chartData.push(chartDataObj[elm]);
        }
        
        $scope.chartData.sort(lettersCompare)
        
        if(chartDataObj.other) $scope.chartData.push(chartDataObj['other']);
       
    });
    
    var loginCompare = function(a, b){
        if(a.login.toLocaleLowerCase() > b.login.toLocaleLowerCase())
            return 1;
        else if(a.login.toLocaleLowerCase() < b.login.toLocaleLowerCase())
            return -1;
        else 
            return 0;
    };
    
    var getLetterCount = function(letterFrequency,loginNameArr){
        if(!loginNameArr.length){
            return letterFrequency;
        }else{
            var current = loginNameArr.pop();
            current = current.toLowerCase();
            if(letterFrequency[current]){
                letterFrequency[current].count += 1;
                return getLetterCount(letterFrequency, loginNameArr);
            }else if(current.match(/^[a-zA-Z]/)){
                letterFrequency[current] = {};
                letterFrequency[current].count = 1;
                letterFrequency[current].literal = current;
                return getLetterCount(letterFrequency, loginNameArr);
            }else{
                if(letterFrequency['other']){
                    letterFrequency['other'].count += 1;
                }else{
                    letterFrequency['other'] = {};
                    letterFrequency['other'].count = 1;
                    letterFrequency['other'].literal = 'other'
                }
                return getLetterCount(letterFrequency, loginNameArr);
            }
        }
    };
    
    var lettersCompare = function(a, b){
        if(a.literal > b.literal)
            return 1;
        else if(a.literal < b.literal)
            return -1;
        else 
            return 0;
    };
    
}]);
