//routes
githubApiD3App.config(function($routeProvider){
    $routeProvider
    .when('/', {
        templateUrl: 'pages/home.htm',
        controller: 'homeController'
        
    })
    
    .when('/usernames/:usernameQuery', {
        templateUrl: 'pages/usernameData.htm',
        controller: 'usernameDataController'
    })
});