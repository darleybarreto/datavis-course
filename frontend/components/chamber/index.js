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
    partyExpensive(data)

  })
}

function loadChamberTimes(){
  window.onresize = function(){
    loadChamberGraphs()
  }

  d3.json("json_files/chamber/grouped.json",function(err,data){
    var cs_chb = crossfilter(data)
    // console.log(err);
    console.log("Data",data);
    //Domain Maniplation
    expansiveTypeChamberLoad(data)
    partyExpensive(data)

  })
}

function mainGraphLoad(crossfilter){
  var domain = []
  //Header
  document.getElementById("main").getElementsByClassName("header")[0].textContent = "Totais de gastos por ano"

  //Graph tag
  var main_graph = dc.compositeChart("#main")

  //Dimension of Graph
  var dim = crossfilter.dimension(function(d){domain.push(d.year); return d.year})

  //Domain manipulation
  // var last = domain.pop()
  // domain.reverse().push(last)
  // domain.reverse()
  // console.log(domain);

  //Group
  var grouped = dim.group().reduceSum(function(d){
    let res = d.content.sum_mean_max_year
    return res!= undefined ? res[0].sum.toFixed(0)/1000000 : 0 ;
  })

  //Width adjust
  var width = document.getElementById("main").getBoundingClientRect().width - 50;

  main_graph.width(width)
          .height(200)
          .margins({top: 50, right: 50, bottom: 25, left: 60})
          .dimension(dim)
          .x(d3.scale.ordinal().domain(domain))
          .xUnits(dc.units.ordinal)
          .elasticY(false)
          ._rangeBandPadding(1)
          .y(d3.scale.linear().domain([0, 180]))
          .yAxisLabel("Gastos por milhão")
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

  function totalByType(typeKey,id){
    var tag = document.getElementById(id).getElementsByClassName("footer")[0]
    var value = y.content.sum_mean_max_year_spents_type_total.filter(function(typ){
      if (typ.subquota_number == typeKey) return typ
    })[0].sum

    tag.textContent = "Tipo "+typeKey+"- Valor Bruto: R$ "+value.toFixed(2).toString().replace('.',',')
  }

  document.getElementById("card-1").getElementsByClassName("header")[0].textContent = "Distribuição de gastos do ano de "+year

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

  totalByType(domain[0],'card-1')

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
                .yAxisLabel("Porcentagem")
                .dimension(dim)
                .group(grouped)
                .on('renderlet', function(chart) {
                    chart.selectAll('rect').on("click", function(d) {
                      totalByType(d.data.key,'card-1')
                    });
                });
  //
  expensive_chart.render()
}

function partyExpensive(data){
  var party_chart = dc.bubbleChart('#party')

  document.getElementById("card-2").getElementsByClassName("header")[0].textContent = "Distribuição de gastos dos partidos no ano de "+year

  var cf_ex =  crossfilter(data.filter(function (d){
    if (d.year.toString() == year){
      y = d
      max = d.content.sum_mean_max_year[0].sum
      return d
    }
  })[0].content.sum_mean_max_year_meanspentbytype_normalizedbycount)

  var domain = []

  //Dimension of Graph
  var dim = cf_ex.dimension(function(d) {
    //console.log(d);
    //domain.push(d.subquota_number.toString())
    return [+d.sum.toFixed(0),+d.count,+d.mean,d.party]
  })

  //totalByType(domain[0],'card-1')

  //Group
  var grouped = dim.group().reduceSum(function(d){
    return d.count
  })

  var width = document.getElementById("party").getBoundingClientRect().width - 20;
  var colors = ["red", "#ccc","steelblue","green"]
  party_chart
    .width(width) // (optional) define chart width, :default = 200
    .height(350) // (optional) define chart height, :default = 200
    .transitionDuration(1000) // (optional) define chart transition duration, :default = 1000
    // (optional) define margins
    .margins({top: 50, right: 50, bottom: 50, left: 60})
    .dimension(dim) // set dimension
    /* Bubble chart expect the groups are reduced to multiple values which would then be used
     * to generate x, y, and radius for each key (bubble) in the group */
    .group(grouped)
    // (optional) define color function or array for bubbles
    //.colors(["red", "#ccc","steelblue","green"])
    // (optional) define color domain to match your data domain if you want to bind data or color
    //.colorDomain([-1750, 1644])
    // (optional) define color value accessor
    .colorAccessor(function(d, i){return colors[i%4] ;})
    // closure used to retrieve x value from multi-value group
    .keyAccessor(function(p) {return +p.key[0]/1000;})
    // closure used to retrieve y value from multi-value group
    .valueAccessor(function(p) {return +p.key[1];})
    // closure used to retrieve radius value from multi-value group
    .radiusValueAccessor(function(p) {return +p.key[2]/1000 ;})
    // set x scale
    .x(d3.scale.linear().domain([-5, 70]))
    // set y scale
    .y(d3.scale.linear().domain([-1, 15]))
    // (optional) whether chart should rescale y axis to fit data, :default = false
    .elasticY(false)
    // (optional) when elasticY is on whether padding should be applied to y axis domain, :default=0
    .yAxisPadding(100)
    // (optional) whether chart should rescale x axis to fit data, :default = false
    .elasticX(false)
    // (optional) when elasticX is on whether padding should be applied to x axis domain, :default=0
    .xAxisPadding(500)
    .xAxisLabel("Gasto por milhar")
    .yAxisLabel("Numero de Gastos")
    // set radius scale
    .r(d3.scale.linear().domain([0, 100]))
    // (optional) whether chart should render labels, :default = true
    .renderLabel(false)
    // (optional) closure to generate label per bubble, :default = group.key
    //.label(function(p) {return p.key[3]})
    // (optional) whether chart should render titles, :default = false
    .renderTitle(true)
    // (optional) closure to generate title per bubble, :default = d.key + ": " + d.value
    .title(function(p) {
         return  "Total: R$ "+p.key[0].toFixed(0) +",00\n"
                 +"Media: R$ " + p.key[2].toFixed(0) + ",00\n"
                 +"Partido: " +p.key[3] ;
    })
    // (optional) render horizontal grid lines, :default=false
    .renderHorizontalGridLines(true)
    // (optional) render vertical grid lines, :default=false
    .renderVerticalGridLines(true);

  party_chart.render()
}
