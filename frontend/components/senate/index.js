function loadSenateGraphs(){
  lineGraphLoad();
  dc.renderAll()
}


function lineGraphLoad(){
  d3.json("json_files/senate/sum_mean_max_year.json", function(err,data){
    //console.log(data);
    //console.log(err);
    var line_graph = dc.lineChart("#line")
    var cs_lf = crossfilter(data);

    var expensiveDim = cs_lf.dimension(function(d){ console.log(d.max);return d.max });
    var expensiveGro = expensiveDim.group();

    line_graph.width(960)
         .height(150)
         .transitionDuration(500)
         .margins({top: 10, right: 10, bottom: 20, left:40})
         .dimension(expensiveDim)
         .group(expensiveGro)
         .brushOn(false)
         .elasticY(true)
         .x(d3.scale.linear().domain([2008,2017]));
  })


}
