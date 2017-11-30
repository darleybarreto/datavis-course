function loadChamberGraphs(){
  window.onresize = function(){
    loadChamberGraphs()
  }

  d3.json("json_files/chamber/grouped.json",function(err,data){
    var cs_chb = crossfilter(data)
    var domain = []
    var year_dim = cs_chb.dimension(function(d){domain.push(d.year); return d.year})
    // console.log(err);
    console.log(data);

    mainGraphLoad(year_dim,domain);
    // expansiveTypesLoad()

  })

}

function mainGraphLoad(dim,domain){
  console.log(dim);
  var main_graph = dc.compositeChart("#main")
  var groped = dim.group().reduceSum(function(d){console.log(d);})
  var width = document.getElementById("main").getBoundingClientRect().width - 50;

  main_graph.width(width)
          .height(200)
          .margins({top: 50, right: 50, bottom: 25, left: 60})
          .dimension(groped)
          .x(d3.scale.ordinal().domain(domain))
          .xUnits(dc.units.ordinal)
          .elasticY(true)
          ._rangeBandPadding(1)
          .yAxisLabel("Gastos/1000")
          .renderHorizontalGridLines(true)
          .legend(dc.legend().x(width-100).y(40).itemHeight(13).gap(5))
          .brushOn(false)
          .compose([
             dc.lineChart(main_graph)
                       .renderDataPoints(true)
                       .renderArea(true)
                       .group(groped, 'Gastos')

            ]);

  //
  main_graph.render()

}
