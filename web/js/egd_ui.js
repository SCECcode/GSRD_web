/***
   egd_ui.js
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

function showKey(minv,maxv,label) {
window.console.log(" --- calling showing key");
    if (showing_key) {
        removeKey();
    } else {
        showing_key = true;
    }
    // truncate the values alittle..
    let min=Math.round(minv * 100) / 100;
    let max=Math.round(maxv * 100) / 100;

    $('#minKey').html(min);
    $('#maxKey').html(max);
    $('#plot-range-container').css("display", "");
}

function removeKey() {
window.console.log(" --- calling removing key");
    if(showing_key) {
      $('#plot-range-container').css("display", "none");
      showing_key = false;
    }
}

/************************************************************************************/

function _toMedView()
{
let elt = document.getElementById('banner-container');
let celt = document.getElementById('top-intro');
let c_height = elt.clientHeight+(celt.clientHeight/2);
let h=576+c_height;

$('#top-intro').css("display", "none");
$('#searchResult').css("display", "none");
$('#EGD_plot').css("height", h);
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

$('#top-control').css("display", "none");
$('#top-select').css("display", "none");
$('.navbar').css("margin-bottom", "0px");

$('.container').css("max-width", "100%");
$('.leaflet-control-attribution').css("width", "100rem");

$('.container').css("padding-left", "0px");
$('.container').css("padding-right", "0px");
// minus the height of the container top 
let elt = document.getElementById('banner-container');
let c_height = elt.clientHeight;
let h = height - c_height-4.5;
let w = width - 15;
//window.console.log( "height: %d, %d > %d \n",height, c_height,h);
//window.console.log( "width: %d, %d  \n",width, w);
$('#EGD_plot').css("height", h);
$('#EGD_plot').css("width", w);
resize_map();
}

function _toNormalView()
{
$('#top-control').css("display", "");
$('#top-select').css("display", "");
$('#EGD_plot').css("height", "576px");
$('#EGD_plot').css("width", "635px");
$('.navbar').css("margin-bottom", "20px");

$('.container').css("max-width", "1140px");
$('.leaflet-control-attribution').css("width", "35rem");

$('.container').css("padding-left", "15px");
$('.container').css("padding-right", "15px");

$('#top-intro').css("display", "");
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
