githubApiD3App.directive('d3BarChart', ['$window', 'd3Factory', 'd3TipFactory', function($window, d3Factory, d3TipFactory) {
    return {
        restrict: 'E',
        templateUrl: 'directives/d3Chart.htm',
        replace: true,
        scope: {
            chartContent: '=',
            userName: '@'
        },
        link: function(scope, element, attrs) {
            d3Factory.d3().then(function(d3) {
                
                console.log(scope.userName)
                var translateY = 100;
                var margin = {top: 20, right: 30, bottom: 30, left: 40},
                    width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;
                
                var svg = d3.select(".chart")
                            .append("svg")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                            .attr("transform", "translate("+ (margin.right+margin.top) + "," + margin.top + ")")
                            .style('width', '100%');
                
                //Browser onresize event
                window.onresize = function() {
                    scope.$apply();
                };
                
                var returnedRender;
                
                //Watch for resize event
                scope.$watch(function() {
                   return angular.element($window)[0].innerWidth; 
                }, function() {
                    scope.$watch('chartContent', function(newData, oldData){
                        if(newData) scope.render(scope.chartContent)
                    }, true);
                });
                
                scope.render = function(data) {
                    // remove all previous items before render
                    console.log(data)
                    svg.selectAll('*').remove();
                    
                    if(!data) return;
                    
                    var color = d3.scale.category20();

                    var x = d3.scale.ordinal()
                            .rangeRoundBands([0, width], .1),
                        y = d3.scale.linear()
                            .range([height-translateY, 0]);
                    
                    x.domain(data.map(function(d) { return d.literal; }));
                    
                    y.domain([0, d3.max(data, function(d) { return (d.count); })]);
                    
                    var xAxis = d3.svg.axis()
                                .scale(x)
                                .orient("bottom");

                    var yAxis = d3.svg.axis()
                                .scale(y)
                                .ticks(d3.max(data, function(d) { return d.count; }))
                                .tickFormat(d3.format("d"))
                                .tickSubdivide(0)
                                .orient("left");
                    
                    d3TipFactory.d3.tip().then(function(d3tip){
                        var chartTitle = "Letter Frequency in Usernames w/<span class='search-string'> "+ scope.userName + "<span> string";
                        var tip = d3tip.tip()
                                .attr('class', 'tool-tip')
                                .offset([-10, 0])
                                .html(function(d) {
                                   return "<strong>Count: </strong><span>" + d.count +"</span>";   
                                });
                    
                        svg.call(tip);
                    
                        svg.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(0," + height + ")")
                            .style("text-transform", "uppercase")
                            .call(xAxis);
                        

                        svg.append("g")
                            .attr("class", "y axis")
                            .attr("transform", "translate(0," + translateY + ")")
                            .call(yAxis)
                            .append("text")
                                .attr("transform", "rotate(-90)")
                                .attr("y", 6)
                                .attr("dy",".71em")
                                .style("text-anchor", "end")
                                .text("Letter Count");
                        
                        svg.append("g")
                            .append("text")
                            .attr("x", (width / 2))
                            .attr("y", margin.top)
                            .attr("text-anchor", "middle")
                            .style("font-size", "16px")
                            .style("text-decoration", "underline")
                            .text('Letter Frequency of Usernames w/ '+ '"' + scope.userName + '"' + ' in Them'); 
                            

                        svg.selectAll('rect')
                            .data(data)
                            .enter()
                                .append('rect')
                                .attr("x", function(d) { return x(d.literal); })
                                .attr('y', function(d) { return y(d.count); })
                                .attr('height', function(d) { return (height - y(d.count))-translateY; })
                                .attr('width', x.rangeBand())
                                .attr("class","bar")
                                .attr('fill', function(d) { return '#f0ad4e'; })
                                .attr("transform", "translate(0," + translateY +")")
                                .on('mouseover', tip.show)
                                .on('mouseout', tip.hide);
                    });
                }
            });
        }
    };
}]);