githubApiD3App.service('githubApiService', ['$http', function($http){
    this.getUsernames = function (searchString){
        return $http.get("https://api.github.com/search/users?q=" + searchString).then(function(response){
            return response;
        });
    };
}]);