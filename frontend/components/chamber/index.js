function loadChamberGraphs(){
  window.onresize = function(){
    loadChamberGraphs()
  }

  d3.json("json_files/chamber/grouped.json",function(err,data){
    var cs_chb = crossfilter(data)
    // console.log(err);
    console.log("Data",data);
    //Domain Maniplation
    mainGraphLoad(cs_chb);
    expansiveTypeChamberLoad(data)

  })

}

function mainGraphLoad(crossfilter){
  var domain = []

  //Graph tag
  var main_graph = dc.compositeChart("#main")

  //Dimension of Graph
  var dim = crossfilter.dimension(function(d){domain.push(d.year); return d.year})

  //Domain manipulation
  var last = domain.pop()
  domain.reverse().push(last)
  domain.reverse()
  console.log(domain);

  //Group
  var grouped = dim.group().reduceSum(function(d){
    let res = d.content.sum_mean_max_year
    return res!= undefined ? res[0].sum/1000 : 0 ;
  })

  //Width adjust
  var width = document.getElementById("main").getBoundingClientRect().width - 50;

  main_graph.width(width)
          .height(200)
          .margins({top: 50, right: 50, bottom: 25, left: 60})
          .dimension(dim)
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
                       .group(grouped, 'Gastos')
            ]);

  //
  main_graph.render()

}


function expansiveTypeChamberLoad(data){
  var expensive_chart = dc.barChart("#type")
  var max;
  var y;

  document.getElementsByClassName("header_extyp")[0].textContent = "Tipos de gastos do ano de "+year

  function totalByType(typeKey){
    var tag = document.getElementById("card-1").getElementsByClassName("footer")[0]
    var value = y.content.sum_mean_max_year_spents_type_total.filter(function(typ){
      if (typ.subquota_number == typeKey) return typ
    })[0].sum

    tag.textContent = "Tipo "+typeKey+"- Valor Bruto: R$ "+value.toFixed(2).toString().replace('.',',')
  }

  var cf_ex =  crossfilter(data.filter(function (d){
    if (d.year.toString() == year){
      y = d
      max = d.content.sum_mean_max_year[0].sum
      return d
    }
  })[0].content.sum_mean_max_year_spents_type_total)

  var domain = []

  //Dimension of Graph
  var dim = cf_ex.dimension(function(d) {
    domain.push(d.subquota_number.toString())
    return d.subquota_number
  })

  totalByType(domain[0])

  //Group
  var grouped = dim.group().reduceSum(function(d){
    return +d.sum/max
  })

  var width = document.getElementById("type").getBoundingClientRect().width - 20;

  expensive_chart.width(width)
                .height(350)
                .x(d3.scale.ordinal().domain(domain))
                .xUnits(dc.units.ordinal)
                .margins({top: 50, right: 50, bottom: 50, left: 60})
                .brushOn(false)
                .xAxisLabel("Tipos de gastos")
                .yAxisLabel("Gasto/1000")
                .dimension(dim)
                .group(grouped)
                .on('renderlet', function(chart) {
                    chart.selectAll('rect').on("click", function(d) {
                      totalByType(d.data.key)
                    });
                });
  //

  expensive_chart.render()
}
