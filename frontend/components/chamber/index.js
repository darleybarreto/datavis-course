function loadChamberGraphs(){
  window.onresize = function(){
    loadChamberGraphs()
  }

  d3.json("json_files/chamber/grouped.json",function(err,data){
    mainGraphLoad(data);
    meanmean(data)
    loadChamberTimes(data);

  })
}

function loadChamberTimes(d){
  if (d == undefined){
    d3.json("json_files/chamber/grouped.json",function(err,data){
      expansiveTypeChamberLoad(data)
      // partyExpensive(data)
      scatterChart(data)
    })
  }
  //
  else{
    expansiveTypeChamberLoad(d)
    // partyExpensive(d)
    scatterChart(d)
  }
}

function meanmean(data){
  document.getElementById("mean").getElementsByClassName("header")[0].textContent = "Mean party net value by year in R$ 1000";

  var max_mean_by_year = {},
      min_mean_by_year = {},
      mean_mean_by_year = {};

  data.forEach(function(d){
    let res = d.content.sum_mean_party_year;

    res.forEach(function(element){
      if(!(element.year in max_mean_by_year)){
        max_mean_by_year[element.year] = {"party": element.party, "max": element.mean};
      }
      else{
        if(element.mean > max_mean_by_year[element.year]["max"])
          max_mean_by_year[element.year] = {"party": element.party, "max": element.mean};
      }

      if(!(element.year in min_mean_by_year)){
        min_mean_by_year[element.year] = {"party": element.party, "min": element.mean};
      }
      else{
        if(element.mean < min_mean_by_year[element.year]["min"])
          min_mean_by_year[element.year] = {"party": element.party, "min": element.mean};
      }

      if(!(element.year in mean_mean_by_year)){
        mean_mean_by_year[element.year] = {"sum": element.mean, "count":0};

      }
      else{
        mean_mean_by_year[element.year]["sum"] += element.mean;
        mean_mean_by_year[element.year]["count"]++;
      }
    });
  });
  var data_mean_mean_by_year = [];

  for(let i in mean_mean_by_year){
    data_mean_mean_by_year.push({"year":i,"mean":(mean_mean_by_year[i]["sum"]/mean_mean_by_year[i]["count"]).toFixed(0)/1000});
  }
  // console.log(max_mean_by_year)
  // console.log(mean_mean_by_year)
  // console.log(min_mean_by_year)

  var domain = []
  var cs_fi = crossfilter(data_mean_mean_by_year)
  var mean_graph = dc.seriesChart("#mean");
  
  var dim = cs_fi.dimension(function(d){
    domain.push(d.year);
    return [parseInt(d.year),d.mean]
  });

  var grouped = dim.group();

  var width = document.getElementById("mean").getBoundingClientRect().width - 10;
  
  var tooltip = d3.select("#vis-container").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  mean_graph.width(width)
        .height(200)
        .chart(function(c) { return dc.lineChart(c).renderDataPoints(true); })
        .x(d3.scale.ordinal().domain(domain))
        .xUnits(dc.units.ordinal)
        .brushOn(false)
        .yAxisLabel("Net Values")
        .xAxisLabel("Year")
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
  mean_graph.render()
}

function mainGraphLoad(data){
  var domain = []
  var cs_fi = crossfilter(data)

  function getVal(y){
    var year_data = data.filter(function(y_d){
      if(y_d.year == y) return y_d
    })[0]
    return year_data.content.sum_mean_max_year[0].sum.toFixed(0)/1000000
  }
  //Header
  document.getElementById("main").getElementsByClassName("header")[0].textContent = "Net value per milion by year"

  //Graph tag
  var main_graph = dc.seriesChart("#main")

  //Dimension of Graph
  var dim = cs_fi.dimension(function(d){domain.push(d.year.toString()); return [d.year,getVal(d.year)]})

  //Group
  var grouped = dim.group().reduceSum(function(d){
    let res = d.content.sum_mean_max_year
    return res!= undefined ? res[0].sum.toFixed(0)/1000000 : 0 ;
  })

  //Width adjust
  var width = document.getElementById("main").getBoundingClientRect().width - 50;

  main_graph.width(width)
        .height(200)
        .chart(function(c) { return dc.lineChart(c).renderDataPoints(true); })
        .x(d3.scale.ordinal().domain(domain))
        .xUnits(dc.units.ordinal)
        .brushOn(false)
        .yAxisLabel("Net Values")
        .xAxisLabel("Year")
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
  main_graph.render()

}

