var context = 'senado'
//initing first option
window.onload = function(){
  document.getElementById("panel").getElementsByClassName("button")[0].classList.add('clicked')
  senateGen()
}

function changeContent(cont ,callback ,element){
  if (context == cont ) return

  //Cleaning content tag
  document.getElementById("content").innetHTML = ''

  //Removing class of clicked
  var buttons = document.getElementById("panel").getElementsByClassName("button")
  for (let i=0; i < buttons.length ; i++){
    buttons[i].classList.remove("clicked")
  }
  //add clicked for the button who deserve
  element.classList.add('clicked')
  callback()
}

function senateGen(){
  console.log("Introduzir html do senado");

  context = 'senado'
}


function chamberGen(){
  console.log("Introduzir html da camara")


  context = 'camara'
}
