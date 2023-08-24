/***
   egd_main.js
***/

var initial_page_load = true;

const Products = {
    SLIPRATE: 'sliprate',
};

var activeProduct = Products.SLIPRATE;
var egd_sliprate_site_data=null;

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

  $('.egd-minrate-item').on("focus", function() {
     $('.egd-minrate-item').on("blur mouseout", function() {
       $('.egd-minrate-item').off("mouseout");
       $('.egd-minrate-item').off("blur");
window.console.log("minrate-item got updated ...HERE..");
       if( $(this).val() != '' ) {
         EGD_SLIPRATE.refreshMinrateSlider();
       }
       $(this).blur();
     });
  });

  $('.egd-maxrate-item').on("focus", function() {
     $('.egd-maxrate-item').on("blur mouseout", function() {
       $('.egd-maxrate-item').off("mouseout");
       $('.egd-maxrate-item').off("blur");
       if( $(this).val() != '' ) {
         EGD_SLIPRATE.refreshMaxrateSlider();
       }
       $(this).blur();
     });
  });

  $('.egd-latlon-item').on("focus", function() {
     $('.egd-latlon-item').on("blur mouseout", function() {
       $('.egd-latlon-item').off("mouseout");
       $('.egd-latlon-item').off("blur");
       if( $(this).val() != '' ) {
         window.console.log(" need to call search by latlon ");
         EGD_SLIPRATE.searchLatlon(0, []);
       }
       $(this).blur();
     });
  });

  $('.egd-sitename-item').on("focus", function() {
     $('.egd-sitename-item').on("blur mouseout", function() {
       $('.egd-sitename-item').off("mouseout");
       $('.egd-sitename-item').off("blur");
       if( $(this).val() != '' ) {
	 let criteria = [];
         criteria.push($(this).val());
         EGD_SLIPRATE.search(EGD_SLIPRATE.searchType.sitename, criteria);
       }
       $(this).blur();
     });
  });

  $('.egd-faultname-item').on("focus", function() {
     $('.egd-faultname-item').on("blur mouseout", function() {
       $('.egd-faultname-item').off("mouseout");
       $('.egd-faultname-item').off("blur");
window.console.log("            trigger a call..on faultname..");
       if( $(this).val() != '' ) {
window.console.log("            with("+$(this).val()+")");
	 let criteria = [];
         let str=trimFaultString($(this).val());
         criteria.push(str);
window.console.log("        again with("+str+")");
         EGD_SLIPRATE.search(EGD_SLIPRATE.searchType.faultname, criteria);
       }
 //      $(this).blur();
     });
  });


  $("#egd-search-type").on('change', function () {
      let type=$(this).val();
  window.console.log( "initiate a search session...",type);
      if(type != "") {
        EGD_SLIPRATE.freshSearch(type);
      }
  });


  $("#egd-model-cfm").change(function() {
      if ($("#egd-model-cfm").prop('checked')) {
          CXM.showCFMFaults(viewermap);
          } else {
              CXM.hideCFMFaults(viewermap);
      }
  });

  $("#egd-model-gfm").change(function() {
      if ($("#egd-model-gfm").prop('checked')) {
          CXM.showGFMRegions(viewermap);
          } else {
              CXM.hideGFMRegions(viewermap);
      }
  });

  $.event.trigger({ type: "page-ready", "message": "completed", });


// MAIN SETUP

// load the data from backend and setup layers
  EGD_SLIPRATE.generateLayers();
// setup the interface 
  EGD_SLIPRATE.setupEGDInterface();

}); // end of MAIN
