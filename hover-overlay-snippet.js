var overlayDiv = document.createElement("div"); 
overlayDiv.setAttribute("style", "position: fixed;background-color:rgba(0, 200, 0, 0.2);outline:solid 1px rgba(0, 200, 0, 1);pointer-events:none");
document.body.appendChild(overlayDiv);

var textDiv = document.createElement("div"); 
overlayDiv.appendChild(textDiv);

var buttonDiv = document.createElement("div"); 
buttonDiv.setAttribute("style", "display:block;background-color:black; pointer-events:all; height:20px; width:20px; left:0px; top:-18px; position:absolute; border-radius:2px; color:white; text-align:center");
buttonDiv.innerHTML = '+';
overlayDiv.appendChild(buttonDiv);

document.body.addEventListener('mouseover', function(e){
  var r = e.target;
  if (r !== buttonDiv) {
    var rects = r.getClientRects()[0];

    //console.log(rects.width,rects.height,rects.top,rects.left);

    textDiv.innerText = r.tagName.toLowerCase() + '.' + r.classList.value.split(' ').join('.');
    overlayDiv.style.width = rects.width + 'px';
    overlayDiv.style.height = rects.height + 'px';
    overlayDiv.style.top = rects.top + 'px';
    overlayDiv.style.left = rects.left + 'px';
  }
})

document.addEventListener("click", function(e){
  e.stopPropagation();
  e.preventDefault();
  console.log('CLICK');
}, true);
