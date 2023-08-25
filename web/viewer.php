<?php
require_once("php/navigation.php");
require_once("php/EGD_SLIPRATE.php");
$header = getHeader("Viewer");

$egd_sliprate = new SLIPRATE();

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Earthquake Geology Database (Provisional)</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/vendor/font-awesome.min.css">
    <link rel="stylesheet" href="css/vendor/bootstrap.min.css">
    <link rel="stylesheet" href="css/vendor/bootstrap-grid.min.css">
    <link rel="stylesheet" href="css/vendor/leaflet.awesome-markers.css">
    <link rel="stylesheet" href="css/vendor/leaflet.css">
    <link rel="stylesheet" href="css/vendor/jquery-ui.css">
    <link rel="stylesheet" href="css/vendor/glyphicons.css">
    <link rel="stylesheet" href="css/vendor/all.css">
    <link rel="stylesheet" href="css/vendor/MarkerCluster.Default.css">
    <link rel="stylesheet" href="css/vendor/MarkerCluster.css">
    <link rel="stylesheet" href="css/cxm-ui.css?v=1">

    <script type="text/javascript" src="js/vendor/leaflet-src.js"></script>
    <script type='text/javascript' src='js/vendor/leaflet.awesome-markers.min.js'></script>
    <script type='text/javascript' src='js/vendor/popper.min.js'></script>
    <script type='text/javascript' src='js/vendor/jquery.min.js'></script>
    <script type='text/javascript' src='js/vendor/bootstrap.min.js'></script>
    <script type='text/javascript' src='js/vendor/jquery-ui.js'></script>
    <script type='text/javascript' src='js/vendor/esri-leaflet.js'></script>
    <script type='text/javascript' src='js/vendor/esri-leaflet-vector.js' crossorigin=""></script>

    <script type='text/javascript' src='js/vendor/FileSaver.js'></script>
    <script type='text/javascript' src='js/vendor/jszip.js'></script>
    <script type='text/javascript' src='js/vendor/jquery.floatThead.min.js'></script>

    <script type='text/javascript' src='js/vendor/togeojson.js'></script>
    <script type='text/javascript' src='js/vendor/leaflet-kmz-src.js'></script>
    <script type='text/javascript' src='js/vendor/leaflet.markercluster-src.js'></script>

    <link rel="stylesheet" href="js/vendor/plugin/Leaflet.draw/leaflet.draw.css">
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/Leaflet.draw.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/Leaflet.Draw.Event.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/Toolbar.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/Tooltip.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/ext/GeometryUtil.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/ext/LatLngUtil.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/ext/LineUtil.Intersect.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/ext/Polygon.Intersect.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/ext/Polyline.Intersect.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/ext/TouchEvents.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/DrawToolbar.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/handler/Draw.Feature.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/handler/Draw.SimpleShape.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/handler/Draw.Polyline.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/handler/Draw.Marker.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/handler/Draw.Circle.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/handler/Draw.CircleMarker.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/handler/Draw.Polygon.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/handler/Draw.Rectangle.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/EditToolbar.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/handler/EditToolbar.Edit.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/handler/EditToolbar.Delete.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/Control.Draw.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/handler/Edit.Poly.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/handler/Edit.SimpleShape.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/handler/Edit.Rectangle.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/handler/Edit.Marker.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/handler/Edit.CircleMarker.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/handler/Edit.Circle.js"></script>

<!-- egd js -->
    <script type="text/javascript" src="js/egd_ui.js?v=1"></script>
    <script type="text/javascript" src="js/egd_main.js?v=1"></script>
    <script type="text/javascript" src="js/egd_leaflet.js?v=1"></script>
    <script type="text/javascript" src="js/egd_sliprate.js?v=1"></script>
    <script type="text/javascript" src="js/egd_cmap.js?v=1"></script>

<!-- cxm js -->
    <script type="text/javascript" src="js/cxm_kml.js?v=1"></script>
    <script type="text/javascript" src="js/cxm_model_util.js?v=1"></script>
    <script type="text/javascript" src="js/cxm_misc_util.js?v=1"></script>

<!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-495056-12"></script>
    <script type="text/javascript">
        $ = jQuery;
        var tableLoadCompleted = false;
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }

        gtag('js', new Date());

        gtag('config', 'UA-495056-12');

        $(document).on("tableLoadCompleted", function () {
            tableLoadCompleted = true;

	    var $result_table = $('#result_table');
            $result_table.floatThead({
                scrollContainer: function ($table) {
                    return $table.closest('div#result-table-container');
                },
            });
        });

    </script>

</head>
<body>
<?php echo $header; ?>