function expansiveTypeChamberLoad(data){
  var labels_numb = [] ;
  var data_to_show;

  document.getElementById("card-1").getElementsByClassName("header")[0].textContent = "Net value distribution in "+year

  function sortNumber(a,b) {
    return b.sum - a.sum;
  }

  data.forEach(function(d){
    let response = []
    if (d.year.toString() == year){
      let res = d.content.sum_mean_max_year_spents_type_total
      res.sort(sortNumber)
      res.forEach(function(element){
        response.push(element.sum.toFixed(0)/1000)
        labels_numb.push(element.subquota_number)
      })
      data_to_show = response;
    }
  })

  var ctx = document.getElementById('type').getContext('2d')

  d3.json("json_files/chamber/spents_categories.json",function(d){
      console.log(d);
      var chart =  new Chart(ctx, {
          // The type of chart we want to create
          type: 'horizontalBar',

          // The data for our dataset
          data: {
              labels: labels_numb.map(function(n){return d[n.toString()]}),
              datasets: [{
                  label: "Net Value / 1000",
                  backgroundColor: '#80cdc1',
                  borderColor: 'rgb(255, 99, 132)',
                  data: data_to_show,
              }]
          },
          // Configuration options go here
          options: {
            scales: {
                xAxes: [{
                    gridLines: {
                        offsetGridLines: false,
                        maxBarThickness:20
                    }
                }]
            }
          }
      });

  })

  // var expensive_chart = dc.barChart("#type")
  // var max;
  // var y;
  //
  // function totalByType(typeKey,id){
  //   var tag = document.getElementById(id).getElementsByClassName("footer")[0]
  //   var value = y.content.sum_mean_max_year_spents_type_total.filter(function(typ){
  //     if (typ.subquota_number == typeKey) return typ
  //   })[0].sum
  //
  //   tag.textContent = "Type "+typeKey+"- Value: R$ "+value.toFixed(2).toString().replace('.',',')
  // }
  //
  //
  //
  // var cf_ex =  crossfilter(data.filter(function (d){
  //   if (d.year.toString() == year){
  //     y = d
  //     max = d.content.sum_mean_max_year[0].sum
  //     return d
  //   }
  // })[0].content.sum_mean_max_year_spents_type_total)
  //
  // var domain = []
  //
  // //Dimension of Graph
  // var dim = cf_ex.dimension(function(d) {
  //   domain.push(d.subquota_number.toString())
  //   return d.subquota_number
  // })
  //
  // totalByType(domain[0],'card-1')
  //
  // //Group
  // var grouped = dim.group().reduceSum(function(d){
  //   return +d.sum/max
  // })
  //
  // var width = document.getElementById("type").getBoundingClientRect().width - 20;
  //
  // expensive_chart.width(width)
  //               .height(350)
  //               .x(d3.scale.ordinal().domain(domain))
  //               .xUnits(dc.units.ordinal)
  //               .margins({top: 50, right: 50, bottom: 50, left: 60})
  //               .brushOn(false)
  //               .xAxisLabel("Reimbursements type")
  //               .yAxisLabel("Percent")
  //               .dimension(dim)
  //               .ordering(function(d){console.log(d);})
  //               .group(grouped)
  //               .on('renderlet', function(chart) {
  //                   chart.selectAll('rect').on("click", function(d) {
  //                     totalByType(d.data.key,'card-1')
  //                   });
  //               });
  // //
  // expensive_chart.render()
}

// function partyExpensive(data){
//   var party_chart = dc.bubbleChart('#party')

//   document.getElementById("card-2").getElementsByClassName("header")[0].textContent = "Party net values distribution in "+year

//   var cf_ex =  crossfilter(data.filter(function (d){
//     console.log(d.year.toString() == year);
//     if (d.year.toString() == year){
//       y = d
//       max = d.content.sum_mean_max_year[0].sum
//       console.log(d);
//       return d
//     }
//   })[0].content.sum_mean_max_year_meanspentbytype_normalizedbycount)

function scatterChart(data){
  var scatter_chart = dc.scatterPlot("#scatter");
    
  document.getElementById("card-3").getElementsByClassName("header")[0].textContent = "Net Value Distribution by Congress Person in "+year

  var cf_ex =  crossfilter(data.filter(function (d){
    if (d.year.toString() == year){
      return d
    }
  })[0].content.sum_mean_max_year_congressperson_each)

  //Dimension of Graph
  var dim = cf_ex.dimension(function(d) {
    return [+d.count, +d.sum];
  })

  //Group
  var grouped = dim.group()

  var width = document.getElementById("card-3").getBoundingClientRect().width - 50;
  
  scatter_chart
    .colors(d3.scale.ordinal().domain(d3.range(1)).range(['#80cdc1']))
    .width(width)
    .height(480)
    .x(d3.scale.linear().domain([0,1700]))
    .brushOn(false)
    .symbolSize(8)
    .clipPadding(10)
    .yAxisLabel("Sum")
    .xAxisLabel("Count")
    .dimension(dim)
    .group(grouped);

  scatter_chart.render();
}