/***
   gsrd_ui.js
***/

var showing_key = false;
var big_map=0; // 0,1(some control),2(none)

/************************************************************************************/
function trimFaultString(str) {
   const regex = / Fault/gi;
   let nstr=str.replace(regex, "");
   return nstr;
}
/************************************************************************************/

function _toMedView()
{
//$('#top-intro').css("display", "none");
//$('#GSRD_plot').css("height", h);
$('#searchResult').css("display", "none");
$('.leaflet-control-attribution').css("width", "70rem");
$('#infoData').removeClass('col-5').addClass('col-0');
$('#top-map').removeClass('col-7').addClass('row');
$('#top-map').removeClass('pl-1').addClass('pl-0');
$('#mapDataBig').addClass('col-12').removeClass('row');
resize_map();
}

function _toMinView()
{
let height=window.innerHeight;
let width=window.innerWidth;

let belt = document.getElementById('banner-container');
let b_height = belt.clientHeight;
let telt = document.getElementById('top-intro');
let t_height = telt.clientHeight;

$('#top-control').css("display", "none");
$('#top-select').css("display", "none");
$('.navbar').css("margin-bottom", "0px");

$('.container').css("max-width", "100%");
$('.leaflet-control-attribution').css("width", "70rem");

$('.container').css("padding-left", "2px");
$('.container').css("padding-right", "2px");

// minus the height of the container top 
let h = height - b_height - t_height - 25;
let w = width - 100;

$('#GSRD_plot').css("height", h);
$('#GSRD_plot').css("width", w);
resize_map();
}

function _toNormalView()
{
$('#top-control').css("display", "");
$('#top-select').css("display", "");
$('#GSRD_plot').css("height", "576px");
$('#GSRD_plot').css("width", "635px");
$('.navbar').css("margin-bottom", "20px");

$('.container').css("max-width", "1140px");
$('.leaflet-control-attribution').css("width", "35rem");

$('.container').css("padding-left", "15px");
$('.container').css("padding-right", "15px");

$('#searchResult').css("display", "");
$('#infoData').addClass('col-5').removeClass('col-0');
$('#top-map').removeClass('row').addClass('col-7');
$('#top-map').removeClass('pl-1').addClass('pl-0');
$('#mapDataBig').removeClass('col-12').addClass('row');
resize_map();
}

function toggleBigMap()
{
  switch (big_map)  {
    case 0:
      big_map=1;
      _toMedView();		   
      break;
    case 1:
      big_map=2;
      _toMinView();		   
      break;
    case 2:
      big_map=0;
      _toNormalView();		   
      break;
  }
}

/************************************************************************************/


// https://www.w3schools.com/howto/howto_js_sort_table.asp
// n is which column to sort-by
// type is "a"=alpha "n"=numerical
function sortMetadataTableByRow(n,type) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("metadata-table");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc"; 

  while (switching) {
    switching = false;
    rows = table.rows;
    if(rows.length < 3) // no switching
      return;

/* loop through except first and last */
    for (i = 1; i < (rows.length - 2); i++) {
      shouldSwitch = false;

      x = rows[i].getElementsByTagName("td")[n];
      y = rows[i + 1].getElementsByTagName("td")[n];

      if (dir == "asc") {
        if(type == "a") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
          } else {
            if (Number(x.innerHTML) > Number(y.innerHTML)) {
              shouldSwitch = true;
              break;
            }
         }
      } else if (dir == "desc") {
        if(type == "a") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
          } else {
            if (Number(x.innerHTML) < Number(y.innerHTML)) {
              shouldSwitch = true;
              break;
            }
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount ++; 
    } else {
      window.console.log("done switching..");
      if(switchcount != 0) {

      }
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
  var id="#sortCol_"+n;
  var t=$(id);
  if(dir == 'asc') {
    t.removeClass("fa-angle-down").addClass("fa-angle-up");
    } else {
      t.removeClass("fa-angle-up").addClass("fa-angle-down");
  }
}
