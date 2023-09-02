/***
   gsrd_main.js
***/

var initial_page_load = true;

const Products = {
    SLIPRATE: 'sliprate',
};

var activeProduct = Products.SLIPRATE;
var gsrd_sliprate_site_data=null;

var viewermap;

jQuery(document).ready(function() {

  frameHeight=window.innerHeight;
  frameWidth=window.innerWidth;

  var uagent = navigator.userAgent.toLowerCase();

  window.console.log("WHAT am I !! >>> "+uagent);
  window.console.log("screen width..("+screen.width+") and frame width..",frameWidth);

//if (navigator.userAgentData.mobile) { // do something }

  if( screen.width <= 480 ) {
    window.console.log("OH NO.. I am on Mini.."+screen_width);
    //location.href = '/mobile.html';
  }

  viewermap=setup_viewer();

  $('.gsrd-minrate-item').on("focus", function() {
     $('.gsrd-minrate-item').on("blur mouseout", function() {
       $('.gsrd-minrate-item').off("mouseout");
       $('.gsrd-minrate-item').off("blur");
window.console.log("minrate-item got updated ...HERE..");
       if( $(this).val() != '' ) {
         GSRD_SLIPRATE.refreshMinrateSlider();
       }
       $(this).blur();
     });
  });

  $('.gsrd-maxrate-item').on("focus", function() {
     $('.gsrd-maxrate-item').on("blur mouseout", function() {
       $('.gsrd-maxrate-item').off("mouseout");
       $('.gsrd-maxrate-item').off("blur");
       if( $(this).val() != '' ) {
         GSRD_SLIPRATE.refreshMaxrateSlider();
       }
       $(this).blur();
     });
  });

  $('.gsrd-latlon-item').on("focus", function() {
     $('.gsrd-latlon-item').on("blur mouseout", function() {
       $('.gsrd-latlon-item').off("mouseout");
       $('.gsrd-latlon-item').off("blur");
       if( $(this).val() != '' ) {
         window.console.log(" need to call search by latlon ");
         GSRD_SLIPRATE.searchLatlon(0, []);
       }
       $(this).blur();
     });
  });

  $('.gsrd-sitename-item').on("focus", function() {
     $('.gsrd-sitename-item').on("blur mouseout", function() {
       $('.gsrd-sitename-item').off("mouseout");
       $('.gsrd-sitename-item').off("blur");
       if( $(this).val() != '' ) {
	 let criteria = [];
         criteria.push($(this).val());
         GSRD_SLIPRATE.search(GSRD_SLIPRATE.searchType.sitename, criteria);
       }
       $(this).blur();
     });
  });

  $('.gsrd-faultname-item').on("focus", function() {
     $('.gsrd-faultname-item').on("blur mouseout", function() {
       $('.gsrd-faultname-item').off("mouseout");
       $('.gsrd-faultname-item').off("blur");
window.console.log("            trigger a call..on faultname..");
       if( $(this).val() != '' ) {
window.console.log("            with("+$(this).val()+")");
	 let criteria = [];
         let str=trimFaultString($(this).val());
         criteria.push(str);
window.console.log("        again with("+str+")");
         GSRD_SLIPRATE.search(GSRD_SLIPRATE.searchType.faultname, criteria);
       }
 //      $(this).blur();
     });
  });


  $("#gsrd-search-type").on('change', function () {
      let type=$(this).val();
  window.console.log( "Initiate a search session...",type);
      if(type != "") {
        GSRD_SLIPRATE.freshSearch(type);
        } else {
          GSRD_SLIPRATE.pauseSearch();
      }

  });


  $("#gsrd-model-cfm").change(function() {
      if ($("#gsrd-model-cfm").prop('checked')) {
          CXM.showCFMFaults(viewermap);
          } else {
              CXM.hideCFMFaults(viewermap);
      }
  });

  $("#gsrd-model-gfm").change(function() {
      if ($("#gsrd-model-gfm").prop('checked')) {
          CXM.showGFMRegions(viewermap);
          } else {
              CXM.hideGFMRegions(viewermap);
      }
  });

  $.event.trigger({ type: "page-ready", "message": "completed", });


// MAIN SETUP

// load the data from backend and setup layers
  GSRD_SLIPRATE.generateLayers();
// setup the interface 
  GSRD_SLIPRATE.setupGSRDInterface();

}); // end of MAIN
