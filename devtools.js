chrome.devtools.panels.create("DataView", "icon_32x32.png", "devtools.html", function(panel) {
  var initialize = true;
  panel.onShown.addListener( function(panelWindow) {
    // tab focus

    if (initialize) {
      //devtools opened
      initialize = false;

      resultElement = panelWindow.document.getElementById('result');

      panelWindow.document.getElementById('search-button').addEventListener('click', function(e){
        var rowInput = panelWindow.document.getElementById('row-selector');
        var rowSelector = rowInput.value;
        var rowQuery = "window.document.querySelectorAll('"+rowSelector+"')"

        var columnInput = panelWindow.document.getElementById('column-selector');
        var columnSelectors = columnInput.value.split(',');
        var colQueries = [];
        for (var i=0; i<columnSelectors.length; i++) {
          colQueries.push("rows[i].querySelector('"+columnSelectors[i]+"').innerText");
        }

        var evalString = "(function(){var rows="+rowQuery+";var a=[];for(i=0; i< rows.length; i++){a.push(["+colQueries.join(',')+"])};return a}())";

        chrome.devtools.inspectedWindow.eval( evalString, function(result, isException) {
          var table = panelWindow.document.getElementById('result-table');
          var header = table.getElementsByTagName('thead')[0];
          header.innerHTML = '';
          var body = table.getElementsByTagName('tbody')[0];
          body.innerHTML = '';
          var row = header.insertRow(0);

          for (var i=0; i<colQueries.length; i++) {
            var cell = row.insertCell(i);
            cell.innerHTML = 'col '+i;

            (function(colIndex){
              cell.addEventListener('click', function(e){
                sortTable(table, colIndex);
              });
            })(i);
          }

          for(var i=0; i < result.length; i++) {
            row = body.insertRow(i);
            for(var j=0; j<colQueries.length; j++) {
              var cell = row.insertCell(j);
              cell.innerHTML = result[i][j];
            }
          }
        });

      });
    }
  });
});

// from https://www.w3schools.com/howto/howto_js_sort_table.asp
function sortTable(table, n) {
  var tbody, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  tbody = table.getElementsByTagName('tbody')[0];
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc"; 
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = tbody.getElementsByTagName("TR");
    /*Loop through all table body rows */
    for (i = 0; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount ++; 
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

// chrome.devtools.panels.setOpenResourceHandler(function callback)

