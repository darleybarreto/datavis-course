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
    })
  }
  else{
    expansiveTypeSenateLoad(d);
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
    console.log(dataset)
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
}