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
  //console.log("Introduzir html do senado");
  var html = ""

  html +='<div id="senado">'
         + '<div id="dist" class="card">'
         + '</div>'
         + '<div class="card">'
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
  //console.log("Introduzir html da camara")
  var html = ""

  html +='<div id="camara">'
         + '<div id="card-1" class="card">'
          +  '<div class="header -extyp">'
          +  '</div>'
          +  '<canvas id="type">'
          +  '</canvas>'
          +  '<div class="footer">'
          +     '<div>'
          +     '</div>'
          +  '</div>'
         + '</div>'
         + '<div id="card-3" class="card">'
          +  '<div class="header -scatter">'
          +  '</div>'
          +  '<div id="scatter">'
          +  '</div>'
          +  '<div class="footer">'
          +  '</div>'
         + '</div>'
       + '</div>'

  tag.innerHTML = html
  context = 'camara'
  loadChamberGraphs()
}
