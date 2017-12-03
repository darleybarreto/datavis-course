function loadSenateGraphs(){
  window.onresize = function(){
    loadSenateGraphs()
  }
  d3.json("json_files/senate/grouped.json", function(err,data){
    lineGraphLoad(data);
    loadSenateTimes(data);
  })
}

function loadSenateTimes(d){
  if (d==undefined){
    d3.json("json_files/senate/grouped.json", function(err,data){
      expansiveTypeSenateLoad(data);
      loadSankeyDiagram(data);
    })
  }
  else{
    expansiveTypeSenateLoad(d);
    loadSankeyDiagram(d);
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

    document.getElementById("main").getElementsByClassName("header")[0].textContent = "Net value per milion by year"

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

function expansiveTypeSenateLoad(data){
  document.getElementById("card-senate-1").getElementsByClassName("header")[0].textContent = "Reimbursements types expenses in "+year;

  var response = {},
      labels = [],
      dataset = [];

  d3.json("json_files/senate/spents_categories.json",function(categories){
    data.forEach(function(d){
      if (d.year.toString() == year){
        let res = d.content.sum_mean_max_year_spents_type_total

        res.forEach(function(element){
          let id = parseInt(element.expense_type_id);

          if(!(id in response))
            response[id] = element.sum.toFixed(0)/1000;
          else
            response[id] += element.sum.toFixed(0)/1000;
        })
      }
    });

    for (let i in response){
      labels.push(categories[i]);
      dataset.push(response[i]);

    }
    console.log(labels);
    console.log(dataset);

    Highcharts.chart('radar', {
      chart: {
        polar: true,
        type: 'area'
      },
      title: {
        text: null
      },

      pane: {
          size: '80%'
      },

      xAxis: {
          categories: labels,
          tickmarkPlacement: 'on',
          lineWidth: 1,
          labels:{
            enabled: false
          }
      },

      yAxis: {
          gridLineInterpolation: 'polygon',
          lineWidth: 0,
          min: 0
      },

      tooltip: {
          shared: true,
          pointFormat: '<span style="color:{series.color}">{series.name}: <b>R${point.y}</b><br/>'
      },

      legend: {
          align: 'right',
          verticalAlign: 'top',
          y: 70,
          layout: 'vertical'
      },

      series: [{
          name: 'Reimbursements R$(k)',
          data: dataset,
          pointPlacement: 'on'
      }]

    });

  });
};

function loadSankeyDiagram(dataset){

    Highcharts.chart('sankey', {

    title: {
        text: 'Highcharts Sankey Diagram'
    },

    series: [{
        keys: ['from', 'to', 'weight'],
        data: [
            ['Brazil', 'Portugal', 5 ],
            ['Brazil', 'France', 1 ],
            ['Brazil', 'Spain', 1 ],
            ['Brazil', 'England', 1 ],
            ['Canada', 'Portugal', 1 ],
            ['Canada', 'France', 5 ],
            ['Canada', 'England', 1 ],
            ['Mexico', 'Portugal', 1 ],
            ['Mexico', 'France', 1 ],
            ['Mexico', 'Spain', 5 ],
            ['Mexico', 'England', 1 ],
            ['USA', 'Portugal', 1 ],
            ['USA', 'France', 1 ],
            ['USA', 'Spain', 1 ],
            ['USA', 'England', 5 ],
            ['Portugal', 'Angola', 2 ],
            ['Portugal', 'Senegal', 1 ],
            ['Portugal', 'Morocco', 1 ],
            ['Portugal', 'South Africa', 3 ],
            ['France', 'Angola', 1 ],
            ['France', 'Senegal', 3 ],
            ['France', 'Mali', 3 ],
            ['France', 'Morocco', 3 ],
            ['France', 'South Africa', 1 ],
            ['Spain', 'Senegal', 1 ],
            ['Spain', 'Morocco', 3 ],
            ['Spain', 'South Africa', 1 ],
            ['England', 'Angola', 1 ],
            ['England', 'Senegal', 1 ],
            ['England', 'Morocco', 2 ],
            ['England', 'South Africa', 7 ],
            ['South Africa', 'China', 5 ],
            ['South Africa', 'India', 1 ],
            ['South Africa', 'Japan', 3 ],
            ['Angola', 'China', 5 ],
            ['Angola', 'India', 1 ],
            ['Angola', 'Japan', 3 ],
            ['Senegal', 'China', 5 ],
            ['Senegal', 'India', 1 ],
            ['Senegal', 'Japan', 3 ],
            ['Mali', 'China', 5 ],
            ['Mali', 'India', 1 ],
            ['Mali', 'Japan', 3 ],
            ['Morocco', 'China', 5 ],
            ['Morocco', 'India', 1 ],
            ['Morocco', 'Japan', 3 ]
        ],
        type: 'sankey',
        name: 'Sankey demo series'
    }]

});

//    document.getElementById("card-senate-0").getElementsByClassName("header")[0].textContent = "Reimbursment type by party in "+year
//
//    var data_filtered =  dataset.filter(function (d){
//        if (d.year.toString() == year){
//            return d
//        }
//    })[0].content.maxspentbytype_normalizedbycount
//
//    var data_plot = []
//    for(let i in data_filtered){
//        let party = data_filtered[i].party
//        let type = data_filtered[i].expense_type_id
//        let sum = +data_filtered[i].sum.toFixed(0)
//        data_plot.push([party, type, sum])
//    }
//
//    Highcharts.chart('sankey', {
//
//        title: {
//            text: 'Highcharts Sankey Diagram'
//        },
//
//        series: [{
//            keys: ['from', 'to', 'weight'],
//            data: data_plot,
//            type: 'sankey',
//            name: 'Sankey'
//        }]
//
//    });
}
