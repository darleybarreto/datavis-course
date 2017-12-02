function loadSenateGraphs(){
  window.onresize = function(){
    loadSenateGraphs()
  }
  d3.json("json_files/senate/grouped.json", function(err,data){
    lineGraphLoad(data);
  })
}

function loadSenateTimes(d){
  if (d==undefined){
    d3.json("json_files/senate/grouped.json", function(err,data){
      expansiveTypesLoad(data);
    })
  }
  else{
    expansiveTypesLoad(d);
  }
}


function lineGraphLoad(data){
    var domain = []
    var line_graph = dc.seriesChart("#main")
    var cs_lf = crossfilter(data);

    function getVal(y){
      var year_data = data.filter(function(y_d){
        if(y_d.year == y) return y_d
      })[0]
      return year_data.content.sum_mean_max_year[0].sum.toFixed(0)/1000000
    }

    var dim = cs_lf.dimension(function(d){domain.push(d.year.toString()); return [d.year,getVal(d.year)]});

    var aux = domain.pop()
    domain.reverse()
    domain.push(aux)
    domain.reverse()

    var grouped = dim.group().reduceSum(function(d){return +d.content.sum_mean_max_year[0].sum/1000000;});

    var width = document.getElementById("main").getBoundingClientRect().width - 50;

    document.getElementById("main").getElementsByClassName("header")[0].textContent = "Reimbursements by year"

    line_graph.width(width)
          .height(200)
          .chart(function(c) { return dc.lineChart(c).renderDataPoints(true); })
          .x(d3.scale.ordinal().domain(domain))
          .xUnits(dc.units.ordinal)
          .brushOn(false)
          .yAxisLabel("Gastos")
          .xAxisLabel("Ano")
          .clipPadding(10)
          ._rangeBandPadding(1)
          .elasticY(true)
          .dimension(dim)
          .group(grouped)
          .mouseZoomable(false)
          .seriesAccessor(function(d) {return })
          .keyAccessor(function(d) {return +d.key[0];})
          .valueAccessor(function(d) {return +d.key[1] ;})
          .legend(dc.legend().x(350).y(350).itemHeight(13).gap(5).horizontal(1).legendWidth(140).itemWidth(70));

    //
    line_graph.render()
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