<div class="container main" id="egdMain">

<!-- trace dumping buttons 
    <div style="display:none">
      <button id="dumpMarkerLatlngBtn" class="btn cxm-small-btn" onClick="toFileMarkerLatlng()">
                <span class="glyphicon glyphicon-share"></span> Export Marker Latlng</button>
    </div>
-->

<!-- top-intro -->
   <div id="top-intro" style="display:">
<p>The <a href="https://www.scec.org/research/egd">SCEC Earthquake Geology Database (EGD)</a>
currently consists of a set of georegistered sites where geologic estimates of fault slip rates 
have been estimated. To simplify browsing and downloading EGD data, the web tools below provide
a two-dimensional map-based view of the EGD. The EGD can be queried based on fault or site name,
and minimum/maximum slip rate, or by individually clicking on points on the map. Once sites are 
selected, they are added to the list below the map interface with selected metadata shown. The 
complete metadata for all selected sites can be downloaded (in .csv format) with the 
"Download All Data" button. Refer to the <a href="guide">user guide</a> for more details and 
usage instructions.<br></p>
   </div>

<!-- leaflet control -->
   <div class="row" style="display:none;">
        <div class="col justify-content-end custom-control-inline">
            <div style="display:none;" id="external_leaflet_control"></div>
        </div>
   </div>

<!-- top-control -->
   <div id="top-control" class="row">
      <div id="egd-controls-container" class="col" >
<!-- control-row-1 -->
        <div id="top-control-row-1" class="col-12">

          <div class="row mb-1">
             <form id="id_select_dataset">
               <label for="dataset"> Choose EGD Dataset : </label>
               <label><input type="radio" id="dataset_sliprate" name=dataset />
                        <span>Slip Rate Sites</span></label>
<!--
               <label><input type="radio" id="dataset_chronology" name=dataset />
                        <span>Chronology sites</span></label>
-->
             </form>
          </div>

<!-- SLIPRATE select -->
          <div id="egd-sliprate-search-control" class="row mt-1 container-control" style="margin-left:-30px">
            <div class="col-4 input-group filters mb-2">
              <select id="egd-search-type" class="custom-select">
                  <option value="">Search the Slip Rate Sites</option>
                  <option value="faultname">Fault Name</option>
                  <option value="sitename">Site Name</option>
                  <option value="latlon">Latitude &amp; Longitude</option>
                  <option value="minrate">Low Rate</option>
                  <option value="maxrate">High Rate</option>
              </select>
	      <div class="input-group-append">
                  <button id="refresh-all-button" onclick="EGD_SLIPRATE.reset();"
                           class="btn btn-dark pl-4 pr-4" type="button">Reset</button>
              </div>
            </div>

<!-- SLIPRATE option expand -->
            <div class="col-8">
              <ul>
                <li id='egd-fault-name' class='navigationLi' style="display:none">
                  <div class='menu row justify-content-center'>
                    <div class="col-12">
                      <div class="d-flex">
                           <input id="egd-faultnameTxt" placeholder="Enter Fault Name Followed by Enter Key" type="text"
                                  onfocus="this.value=''"
				  onkeypress="javascript:if (event.key == 'Enter') $('.egd-faultname-item').mouseout();"
                                  class="egd-faultname-item form-control">
                      </div>
                    </div>
                  </div>
                </li>
                <li id='egd-site-name' class='navigationLi ' style="display:none">
                  <div class='menu row justify-content-center'>
                    <div class="col-12">
                      <div class="d-flex">
                           <input id="egd-sitenameTxt" placeholder="Enter Site Name Followed by Enter Key" type="text"
                                  onfocus="this.value=''"
				  onkeypress="javascript:if (event.key == 'Enter') $('.egd-sitename-item').mouseout();"
                                  class="egd-sitename-item form-control">
                      </div>
                    </div>
                  </div>
                </li>
                <li id='egd-latlon' class='navigationLi ' style="display:none">
                  <div id='egd-latlonMenu' class='menu'>
                    <div class="row">
                      <div class="col-4">
                          <p style="margin-bottom:0;">Draw a rectangle on the map or enter latitudes and longitudes</p>
                      </div>
                      <div class="col-8">
                        <div class="form-inline latlon-input-boxes">
                            <input type="text"
                                   placeholder="Min Latitude"
                                   id="egd-firstLatTxt"
                                   title="first lat"
                                   class="egd-latlon-item form-control">
                            <input type="text" 
                                   placeholder='Min Longitude' 
                                   id="egd-firstLonTxt" 
                                   title="first lon"
                                   class="egd-latlon-item form-control">
                            <input type="text"
                                   id="egd-secondLatTxt"
                                   title="second lat"
                                   placeholder='Max Latitude'
                                   class="egd-latlon-item form-control">
                            <input type="text"
                                   id="egd-secondLonTxt"
                                   title="second lon"
                                   placeholder='Max Longitude'
                                   class="egd-latlon-item form-control">
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

