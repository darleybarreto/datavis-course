function loadSenateGraphs(){
  window.onresize = function(){
    loadSenateGraphs()
  }

  lineGraphLoad();
  expansiveTypesLoad();

}


function loadSenateTimes(){
  window.onresize = function(){
    loadSenateGraphs()
  }

  expansiveTypesLoad();
 
}


function lineGraphLoad(){
  d3.json("json_files/senate/sum_mean_max_year.json", function(err,data){
    console.log(data);
    console.log(err);
    //console.log(err);
    var line_graph = dc.compositeChart("#main")
    var cs_lf = crossfilter(data);
    var domain = []
    var expensiveDim = cs_lf.dimension(function(d){domain.push(d.year.toString()); return d.year.toString() });
    var expensiveGro = expensiveDim.group().reduceSum(function(d){return +d.sum/1000000;});
    var width = document.getElementById("main").getBoundingClientRect().width - 50;
    document.getElementById("main").getElementsByClassName("header")[0].textContent = "Totais de gastos por ano"

    line_graph.width(width)
            .height(200)
            .margins({top: 50, right: 50, bottom: 25, left: 60})
            .dimension(expensiveDim)
            .x(d3.scale.ordinal().domain(domain))
            .xUnits(dc.units.ordinal)
            .y(d3.scale.linear().domain([0, 26]))
            .elasticY(false)
            ._rangeBandPadding(1)
            .yAxisLabel("Gastos por milhão")
            .renderHorizontalGridLines(true)
            .legend(dc.legend().x(width-100).y(40).itemHeight(13).gap(5))
            .brushOn(false)
            .compose([
               dc.lineChart(line_graph)
                         .renderDataPoints(true)
                         .renderArea(true)
                         .group(expensiveGro, 'Gastos')

              ]);

    //
    line_graph.render()
  })
}

function expansiveTypesLoad(){
  d3.json("json_files/senate/sum_mean_max_year_spents_type_total_normalizedbycount.json", function(err,data){
    // console.log(data);
    // console.log(err);
    // var line_typs = dc.compositeChart("#dist")
    // var cs_lf = crossfilter(data);
    // var domain = []
    // var expensiveDim = cs_lf.dimension(function(d){domain.push(d.year.toString()); return d.year.toString() });
    // var expensiveGro = expensiveDim.group().reduceSum(function(d){return +d.max/1000;});
    // var width = document.getElementById("line").getBoundingClientRect().width - 50;
    //
    // line_typs.width(width)
    //         .height(200)
    //         .margins({top: 50, right: 50, bottom: 25, left: 60})
    //         .dimension(expensiveDim)
    //         .x(d3.scale.ordinal().domain(domain))
    //         .xUnits(dc.units.ordinal)
    //         .elasticY(true)
    //         ._rangeBandPadding(1)
    //         .yAxisLabel("Gastos/100")
    //         .renderHorizontalGridLines(true)
    //         .legend(dc.legend().x(width-100).y(40).itemHeight(13).gap(5))
    //         .brushOn(false)
    //         .compose([
    //            dc.lineChart(line_typs)
    //                      .renderDataPoints(true)
    //                      .renderArea(true)
    //                      .group(expensiveGro, 'Gastos')
    //
    //           ]);
    //  //
    // line_typs.render()
  })
}
