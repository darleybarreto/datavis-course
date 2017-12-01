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

function mainGraphLoad(crossfilter){
  var domain = []
  //Header
  document.getElementById("main").getElementsByClassName("header")[0].textContent = "Totais de gastos por ano"

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
  document.getElementById("card-1").getElementsByClassName("header")[0].textContent = "Tipos de gastos do ano de "+year

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
                .yAxisLabel("Gasto/1000")
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

  document.getElementById("card-2").getElementsByClassName("header")[0].textContent = "Partido que mais gastou no ano de "+year

  var cf_ex =  crossfilter(data.filter(function (d){
    if (d.year.toString() == year){
      y = d
      max = d.content.sum_mean_max_year[0].sum
      return d
    }
  })[0].content.sum_mean_max_year_party_maxtotal)

  var domain = []

  //Dimension of Graph
  var dim = cf_ex.dimension(function(d) {
    console.log(d);
    //domain.push(d.subquota_number.toString())
    //return d.subquota_number
  })

  //totalByType(domain[0],'card-1')

  //Group
  var grouped = dim.group().reduceSum(function(d){
    return +d.sum/max
  })

  var width = document.getElementById("party").getBoundingClientRect().width - 20;
  //
  // dc.rowChart("#days-of-week-chart", "chartGroup")
  //   .width(180) // (optional) define chart width, :default = 200
  //   .height(180) // (optional) define chart height, :default = 200
  //   .group(grouped) // set group
  //   .dimension(dim) // set dimension
  //   // (optional) define margins
  //   .margins({top: 20, left: 10, right: 10, bottom: 20})
  //   // (optional) define color array for slices
  //   .colors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
  //   // (optional) set gap between rows, default is 5
  //   gap(7)
  //   // (optional) set x offset for labels, default is 10
  //   labelOffSetX(5)
  //   // (optional) set y offset for labels, default is 15
  //   labelOffSetY(10)
  //   // (optional) whether chart should render labels, :default = true
  //   .renderLabel(true)
  //   // (optional) by default pie chart will use group.key and group.value as its title
  //   // you can overwrite it with a closure
  //   .title(function(d) { return d.data.key + "(" + Math.floor(d.data.value / all.value() * 100) + "%)"; })
  //   // (optional) whether chart should render titles, :default = false
  //   .renderTitle(true);
  //   // (optional) specify the number of ticks for the X axis
  //   .xAxis().ticks(4);

}