<!-- minrate slider -->
                <li id='egd-minrate-slider' class='navigationLi' style="display:none;">
                  <div id='egd-minrate-sliderMenu' class='menu'>
                    <div class="row">
                      <div class="col-5">
                          <p style="margin-bottom:0">Select a range on the Low Rate slider or enter the two boundaries in mm/yr</p>
                      </div>
                      <div class="col-7">
                        <div class="form-inline vector-slider-input-boxes">
                          <input type="text"
                              id="egd-minMinrateSliderTxt"
                              title="min minrate slider"
			      class="egd-minrate-item form-control"
                              onkeypress="javascript:if (event.key == 'Enter') $('.egd-minrate-item').mouseout();">
                          <div class="col-5">
			    <div id="slider-minrate-range" style="border:1px solid black">
		              <div id="min-minrate-handle" class="ui-slider-handle"></div>
		              <div id="max-minrate-handle" class="ui-slider-handle"></div>
                            </div>
                          </div>
                          <input type="text"
                              id="egd-maxMinrateSliderTxt"
                              title="max minrate slider"
			      class="egd-minrate-item form-control"
                              onkeypress="javascript:if (event.key == 'Enter') $('.egd-minrate-item').mouseout();">
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
<!-- maxrate slider -->
                <li id='egd-maxrate-slider' class='navigationLi' style="display:none">
                  <div id='egd-maxrate-sliderMenu' class='menu'>
                    <div class="row">
                      <div class="col-5">
                          <p style="margin-bottom:0">Select a range on the High Rate slider or enter the two boundaries in mm/yr</p>
                      </div>
                      <div class="col-7">
                        <div class="form-inline vector-slider-input-boxes">
                          <input type="text"
                              id="egd-minMaxrateSliderTxt"
                              title="min maxrate slider"
                              class="egd-maxrate-item form-control"
                              onkeypress="javascript:if (event.key == 'Enter') $('.egd-maxrate-item').mouseout();">
                          <div class="col-5">
			    <div id="slider-maxrate-range" style="border:1px solid black">
		              <div id="min-maxrate-handle" class="ui-slider-handle"></div>
		              <div id="max-maxrate-handle" class="ui-slider-handle"></div>
                            </div>
                          </div>
                          <input type="text"
                              id="egd-maxMaxrateSliderTxt"
                              title="max maxrate slider"
			      class="egd-maxrate-item form-control"
                              onkeypress="javascript:if (event.key == 'Enter') $('.egd-maxrate-item').mouseout();">
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div> <!-- SLIPRATE option expand -->
         </div> <!-- egd-sliprate-search-control -->

        </div> <!-- top-control-row-1 -->

<!-- top-control-row 2 -->
        <div id="top-control-row-2" class="row justify-content-end mb-1">

          <div id='model-options' class="form-check-inline">
            <div class="form-check form-check-inline">
                <label class='form-check-label ml-1 mini-option'
                               for="egd-model-cfm">
                <input class='form-check-inline mr-1'
                               type="checkbox"
			       id="egd-model-cfm" value="1" />CFM6.0
                </label>
            </div>
            <div class="form-check form-check-inline">
                <label class='form-check-label ml-1 mini-option'
                               for="egd-model-gfm">
                <input class='form-check-inline mr-1'
                               type="checkbox"
			       id="egd-model-gfm" value="1" />GFM
                </label>
            </div>
          </div>

