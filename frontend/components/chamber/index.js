function loadChamberGraphs(){
  window.onresize = function(){
    loadChamberGraphs()
  }

  d3.json("json_files/chamber/grouped.json",function(err,data){
    mainGraphLoad(data);
    loadChamberTimes(data);

  })
}

function loadChamberTimes(d){
  if (d == undefined){
    d3.json("json_files/chamber/grouped.json",function(err,data){
      expansiveTypeChamberLoad(data);
      scatterChart(data);
      meanmean(data,"sum_mean_party_year");
    })
  }
  //
  else{
    expansiveTypeChamberLoad(d);
    scatterChart(d);
    meanmean(d,"sum_mean_party_year");
  }
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
  document.getElementById("main").getElementsByClassName("footer")[0].textContent = "Evolution of net valu by the years"
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

    main_graph.render()

}

function expansiveTypeChamberLoad(data){
  var labels_numb = [] ;
  var data_to_show;

  document.getElementById("card-1").getElementsByClassName("header")[0].textContent = "Net value distribution in "+year
  document.getElementById("card-1").getElementsByClassName("footer")[0].textContent = "How each kind of expense type contribute for the hole expense"

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
}

function scatterChart(dataset){
    document.getElementById("card-3").getElementsByClassName("header")[0].textContent = "Net Value Distribution by Congress Person in "+year
    document.getElementById("card-3").getElementsByClassName("footer")[0].textContent = "A distribution of expense of each person in "+year

    var data_filtered =  dataset.filter(function (d){
        if (d.year.toString() == year){
            return d
        }
    })[0].content.sum_mean_max_year_congressperson_each

    var data_plot = []
    for(let i in data_filtered){
        let count = data_filtered[i].count
        let sum = data_filtered[i].sum
        let mean = data_filtered[i].sum/data_filtered[i].count
        let party = data_filtered[i].party
        data_plot.push({x: +count,
                        y: +sum.toFixed(0),
                        z: +mean.toFixed(0),
                        name: data_filtered[i].congressperson_name,
                        party: party,
                        color: "#80cdc1",
                        fillCollor: "#80cdc1"
                       })
    }

    Highcharts.chart('scatter', {
            chart: {
                type: 'scatter',
                plotBorderWidth: 1,
                zoomType: 'xy'
            },

        legend: {
            enabled: false
        },

        title: {
            text: false
        },

        subtitle: {
            text: false
        },

        xAxis: {
            gridLineWidth: 1,
            title: {
                text: '#entries'
            },
            labels: {
                format: '{value}'
            },
        },

        yAxis: {
            startOnTick: false,
            endOnTick: false,
            title: {
                text: 'sum'
            },
            labels: {
                format: 'R${value}'
            },
            maxPadding: 0.2,
        },

        tooltip: {
            useHTML: true,
            headerFormat: '<table>',
            pointFormat: '<tr><th colspan="2"><h3>{point.name}</h3> <h3>party: {point.party} </h3></th></tr>' +
                '<tr><th>#entries:</th><td>{point.x}</td></tr>' +
                '<tr><th>sum:</th><td>R${point.y}</td></tr>' +
                '<tr><th>mean:</th><td>R${point.z}</td></tr>',
            footerFormat: '</table>',
            followPointer: true
        },

        plotOptions: {
            series: {
                dataLabels: {
                    enabled: false,
                    format: '{point.name}'
                }
            }
        },

        series: [{
            data: data_plot

        }]
    });
}
