//initing firsts perpectives options
var context = 'senado'
var year = '2009'

window.onload = function(){
  document.getElementById("panel").getElementsByClassName("button")[0].classList.add('clicked')
  senateGen(document.getElementById("content"))
}

function changeContent(cont ,callback ,element){
  if (context == cont ) return
  //Cleaning content tag
  var content = document.getElementById("content")
  content.innerHTML = ''
  //Removing class of clicked
  var buttons = document.getElementById("panel").getElementsByClassName("button")
  for (let i=0; i < buttons.length ; i++){
    buttons[i].classList.remove("clicked")
  }
  //add clicked class for the button who deserve
  element.classList.add('clicked')
  callback(content)
}

function senateGen(tag){
  var html = ""
  html +='<div id="senado">'
         + '<div id="card-senate-0" class="card">'
            +  '<div class="header -extyp">'
            +  '</div>'
            +  '<div class="footer">'
            + '</div>'
            +  '<div id="sankey">'
            +  '</div>'
         + '</div>'
         + '<div id="card-senate-1" class="card">'
          +  '<div class="header -extyp">'
          +  '</div>'
          +  '<div class="footer">'
          +  '</div>'
          +  '<div id="radar">'
          +  '</div>'
         + '</div>'
       + '</div>'

  tag.innerHTML = html
  context = 'senado'
  loadSenateGraphs()
}

function updateYearView(event){
  year = event.target.value.toString()
  if (context=='camara') loadChamberTimes()
  else {loadSenateTimes()}
}

function chamberGen(tag){
  var html = ""
  html +='<div id="camara">'
         + '<div id="card-1" class="card">'
          +  '<div class="header -extyp">'
          +  '</div>'
          +  '<div class="footer">'
          +  '</div>'
          +  '<canvas id="type">'
          +  '</canvas>'
         + '</div>'
         + '<div id="card-3" class="card">'
          +  '<div class="header -scatter">'
          +  '</div>'
          +  '<div class="footer">'
          +  '</div>'
          +  '<div id="scatter">'
          +  '</div>'
         + '</div>'
       + '</div>'

  tag.innerHTML = html
  context = 'camara'
  loadChamberGraphs()
}

function meanmean(data,col){
  document.getElementById("mean").getElementsByClassName("header")[0].textContent = "Mean party net value by year in R$ 1000";
  document.getElementById("mean").getElementsByClassName("footer")[0].textContent = "Evolution of mean of means by party by year ";

  var max_mean_by_year = {},
      min_mean_by_year = {},
      mean_mean_by_year = {},
      mapDate = {};

  data.forEach(function(d){
    let res = d.content[col];
    res.forEach(function(element){
      let year = parseInt(new Date(element.year.toString()).getTime())
      mapDate[year] = element.year;

      if(!(year in max_mean_by_year)){
        max_mean_by_year[year] = {"party": element.party, "max": element.mean, "n_congressman":element.n_congressman};
      }
      else{
        if(element.mean > max_mean_by_year[year]["max"])
          max_mean_by_year[year] = {"party": element.party, "max": element.mean, "n_congressman":element.n_congressman};
      }

      if(!(year in min_mean_by_year)){
        min_mean_by_year[year] = {"party": element.party, "min": element.mean, "n_congressman":element.n_congressman};
      }
      else{
        if(element.mean < min_mean_by_year[year]["min"])
          min_mean_by_year[year] = {"party": element.party, "min": element.mean, "n_congressman":element.n_congressman};
      }

      if(!(year in mean_mean_by_year)){
        mean_mean_by_year[year] = {"sum": element.mean, "count":0};

      }
      else{
        mean_mean_by_year[year]["sum"] += element.mean;
        mean_mean_by_year[year]["count"]++;
      }
    });
  });
  var data_mean_mean_by_year = [],
      data_min_max_by_year = [];

  let l = Object.keys(mean_mean_by_year).map(Number).sort();

  for(let i in l){
    let year = l[i];

    min_mean_by_year[year]["min"] = min_mean_by_year[year]["min"].toFixed(0)/1000
    max_mean_by_year[year]["max"] = max_mean_by_year[year]["max"].toFixed(0)/1000
    mean_mean_by_year[year]["mean"] = (mean_mean_by_year[year]["sum"]/mean_mean_by_year[year]["count"]).toFixed(0)/1000

    data_mean_mean_by_year.push([year,mean_mean_by_year[year]["mean"]])
    data_min_max_by_year.push([year, min_mean_by_year[year]["min"],max_mean_by_year[year]["max"]])
  }
  // console.log(data_mean_mean_by_year)
  Highcharts.chart('meangraph', {

      title: {
          text: null
      },

      xAxis: {
          title: {
              text: "Years"
          },
          type: 'datetime',

          dateTimeLabelFormats: {
            year: '%Y'
          },
      },

      yAxis: {
          title: {
              text: "Net values"
          },
          labels: {
            formatter: function() {
                return 'R$' + this.value + 'k';
            }
          },
          min:0
      },
      tooltip: {
        backgroundColor: 'none',
        borderWidth: 0,
        shadow: false,
        useHTML: true,
        shared: true,
        padding: 0,
        split: false,
        crosshairs: true,

        formatter: function(tooltip) {
          const points = this.points;
          let str = '<table><tr>';
          str += '<tr><td><span style="font-size:15px"> Year '+mapDate[points[0].key] +'</span></tr></td>'

          points.forEach(point => {
            if(point.series.name == "Range"){
              str += '<tr><td><span style="font-size:20px;color:' + '#1c9099' + '">●</span> ' + "Max: ("+max_mean_by_year[point.key].party+") R$ "+  max_mean_by_year[point.key].max+ 'k </td></tr>';
              str += '<tr><td><span style="font-size:20px;color:' + '#ece2f0' + '">●</span> ' + "Min: ("+min_mean_by_year[point.key].party+") R$ "+  min_mean_by_year[point.key].min+ 'k </td></tr>';
            }
            else
              str += '<tr><td><span style="font-size:20px;color:' + point.color + '">●</span> ' + point.series.name + ': R$ '+mean_mean_by_year[point.key].mean+'k </td></tr>';

          });

          str += '</tr></table>';
          return str;
        },
        positioner: function () {
          const chart = this.chart;
          return { x: (chart.plotWidth + chart.marginRight - this.label.getBBox().width) / 8, y: chart.plotTop};
        }
      },

      series: [{
          name: 'Mean',
          data: data_mean_mean_by_year,
          zIndex: 1,
          marker: {
              fillColor: 'white',
              lineWidth: 2,
              lineColor: Highcharts.getOptions().colors[0]
          }
      }, {
          name: 'Range',
          data: data_min_max_by_year,
          type: 'arearange',
          lineWidth: 0,
          linkedTo: ':previous',
          color: Highcharts.getOptions().colors[2],
          fillOpacity: 0.3,
          zIndex: 0,
          marker: {
              enabled: false
          }
      }]
  });
}
