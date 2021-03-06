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
      meanmean(d,"sum_mean_max_year_party_maxtotal");
    })
  }
  else{
    expansiveTypeSenateLoad(d);
    loadSankeyDiagram(d);
    meanmean(d,"sum_mean_max_year_party_maxtotal");
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

    function orderBydate(a,b){
      return a - b
    }

    domain.sort(orderBydate)

    var grouped = dim.group().reduceSum(function(d){return +d.content.sum_mean_max_year[0].sum/1000000;});

    var width = document.getElementById("main").getBoundingClientRect().width - 50;

    document.getElementById("main").getElementsByClassName("header")[0].textContent = "Reimbursement value per milion by year"
    document.getElementById("main").getElementsByClassName("footer")[0].textContent = "Evolution of Reimbursement Value by years"

    line_graph.width(width)
          .height(200)
          .chart(function(c) { return dc.lineChart(c).renderDataPoints(true); })
          .x(d3.scale.ordinal().domain(domain))
          .xUnits(dc.units.ordinal)
          .brushOn(false)
          .yAxisLabel("Reimbursements")
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
    line_graph.render()
}

function expansiveTypeSenateLoad(data){
  document.getElementById("card-senate-1").getElementsByClassName("header")[0].textContent = "Reimbursement types expenses in "+year;
  document.getElementById("card-senate-1").getElementsByClassName("footer")[0].textContent = "Distribution of types for Reimbursment in year of perspective";
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

    Highcharts.chart('radar', {
      //
      chart: {
        polar: true,
        type: 'area'
      },
      //
      title: {
        text: null
      },
      //
      pane: {
          size: '80%'
      },
      //
      xAxis: {
          categories: labels,
          tickmarkPlacement: 'on',
          lineWidth: 1,
          // tickInterval: 3,
          labels: {
              overflow: "justify",
              style: {
                  fontSize: '10px',
                  fontFamily: 'Verdana, sans-serif',
              }
          }
                  
          // labels:{
          //   enabled: false
          // }
      },
      //
      yAxis: {
          gridLineInterpolation: 'polygon',
          lineWidth: 0,
          min: 0,
      },
      //
      tooltip: {
          shared: true,
          headerFormat: '<span style="color:{series.color}">{series.name}: <b>R${point.y}</b><br/>',
          pointFormat: ""
          // pointFormat: '<span style="color:{series.color}">{series.name}: <b>R${point.y}</b><br/>'
      },
      //
      legend: {
          align: 'right',
          verticalAlign: 'top',
          y: 70,
          layout: 'vertical'
      },
      //
      series: [{
          name: 'Reimbursements R$(k)',
          data: dataset,
          pointPlacement: 'on',
          fillOpacity: 0.2
      }]

    });

  });
};

function loadSankeyDiagram(dataset){

  document.getElementById("card-senate-0").getElementsByClassName("header")[0].textContent = "Reimbursment type by party in " + year
  document.getElementById("card-senate-0").getElementsByClassName("footer")[0].textContent = "How the 10 greatest expenses are distributed"

  var data_filtered =  dataset.filter(function (d){
      if (d.year.toString() == year.toString()){return d}
  })[0].content.year_party_type


  //
  var data_plot = []
  for(let i in data_filtered){
      let party = data_filtered[i].party
      let type = data_filtered[i].expense_type
      let sum = +data_filtered[i].sum.toFixed(0)
      data_plot.push([party, type, sum])
  }

  data_plot = data_plot.sort(function(a, b){return b[2]-a[2] })
  data_plot = data_plot.slice(0, 10)
  //
  // console.log(data_plot)
  Highcharts.chart('sankey', {
    //
    title: {
         text: ''
     },
     //
    series: [{
       keys: ['from', 'to', 'weight'],
       data: data_plot,
       type: 'sankey',
       name: ' Party -> Reimbursment Type'
    }]
  })
    //
};