<!-- KML/KMZ overlay -->
          <div id="kml-row" class="col-2 custom-control-inline">
             <input id="fileKML" type='file' multiple onchange='uploadKMLFile(this.files)' style='display:none;'></input>
             <button id="kmlBtn" class="btn"
                      onclick='javascript:document.getElementById("fileKML").click();'
                      title="Upload your own kml/kmz file to be displayed on the map interface. We currently support points, lines, paths, polygons, and image overlays (kmz only)."
                      style="color:#395057;background-color:#f2f2f2;border:1px solid #ced4da;border-radius:0.2rem;padding:0.15rem 0.5rem;"><span>Upload kml/kmz</span></button>
             <button id="kmlSelectBtn" class="btn cxm-small-no-btn"
                      title="Show/Hide uploaded kml/kmz files"
                      style="display:none;" data-toggle="modal" data-target="#modalkmlselect">
                      <span id="eye_kml"  class="glyphicon glyphicon-eye-open"></span></button>
          </div> <!-- kml-row -->

          <div class="input-group input-group-sm custom-control-inline" id="map-controls" style="margin-right:15px">
              <div class="input-group-prepend">
                <label style='border-bottom:1;' class="input-group-text" for="mapLayer">Select Map Type</label>
              </div>
              <select id="mapLayer" class="custom-select custom-select-sm"
                                               onchange="switchLayer(this.value);">
                  <option selected value="esri topo">ESRI Topographic</option>
                  <option value="esri imagery">ESRI Imagery</option>
                  <option value="jawg light">Jawg Light</option>
                  <option value="jawg dark">Jawg Dark</option>
                  <option value="osm streets relief">OSM Streets Relief</option>
                  <option value="otm topo">OTM Topographic</option>
                  <option value="osm street">OSM Street</option>
                  <option value="esri terrain">ESRI Terrain</option>
              </select>
          </div>
        </div> <!-- top-control-row-2 -->

      </div> <!-- egd-controls-container -->
    </div> <!-- top-control -->

<!-- map space -->
    <div id="mapDataBig" class="row mapData">
      <div id="infoData" class="col-5 button-container d-flex flex-column pr-0" style="overflow:hidden">
	<div id="searchResult" style="overflow:hidden; display:" class="mb-1">
          <div id="result-table-container" style="border:solid 1px #ced4da;overflow-x:hidden">
            <table id="result-table">
              <thead>
              </thead>
            </table>
          </div> 
        </div>
        <div id="phpResponseTxt"></div>
      </div>

      <div id="top-map" class="col-7 pl-1">
        <div class="w-100 mb-1" id='EGD_plot'
             style="position:relative;border:solid 1px #ced4da; height:576px;">

<!-- spinner -->
             <div class="spinDialog" style="position:absolute;top:40%;left:50%; z-index:9999;">
               <div id="egd-wait-spin" align="center" style="display:none;"><i class="glyphicon glyphicon-cog fa-spin" style="color:red"></i></div>
             </div>

<!-- color legend -->
	     <div id="egd-main-legend" class="main-legend geometry top center" style="bottom:10%;background-color: rgba(255,255,255,0.5);display:none;">
	       <div class="col" style="color:tansparent">
                 <div class="row" style="margin:0px 2px 0px -20px">
                    <div class="legend mt-2" id="egd-legend-color"></div>
                    <div class="legend" id="egd-legend-label"></div>
                 </div>
                 <div id="egd-legend-title" align="center" class="legend content mt-1" style="border-top:2px solid grey">mm/y</div>
               </div>
             </div>



        </div>
      </div>
    </div>

    <div id="top-select" class="row mb-2">
      <div class="col-12">
         <div id="metadata-table-container" style="border:solid 1px #ced4da;overflow-x:hidden">
            <table id="metadata-table">
              <thead>
              </thead>    
              <tbody>
                <tr id="placeholder-row">
                  <td colspan="10">A subset of metadata for selected slip rate sites will appear here.<br>Once sites are selected, click "DOWNLOAD ALL DATA" to download the complete 28 columns of metadata for all selected sites in .csv format</td>
                </tr>
            </table>
         </div>
      </div>
    </div> <!-- top-select -->

</div> <!-- main -->

<div id="expand-view-key-container" style="display:none;">
  <div id="expand-view-key" class="row" style="opacity:0.8; height:1.4rem;">
    <button id="bigMapBtn" class="btn cfm-small-btn" title="Expand into a larger map" style="color:black;background-color:rgb(255,255,255);padding: 0rem 0.3rem 0rem 0.3rem" onclick="toggleBigMap()"><span class="fas fa-expand"></span>
    </button>
  </div>
</div>


<!-- modal list -->
<!--Modal: Model (modalkmlselect) -->
<div class="modal" id="modalkmlselect" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-small" id="modalkmlselectDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalkmlselectContent">
      <!--Body-->
      <div class="modal-body" id="modalkmlselectBody">
        <div class="row col-md-12 ml-auto" style="overflow:hidden;">
          <div class="col-12" id="kmlselectTable-container" style="font-size:14pt"></div>
        </div>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn btn-outline-primary btn-md" data-dismiss="modal">Close</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: modalkmlselect-->

<!--call php directly-->
    <script type="text/javascript">
            window.console.log("GRAB the station data..");
            egd_sliprate_site_data = <?php print $egd_sliprate->getAllStationData()->outputJSON(); ?>;
    </script>
</body>
</html>

