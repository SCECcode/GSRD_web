/***
   egd_sliprate.js

   var markers = L.markerClusterGroup();
markers.addLayer(L.marker(getRandomLatLng(map)));
... Add more layers ...
map.addLayer(markers);

http://leaflet.github.io/Leaflet.markercluster/#examples
https://stackoverflow.com/questions/22168558/multiple-markers-on-the-exact-same-position-on-a-leaflet-map
***/

var EGD_SLIPRATE = new function () {
    window.console.log("in EGD_SLIPRATE..");

    // complete set of sliprate layers, one marker layer for one site, 
    // setup once from viewer.php
    this.egd_layers;
    this.egd_markerLocations = [];

    // searched layers being actively looked at -- result of a search
    this.egd_active_layers = new L.FeatureGroup();
    this.egd_active_markerLocations = [];
    this.egd_active_gid = [];

    // selected some layers from active layers
    // to be displayed at the metadata_table
    this.egd_selected_gid = [];

    /* special case, track if last freshSearch was for minrate/maxrate
       value:"esri topo", "esri imagery", "jawg light", "jawg dark",
             "osm streets relief", "otm topo", "osm street", "esri terrain" */
    this.track_basemap = undefined;

    // locally used, floats
    this.egd_minrate_min=undefined;
    this.egd_minrate_max=undefined;
    this.egd_maxrate_min=undefined;
    this.egd_maxrate_max=undefined;

    var site_colors = {
        normal: '#006E90', // original
        selected: '#B02E0C',
        abnormal: '#00FFFF',
    };

    var site_marker_style = {
        normal: {
            color: "white",
            fillColor: site_colors.normal,
            fillOpacity: 1,
            radius: 3,
            riseOnHover: true,
            weight: 1,
        },
        selected: {
            color: "white",
            fillColor: site_colors.selected,
            fillOpacity: 1,
            radius: 3,
            riseOnHover: true,
            weight: 1,
        },
        hover: {
            fillOpacity: 1,
            radius: 10,
            weight: 2,
        },
    };

    this.defaultMapView = {
        coordinates: [37.73, -119.89],
        zoom: 6 
    };

    this.searchType = {
        none: 'none',
        faultname: 'faultname',
        sitename: 'sitename',
        latlon: 'latlon',
        minrate: 'minrate',
        maxrate: 'maxrate'
    };

    var sliprate_csv_keys= {
fault_name: 'Fault Name',
fault_id: 'NSHM23 Fault ID',
state: 'State',
site_name: 'Site Name',
egd_id: 'EGD ID',
sliprate_id: 'NSHM23 Slip Rate ID',
longitude: 'Longitude',
latitud: 'Latitude',
dist_to_cfmfault: 'Distance To Nearest CFM Fault (km)',
cfm6_objectname: 'CFM6.0 Object Name',
data_type: 'Data Type',
observation: 'Observation',
pref_rate: 'Preferred Rate',
low_rate: 'Low Rate',
high_rate: 'High Rate',
rate_unct: 'Rate Uncertainty',
rate_type: 'Rate Type',
rept_reint: 'ReptReint',
offset_type: 'Offset Type',
age_type: 'Age Type',
num_events: 'Num Events',
rate_age: 'Rate Age',
q_bin_min: 'Qbin Min',
q_bin_max: 'Qbin Max',
ucerf3_appb: 'UCERF3 AppB',
short_references: 'Short References',
links: 'DOI/Web Links',
full_references: 'Full References'
        };

    this.searchingType=this.searchType.none;

    var tablePlaceholderRow = `<tr id="placeholder-row">
                        <td colspan="10">A subset of metadata for selected slip rate sites will appear here. Once sites are selected, click "DOWNLOAD ALL DATA" to download the complete 28 columns of metadata for all selected sites in .csv format</td>
                    </tr>`;

    this.activateData = function() {
        activeProduct = Products.SLIPRATE;
        this.showOnMap();
        $("div.control-container").hide();
        $("#egd-controls-container").show();

    };

/********** create legend functions *********************/
// a layer is always generated with the full set of legend bins
function _legendoptioncolor(color) {
    var html="<li><span class=\"color\" style=\"background-color: "+color+"\"></span></li>";
    return html;
}
// a layer is always generated with the full set of legend bins
function _legendoptionlabel(label) {
    var html="<li><label class=\"legend-label\"><span>"+label+"</span></label></li>";
    return html;
}

this.setupSliprateLegend = function(legendinfo) {
window.console.log("setting up color legend..");
    if(jQuery.isEmptyObject(legendinfo)) {
        $('#egd-main-legend').css('display','none');
        return;
    }

    let labellist=legendinfo['labels']; // label includes the last extra one
    let colorlist=legendinfo['colors'];
    let chtml = "";
    let lhtml = "";

    let n=colorlist.length;
      // include the top 'invisible' one
    for(let i=0; i<n; i++) {
       let color=colorlist[i];
       let label=labellist[i]; // segment's label
       if(i== Math.floor(n/2)) {
         chtml=_legendoptioncolor(color, 1)+chtml;
         } else {
        chtml=_legendoptioncolor(color, 0)+chtml;
       }
       lhtml=_legendoptionlabel(label)+lhtml;
    }
    // include the top 'invisible' one
    lhtml=_legendoptionlabel(labellist[n])+lhtml;

    chtml="<ul>"+chtml+"</ul>";
    $("#egd-legend-color").html(chtml);

    lhtml="<ul>"+lhtml+"</ul>";
    $("#egd-legend-label").html(lhtml);

    // update the title to legend,
    $("#egd-legend-title").html("mm/yr");

    $('#egd-main-legend').css('display','');
}

/********** show layer/select functions *********************/
    function _makeLinksWithReferences(links,refs) {
        let rc="<div class=\'col\' style=\"max-width:30rem\">";
        let terms=links.split("; ");
        let rterms=refs.split(";");
        let sz=terms.length;
        let rsz=rterms.length;
     // special case,
        // "Blisniuk et al. (2010); Blisniuk and Rockwell (in prep; written communication to UCERF3, 2012)"
        if(sz != rsz) { 
       rc = rc+refs+"<div>";
          return rc;
        }
        for(let i=0; i<sz; i++) {
            if(i!=0)
          rc=rc+"<br>";

            if(terms[i] == "N/A") {
          rc = rc+rterms[i];
                } else {
                    rc = rc + "<a href=\""+terms[i]+"\" target=\"_blank\">"+rterms[i]+"</span></a>";
            }
        }
        rc=rc+"</div>";
        return rc;
    }

// egd_sliprate_site_data is from viewer.php, which is the JSON 
// result from calling php getAllSiteData script
    this.generateLayers = function () {

window.console.log( "generate the initial egd_layers");
        this.egd_layers = [];
        this.egd_markerLocations = [];
        this.egd_active_markerLocations = [];

// SELECT * FROM tb ORDER BY gid ASC;
        for (const index in egd_sliprate_site_data) {
          if (egd_sliprate_site_data.hasOwnProperty(index)) {
                let gid = egd_sliprate_site_data[index].gid;
                let egd_id = egd_sliprate_site_data[index].egdid;
                let sliprate_id = egd_sliprate_site_data[index].sliprateid;
                let longitude = parseFloat(egd_sliprate_site_data[index].longitude);
                let latitude = parseFloat(egd_sliprate_site_data[index].latitude);
                let fault_name = egd_sliprate_site_data[index].faultname;
                let cfm_name = egd_sliprate_site_data[index].cfm6objectname;
                let state = egd_sliprate_site_data[index].state;
                let site_name = egd_sliprate_site_data[index].sitename;
                let rate_type = egd_sliprate_site_data[index].ratetype;
                let low_rate = parseFloat(egd_sliprate_site_data[index].lowrate);
                let high_rate = parseFloat(egd_sliprate_site_data[index].highrate);
                let links = egd_sliprate_site_data[index].links;
                let short_references = egd_sliprate_site_data[index].shortreferences;

                let marker = L.circleMarker([latitude, longitude], site_marker_style.normal);

                let site_info = `${fault_name}`;

marker.bindTooltip(site_info).openTooltip();
//https://stackoverflow.com/questions/23874561/leafletjs-marker-bindpopup-with-options
            //
                 let reflinkstr= _makeLinksWithReferences(links,short_references);

marker.bindPopup("<strong>"+site_info+"</strong><br><strong>References: </strong><br>"+reflinkstr+"<strong>Rate Type: </strong>"+rate_type+"<br><strong>Low Rate: </strong>"+low_rate+"<br><strong>High Rate: </strong>"+high_rate, {maxWidth: 500});

                marker.scec_properties = {
                    idx: index,
                    active: true,
                    selected: false,
                    gid: gid,
                    egd_id: egd_id,
                    sliprate_id:sliprate_id,
                    longitude: longitude,
                    latitude: latitude,
                    fault_name: fault_name,
                    cfm_name: cfm_name,
                    state: state,
                    site_name: site_name,
                    low_rate: low_rate,
                    high_rate: high_rate,
                    rate_type: rate_type,
                    short_references: short_references,
                    links: links
          };

// all layers
                this.egd_layers.push(marker);
                this.egd_markerLocations.push(marker.getLatLng())                      
// current active layers
                this.egd_active_layers.addLayer(marker);
                this.egd_active_gid.push(gid);
                this.egd_active_markerLocations.push(marker.getLatLng())                      

                if(this.egd_minrate_min == undefined) {
                   this.egd_minrate_min = low_rate;
                   this.egd_minrate_max = low_rate;
                  } else {
                    if(low_rate != 0 && low_rate < this.egd_minrate_min) {
                      this.egd_minrate_min=low_rate;  
                    }
                    if(low_rate > this.egd_minrate_max) {
                      this.egd_minrate_max=low_rate;
                    }
                }
                if(this.egd_maxrate_min == undefined) {
                   this.egd_maxrate_min = high_rate;
                   this.egd_maxrate_max = high_rate;
                  } else {
                    if(high_rate !=0 && high_rate < this.egd_maxrate_min) {
                      this.egd_maxrate_min=high_rate;  
                    }
                    if(high_rate > this.egd_maxrate_max) {
                      this.egd_maxrate_max=high_rate;
                    }
                }
            }
        }

        cmapSetupSliprateSegments(this.egd_minrate_min,this.egd_minrate_max,this.egd_maxrate_min,this.egd_maxrate_max);

        this.gotZoomed = function (zoom) {
            if(this.egd_active_gid.length == 0) return;

            let normal=3;
            let target = normal;
            if(zoom > 6)  {
               target = (zoom > 9) ? 7 : (zoom - 6)+target;
            }
            if(site_marker_style.normal.radius == target) { // no changes..
               return;
            }
            site_marker_style.normal.radius=target;
            site_marker_style.hover.radius = (target *2) ;

         this.egd_active_layers.eachLayer(function(layer){
              layer.setRadius(target);
window.console.log("got Zoomed");
            });
        };

        this.egd_active_layers.on('click', function(event) {
            if(activeProduct == Products.SLIPRATE) { 
               EGD_SLIPRATE.toggleSiteSelected(event.layer, true);
            }
        });

        this.egd_active_layers.on('mouseover', function(event) {
            let layer = event.layer;
            layer.setRadius(site_marker_style.hover.radius);
        });

        this.egd_active_layers.on('mouseout', function(event) {
            let layer = event.layer;
            layer.setRadius(site_marker_style.normal.radius);
        });

        // now update the scec_properties's color
        this.fillAllLayersColors();
    };

// recreate a new active_layers using a glist
// glist is a sorted ascending list
// this.egd_layers should be also ascending
    this.createActiveLayerGroupWithGids = function(glist) {

        // remove the old ones and remove from result table
        this.clearAllSelections()
        this.egd_active_layers.remove();
        this.egd_active_layers= new L.FeatureGroup();
        this.egd_active_gid=[];
        this.egd_active_markerLocations = [];

        let minrate_min=undefined;
        let minrate_max=undefined;
        let maxrate_min=undefined;
        let maxrate_max=undefined;

        let gsz=glist.length;
        let lsz= this.egd_layers.length;
        let i_start=0;

        for (let j=0; j<gsz; j++) {
          let gid=glist[j];
          for (let i=i_start; i< lsz; i++) {
            let layer = this.egd_layers[i];
            if (layer.hasOwnProperty("scec_properties")) {
               if (gid == layer.scec_properties.gid) {
                  let lr=layer.scec_properties.low_rate;
                  let hr=layer.scec_properties.high_rate;

                  if(minrate_min == undefined) {
                     minrate_min = lr;
                     minrate_max = lr;
                     } else {
                       if(lr != 0 && lr  < minrate_min) {
                          minrate_min=lr;
                       }
                       if(lr > minrate_max) {
                          minrate_max=lr;
                       }
                  }
                  if(maxrate_min == undefined) {
                    maxrate_min = hr;
                    maxrate_max = hr;
                    } else {
                      if(lr !=0 && hr < maxrate_min) {
                        maxrate_min=hr;
                      }
                      if(hr > maxrate_max) {
                        maxrate_max=hr;
                      }
                  }

                  this.egd_active_layers.addLayer(layer);
                  this.egd_active_gid.push(gid);
                  this.egd_active_markerLocations.push(layer.getLatLng())                      
                  i_start=i+1;
                  break;
               }
            }
          }
        }

        if( (this.searchingType == this.searchType.minrate) ||
                (this.searchingType == this.searchType.maxrate) ) {
           // grabbing the max/min from the dashboard..
           //cmapSetupSliprateSegments(minrate_min,minrate_max,maxrate_min,maxrate_max);
           if(this.searchingType == this.searchType.minrate) {
              minrate_min=parseFloat($("#egd-minMinrateSliderTxt").val());
              minrate_max=parseFloat($("#egd-maxMinrateSliderTxt").val());
              cmapSetupSliprateSegments(minrate_min,minrate_max,maxrate_min,maxrate_max);
              let segminrateinfo=cmapFindSegmentProperties(this.searchType.minrate);
              this.setupSliprateLegend(segminrateinfo);
           }
           if(this.searchingType == this.searchType.maxrate) {
              maxrate_min=parseFloat($("#egd-minMaxrateSliderTxt").val());
              maxrate_max=parseFloat($("#egd-maxMaxrateSliderTxt").val());
              cmapSetupSliprateSegments(minrate_min,minrate_max,maxrate_min,maxrate_max);
              let segmaxrateinfo=cmapFindSegmentProperties(this.searchType.maxrate);
              this.setupSliprateLegend(segmaxrateinfo);
           }
        }
        this.replaceActiveLayersColor();

        replaceResultTableBodyWithGids(glist);
        this.egd_active_layers.addTo(viewermap);

        let bounds=get_bounding_rectangel_latlngs();
        if(bounds ==  undefined) {
          bounds = L.latLngBounds(this.egd_active_markerLocations);
        }
        viewermap.flyToBounds(bounds, { maxZoom:18, padding:[10,10]});

    };

// recreate the original map state
// original state  toOriginal use normal color
    this.recreateActiveLayerGroup = function(toOriginal) {

        if(this.egd_active_gid.length != this.egd_layers.length 
               || this.searchingType == this.searchType.minrate
               || this.searchingType == this.searchType.maxrate) {
          this.egd_active_layers= new L.FeatureGroup();
          this.egd_active_gid=[];
        
          for (let i=0; i< this.egd_layers.length; i++) {
            let marker = this.egd_layers[i];
            if (marker.hasOwnProperty("scec_properties")) {
               let gid = marker.scec_properties.gid;

               if(!toOriginal) {
                 this.replaceLayerColor(marker);
               }
              
               this.egd_active_layers.addLayer(marker);
               this.egd_active_gid.push(gid);
               this.egd_active_markerLocations.push(marker.getLatLng())                      
            }
          }
          replaceResultTableBodyWithGids(this.egd_active_gid);
          this.egd_active_layers.addTo(viewermap);
          } else {
            this.egd_active_layers.addTo(viewermap);
       }
window.console.log("flyingBounds --recreateActiveLayer");
       let bounds = L.latLngBounds(this.egd_active_markerLocations);
       viewermap.flyToBounds(bounds, {maxZoom:18, padding:[10,10]});
    }

// search for a layer from master list by gid
    this.getLayerByGid = function(gid) {
        let foundLayer = false;
        for (let i=0; i< this.egd_layers.length; i++) {
          let layer = this.egd_layers[i];
          if (layer.hasOwnProperty("scec_properties")) {
             if (gid == layer.scec_properties.gid) {
                 return layer;     
             }
          }
       }
       return foundLayer;
    };


    function _resetRadius(layer) {
      layer.setRadius(site_marker_style.normal.radius);
    }

// select from currently active sites
    this.toggleSiteSelected = function(layer, clickFromMap=false) {

        if (typeof layer.scec_properties.selected === 'undefined') {
            layer.scec_properties.selected = true;
        } else {
            layer.scec_properties.selected = !layer.scec_properties.selected;
        }
        if (layer.scec_properties.selected) {
            this.selectSiteByLayer(layer, clickFromMap);
            if(!clickFromMap) {  
               layer.setRadius(site_marker_style.hover.radius);
               setTimeout(_resetRadius, 500, layer);
            }

        } else {
            this.unselectSiteByLayer(layer);
        }
        return layer.scec_properties.selected;
    };

    this.toggleSiteSelectedByGid = function(gid) {
        let layer = this.getLayerByGid(gid);
        return this.toggleSiteSelected(layer, false);
    };

    this.hoverSiteSelectedByGid = function(gid) {
        let layer = this.getLayerByGid(gid);
        layer.setRadius(site_marker_style.hover.radius);
    };
    this.unhoverSiteSelectedByGid = function(gid) {
        let layer = this.getLayerByGid(gid);
        setTimeout(_resetRadius, 100, layer);

    };

    this.selectSiteByLayer = function (layer, moveTableRow=false) {
        layer.scec_properties.selected = true;
        layer.setStyle(site_marker_style.selected);
        let gid = layer.scec_properties.gid;

        this.upSelectedCount(gid);

        // metatable table
        let $row = $(`tr[sliprate-metadata-gid='${gid}'`);
        let rowHTML = "";
        if ($row.length == 0) {
           this.addToMetadataTable(layer);
        }
        // move row to top
        if (moveTableRow) {
            let $rowHTML = $row.prop('outerHTML');
            $row.remove();
            $("#metadata-table.sliprate tbody").prepend($rowHTML);
        }

        // search result table 
        let label="sliprate-result-gid_"+gid;
        let $elt=$(`#${label}`);
        if ($elt) {
            $elt.addClass('glyphicon-check').removeClass('glyphicon-unchecked');
        }
    };

    this.unselectSiteByLayer = function (layer) {
        layer.scec_properties.selected = false;
     this.replaceLayerColor(layer);

        let gid = layer.scec_properties.gid;

        this.downSelectedCount(gid);

        let $row = $(`tr[sliprate-metadata-gid='${gid}'`);
        if ($row.length != 0) {
           this.removeFromMetadataTable(gid);
        }

        let label="sliprate-result-gid_"+gid;
        let $elt=$(`#${label}`);
        if ($elt) {
            $elt.addClass('glyphicon-unchecked').removeClass('glyphicon-check');
        }
    };

    this.unselectSiteByGid = function (gid) {
        let layer = this.getLayerByGid(gid);
        return this.unselectSiteByLayer(layer);
    };

// selectAll button - toggle
    this.toggleSelectAll = function() {
        var sliprate_object = this;

        let $selectAllButton = $("#egd-allBtn span");
        if (!$selectAllButton.hasClass('glyphicon-check')) {
            this.egd_active_layers.eachLayer(function(layer){
                sliprate_object.selectSiteByLayer(layer);
            });
            $selectAllButton.addClass('glyphicon-check').removeClass('glyphicon-unchecked');
        } else {
            this.clearSelectAll();
        }
    };

// selectAll button  - clear
    this.clearSelectAll = function() {
        this.clearAllSelections();
        let $selectAllButton = $("#egd-allBtn span");
        $selectAllButton.removeClass('glyphicon-check').addClass('glyphicon-unchecked');
    };

// unselect every active layer
    this.clearAllSelections = function() {
        var sliprate_object = this;
        this.egd_active_layers.eachLayer(function(layer){
            sliprate_object.unselectSiteByLayer(layer);
        });
        let $selectAllButton = $("#egd-allBtn span");
        $selectAllButton.removeClass('glyphicon-check').addClass('glyphicon-unchecked');
    };

    this.upSelectedCount = function(gid) {
       let i=this.egd_selected_gid.indexOf(gid); 
       if(i != -1) {
         window.console.log("this is bad.. already in selected list "+gid);
         return;
       }
       this.egd_selected_gid.push(gid);
       updateDownloadCounter(this.egd_selected_gid.length);
    };

    this.downSelectedCount = function(gid) {
       if(this.egd_selected_gid.length == 0) { // just ignore..
         return;
       }
       let i=this.egd_selected_gid.indexOf(gid); 
       if(i == -1) {
         window.console.log("this is bad.. not in selected list "+gid);
         return;
       }
       window.console.log("=====remove from list "+gid);
       this.egd_selected_gid.splice(i,1);
       updateDownloadCounter(this.egd_selected_gid.length);
    };

    this.zeroSelectedCount = function() {
       this.egd_selected_gid = [];
       updateDownloadCounter(0);
    };


/********** search/layer  functions *********************/
    this.showSearch = function (type) {
        const $all_search_controls = $("#egd-sliprate-search-control ul li");
        $all_search_controls.hide();
        switch (type) {
            case this.searchType.faultname:
                $("#egd-fault-name").show();
                break;
            case this.searchType.sitename:
                $("#egd-site-name").show();
                break;
            case this.searchType.latlon:
                $("#egd-latlon").show();
                drawRectangle();
                break;
            case this.searchType.minrate:
                $("#egd-minrate-slider").show();
                let segminrateinfo=cmapFindSegmentProperties(this.searchType.minrate);
                this.setupSliprateLegend(segminrateinfo);
                break;
            case this.searchType.maxrate:
                $("#egd-maxrate-slider").show();
                let segmaxrteinfo=cmapFindSegmentProperties(this.searchType.maxrate);
                this.setupSliprateLegend(segmaxrateinfo);
                break;
            default:
                // no action
        }
    };

    this.showOnMap = function () {
        this.egd_active_layers.addTo(viewermap);
    };

    this.hideOnMap = function () {
        this.egd_active_layers.remove();
    };

// reset from the reset button
// reset option button, the map to original state
// but leave the external model state the same
    this.reset = function () {

window.console.log("calling reset");
        this.resetSearch();

        if ($("#egd-model-cfm").prop('checked')) {
          CXM.showCFMFaults(viewermap);
          } else {
          CXM.hideCFMFaults(viewermap);
        }

        if ($("#egd-model-gfm").prop('checked')) {
          CXM.showGFMRegions(viewermap);
          } else {
          CXM.hideGFMRegions(viewermap);
        }

        $("#egd-search-type").val("");
    };

// reset just the search only
    this.resetSearch = function (){

window.console.log("sliprate calling --->> resetSearch.");

        this.clearAllSelections();

        this.resetMinrate();
        this.resetMaxrate();
        this.resetLatLon();
        this.resetFaultname();
        this.resetSitename();

        this.hideOnMap();

        this.searchingType = this.searchType.none;
        this.recreateActiveLayerGroup(true);
    };

// a complete fresh search
    this.freshSearch = function (t){

        this.resetSearch();

        const $all_search_controls = $("#egd-controls-container ul li")
window.console.log("sliprate --- calling freshSearch..");
        switch (t) {
            case "faultname": 
               if(this.track_basemap != undefined) {
                   switchLayer(this.track_basemap);
                   this.track_basemap = undefined;
               }
               this.searchingType = this.searchType.faultname;
               $all_search_controls.hide();
               $("#egd-fault-name").show();
               break;
            case "sitename": 
               if(this.track_basemap != undefined) {
                   switchLayer(this.track_basemap);
                   this.track_basemap = undefined;
               }
               this.searchingType = this.searchType.sitename;
               $all_search_controls.hide();
               $("#egd-site-name").show();
               break;
            case "minrate": 
               this.searchingType = this.searchType.minrate;
// use dark basemap
               if(isBaseLayer("jawg dark") == false) {
                   this.track_basemap = getCurrentLayerString();
                   switchLayer("jawg dark");
               }
               $all_search_controls.hide();
               $("#egd-minrate-slider").show();
               $("#egd-minMinrateSliderTxt").val(this.egd_minrate_min);
               $("#egd-maxMinrateSliderTxt").val(this.egd_minrate_max);
               let segminrateinfo=cmapFindSegmentProperties(this.searchType.minrate);
               this.setupSliprateLegend(segminrateinfo);
               this.recreateActiveLayerGroup(false);
               break;
            case "maxrate": 
               this.searchingType = this.searchType.maxrate;
// use dark basemap
            if(isBaseLayer("jawg dark") == false) {
                   this.track_basemap = getCurrentLayerString();
                   switchLayer("jawg dark");
               }
               $all_search_controls.hide();
               $("#egd-maxrate-slider").show();
               $("#egd-minMaxrateSliderTxt").val(this.egd_maxrate_min);
               $("#egd-maxMaxrateSliderTxt").val(this.egd_maxrate_max);
               let segmaxrateinfo=cmapFindSegmentProperties(this.searchType.maxrate);
               this.setupSliprateLegend(segmaxrateinfo);
               this.recreateActiveLayerGroup(false);
               break;
            case "latlon": 
               if(this.track_basemap != undefined) {
                   switchLayer(this.track_basemap);
                   this.track_basemap = undefined;
               }
               this.searchingType = this.searchType.latlon;
               $all_search_controls.hide();
               $("#egd-latlon").show();
               drawRectangle();
               break;
            default:
               if(this.track_basemap != undefined) {
                   switchLayer(this.track_basemap);
                   this.track_basemap = undefined;
               }
               this.searchingType = this.searchType.none;
               break;
        }

        if ($("#egd-model-cfm").prop('checked')) {
          CXM.showCFMFaults(viewermap);
          } else {
            CXM.hideCFMFaults(viewermap);
        }

        if ($("#egd-model-gfm").prop('checked')) {
          CXM.showGFMRegions(viewermap);
          } else {
            CXM.hideGFMRegions(viewermap);
        }
    };

    this.getMarkerBySiteId = function (site_id) {
        for (const index in egd_sliprate_site_data) {
            if (egd_sliprate_site_data[index].egd_id == site_id) {
                return egd_sliprate_site_data[index];
            }
        }

        return [];
    };

    this.startWaitSpin = function() {
      $("#egd-wait-spin").css('display','');
    }
    this.removeWaitSpin = function() {
      $("#egd-wait-spin").css('display','none');
    }

    this.search = function(type, criteria) {

        if(type != this.searchingType)
          return;

        EGD_SLIPRATE.startWaitSpin();

        $searchResult = $("#searchResult");
        if (!type || !criteria) {
            $searchResult.html("");
        }
        if (!Array.isArray(criteria)) {
            criteria = [criteria];
        }

        let JSON_criteria = JSON.stringify(criteria);

        $.ajax({
            url: "php/search.php",
            data: {t: type, q: JSON_criteria},
        }).done(function(sliprate_result) {
            let glist=[];
            if(sliprate_result === "[]") {
window.console.log("Did not find any PHP result");
              EGD_SLIPRATE.removeWaitSpin();
            } else {
                let tmp=JSON.parse(sliprate_result); 
                if(type == EGD_SLIPRATE.searchType.faultname
                     ||  type == EGD_SLIPRATE.searchType.sitename
                     ||  type == EGD_SLIPRATE.searchType.minrate
                     ||  type == EGD_SLIPRATE.searchType.maxrate
                     ||  type == EGD_SLIPRATE.searchType.latlon) {
//expected [{'gid':'2'},{'gid':'10'}]
                    let sz=tmp.length;
                    for(let i=0; i<sz; i++) {
                        let gid= parseInt(tmp[i]['gid']); 
                        glist.push(gid);
                    }
                    } else {
window.console.log( "BAD, unknown search type \n");
                }
            }

            EGD_SLIPRATE.createActiveLayerGroupWithGids(glist);
            EGD_SLIPRATE.removeWaitSpin();
        });
    };

    // special case, Latlon can be from text inputs or from the map
    // fromWhere=0 is from text
    // fromWhere=1 from drawRectangle call
    this.searchLatlon = function (fromWhere, rect) {
        let criteria = [];
        if( fromWhere == 0) {
            let lat1=$("#egd-firstLatTxt").val();
            let lon1=$("#egd-firstLonTxt").val();
            let lat2=$("#egd-secondLatTxt").val();
            let lon2=$("#egd-secondLonTxt").val();
            if(lat1=='' || lon1=='' || lat2=='' || lon2=='') return;
            remove_bounding_rectangle_layer();
            add_bounding_rectangle(lat1,lon1,lat2,lon2);
            criteria.push(lat1);
            criteria.push(lon1);
            criteria.push(lat2);
            criteria.push(lon2);
            } else {
                var loclist=rect[0];
                var sw=loclist[0];
                var ne=loclist[2];
                criteria.push(sw['lat']);
                criteria.push(sw['lng']);
                criteria.push(ne['lat']);
                criteria.push(ne['lng']);

                $("#egd-firstLatTxt").val( parseFloat(criteria[0]).toFixed(5));
                $("#egd-firstLonTxt").val( parseFloat(criteria[1]).toFixed(5));
                $("#egd-secondLatTxt").val( parseFloat(criteria[2]).toFixed(5));
                $("#egd-secondLonTxt").val( parseFloat(criteria[3]).toFixed(5));
        }
                 
        this.search(EGD_SLIPRATE.searchType.latlon, criteria);

        let markerLocations = [];
        markerLocations.push(L.latLng(criteria[0],criteria[1]));
        markerLocations.push(L.latLng(criteria[2],criteria[3]));
        let bounds = L.latLngBounds(markerLocations);
window.console.log("flyingBounds --latlon");
        viewermap.flyToBounds(bounds, {maxZoom:18, padding:[10,10]});
//        setTimeout(skipRectangle, 500);
    };

/********** metadata  functions *********************/
/* create a metadata list using selected gid list
FaultName,FaultID,State,SiteName,EGDId,SliprateId,Longitude,Latitude,DistToCFMFault,CFM6ObjectName,DataType,Observation,PrefRate,LowRate,HighRate,RateUnct,RateType,ReptReint,OffsetType,AgeType,NumEvents,RateAge,QbinMin,QbinMax,
UCERF3AppB
ShortReferences,Links,FullReferences

gid
faultname
faultid
state
sitename
egdid
sliprateid
longitude
latitud
disttocfmfault
cfm6objectname
datatype
observation
prefrate
lowrate
highrate
rateunct
ratetype
reptreint
offsettype
agetype
numevents
rateage
qbinmin
qbinmax
ucerf3appb
shortreferences
links
fullreferences
*/
    function createMetaData(properties) {
        var meta={};
        meta.fault_name = properties.faultname;
        meta.fault_id = properties.faultid;
        meta.state = properties.state;
        meta.site_name = properties.sitename;
        meta.egd_id= properties.egdid;
        meta.sliprate_id= properties.sliprateid;
        meta.longitude = properties.longitude;
        meta.latitude = properties.latitude;
        meta.dist_to_cfmfault = properties.disttocfmfault;
        meta.cfm6_objectname = properties.cfm6objectname;
        meta.data_type = properties.datatype;
        meta.observation = properties.observation;
        meta.pref_rate = properties.prefrate;
        meta.low_rate = properties.lowrate;
        meta.high_rate = properties.highrate;
        meta.rate_unct = properties.rateunct;
        meta.rate_type = properties.ratetype;
        meta.rept_reint = properties.reptreint;
        meta.offset_type = properties.offsettype;
        meta.age_type = properties.agetype;
        meta.num_events = properties.numevents;
        meta.rate_age = properties.rateage;
        meta.q_bin_min = properties.qbinmin;
        meta.q_bin_max = properties.qbinmax;
        meta.ucerf3_appb = properties.ucerf3appb;
        meta.short_references = properties.shortreferences;
        meta.links = properties.links;
        meta.full_references = properties.fullreferences;
        return meta;
    }

    this.addToMetadataTable = function(layer) {
        let $table = $("#metadata-table.sliprate tbody");
        let gid = layer.scec_properties.gid;
        if ($(`tr[sliprate-metadata-gid='${gid}'`).length > 0) {
            return;
        }
        let html = generateMetadataTableRow(layer);
        $table.prepend(html);
     $(`#metadata-table tbody tr[id='placeholder-row']`).remove();
    };

    this.removeFromMetadataTable = function (gid) {
        let $table = $("#metadata-table tbody");
// prepend it if there is only no more 
        if(this.egd_selected_gid.length == 0) {
          $table.prepend(tablePlaceholderRow);
        }

        $(`#metadata-table tbody tr[sliprate-metadata-gid='${gid}']`).remove();
    };

    var generateMetadataTableRow = function(layer) {
        let $table = $("#metadata-table");
        let html = "";
        let reflinkstr= _makeLinksWithReferences(layer.scec_properties.links,layer.scec_properties.short_references);

        html += `<tr sliprate-metadata-gid="${layer.scec_properties.gid}">`;

        html += `<td><button class=\"btn btn-sm cxm-small-btn\" id=\"button_meta_${layer.scec_properties.gid}\" title=\"remove the site\" onclick=EGD_SLIPRATE.unselectSiteByGid("${layer.scec_properties.gid}") onmouseover=EGD_SLIPRATE.hoverSiteSelectedByGid("${layer.scec_properties.gid}") onmouseout=EGD_SLIPRATE.unhoverSiteSelectedByGid("${layer.scec_properties.gid}") ><span id=\"sliprate_metadata_${layer.scec_properties.gid}\" class=\"glyphicon glyphicon-trash\"></span></button></td>`;
        html += `<td class="meta-data">${layer.scec_properties.egd_id}</td>`;
        html += `<td class="meta-data" onmouseover=EGD_SLIPRATE.hoverSiteSelectedByGid("${layer.scec_properties.gid}") onmouseout=EGD_SLIPRATE.unhoverSiteSelectedByGid("${layer.scec_properties.gid}")>${layer.scec_properties.fault_name} </td>`;
        html += `<td class="meta-data">${layer.scec_properties.site_name}</td>`;

        html += `<td class="meta-data" >${layer.scec_properties.rate_type} </td>`;
        html += `<td class="meta-data" >${layer.scec_properties.low_rate} </td>`;
        html += `<td class="meta-data" >${layer.scec_properties.high_rate}</td>`;
        html += `<td class="meta-data" >${layer.scec_properties.cfm_name}</td>`;
        html += `<td class="meta-data" colspan=2>${reflinkstr}</td>`;
        html += `</tr>`;
        return html;
    };

    var generateMetadataTable = function (results) {
window.console.log("generateMetadataTable..");
            var html = "";
            html+=`
<thead>
<tr>
        <th class="text-center button-container" style="width:2rem">
        </th>
        <th class="hoverColor" style="width:3rem" >EGD ID<span></span></th>
        <th class="hoverColor" onClick="sortMetadataTableByRow(2,'a')" style="width:8rem">Fault Name&nbsp;<span id='sortCol_2' class="fas fa-angle-down"></span></th>
        <th class="hoverColor" onClick="sortMetadataTableByRow(3,'a')" style="width:8rem">Site Name&nbsp;<span id='sortCol_3' class="fas fa-angle-down"></span></th>
        <th class="hoverColor" onClick="sortMetadataTableByRow(4,'a')" style="width:8rem;">Rate Type&nbsp;<span id='sortCol_6' class="fas fa-angle-down"></span></th>
        <th class="hoverColor" onClick="sortMetadataTableByRow(5,'n')" style="width:4rem;">Low Rate<br>(mm/yr)&nbsp;<span id='sortCol_6' class="fas fa-angle-down"></span></th>
        <th class="hoverColor" onClick="sortMetadataTableByRow(6,'n')" style="width:4rem">High Rate<br>(mm/yr)&nbsp;<span id='sortCol_7' class="fas fa-angle-down"></span></th>
        <th class="hoverColor" onClick="sortMetadataTableByRow(7,'a')" style="width:10rem">CFM6 Object&nbsp;<span id='sortCol_7' class="fas fa-angle-down"></span></th>
        <th class="hoverColor" onClick="sortMetadataTableByRow(8,'a')" style="width:8rem; border-right-color:transparent;">&nbsp;&nbsp;References&nbsp;<span id='sortCol_8' class="fas fa-angle-down"></span></th>
        <th style="width:6em;border-left-color:transparent;"><div class="text-center">
<!--download all -->
                <div class="btn-group download-now">
                    <button id="download-all" type="button" class="btn btn-dark" value="metadata"
                      style="padding:0 0.5rem 0 0.5rem;" 
                            onclick="EGD_SLIPRATE.downloadURLsAsZip(this.value);" disabled>
                            DOWNLOAD All DATA&nbsp;<span id="download-counter"></span>
                    </button>
                </div>
        </th>
</tr>
</thead>
<tbody>`;

            for (let i = 0; i < results.length; i++) {
                html += generateMetadataTableRow(results[i]);
            }
            if (results.length == 0) {
                html += tablePlaceholderRow;
            }
            html=html+"</tbody>";
            return html;
        };

       var changeMetadataTableBody = function (results) {

            var html = "";
            for (let i = 0; i < results.length; i++) {
                html += generateMetadataTableRow(results[i]);
            }
            if (results.length == 0) {
                html += tablePlaceholderRow;
            }
            return html;
        };

   
        this.replaceMetadataTableBody = function(results) {
            $("#metadata-table tbody").html(changeMetadataTableBody(results));
        };

        this.replaceMetadataTable = function(results) {
            $("#metadata-table").html(generateMetadataTable(results));
        };

/********************* reset functions **************************/
        this.toDraw = function () {
          if( this.searchingType == this.searchType.latlon) { 
            return true;
          }
          return false;
        }

        this.resetLatLon = function () {
          if( this.searchingType != this.searchType.latlon) return;
          $("#egd-firstLatTxt").val("");
          $("#egd-firstLonTxt").val("");
          $("#egd-secondLatTxt").val("");
          $("#egd-scecondLonTxt").val("");
          skipRectangle();
          remove_bounding_rectangle_layer();
          $("#egd-latlon").hide();
        }
        this.clearLatLon = function () {
          if( this.searchingType != this.searchType.latlon) return;
          $("#egd-firstLatTxt").val("");
          $("#egd-firstLonTxt").val("");
          $("#egd-secondLatTxt").val("");
          $("#egd-scecondLonTxt").val("");
        }

        this.resetFaultname = function () {
          if( this.searchingType != this.searchType.faultname) return;
          $("#egd-faultnameTxt").val("");
          $("#egd-fault-name").hide();
        }
        this.resetSitename = function () {
          if( this.searchingType != this.searchType.sitename) return;
          $("#egd-sitenameTxt").val("");
          $("#egd-site-name").hide();
        }

        this.resetMinrate = function () {
          if( this.searchingType != this.searchType.minrate) return;
          this.resetMinrateSlider();
          $("#egd-minrate-slider").hide();
          this.setupSliprateLegend({});
          // reset marker color on all marker layers
          this.resetAllLayersColor();
          cmapSetupSliprateSegments(this.egd_minrate_min,this.egd_minrate_max,this.egd_maxrate_min,this.egd_maxrate_max);
       $("#egd-minMinrateSliderTxt").val(this.egd_minrate_min);
          $("#egd-maxMinrateSliderTxt").val(this.egd_minrate_max);
       if(this.track_basemap != undefined ) {
            switchLayer(this.track_basemap);
            this.track_basemap = undefined;
          }
        }

        this.resetMaxrate = function () {
          if( this.searchingType != this.searchType.maxrate) return;
          this.resetMaxrateSlider();
          $("#egd-maxrate-slider").hide();
          this.setupSliprateLegend({});
          // reset marker color on all marker layers
          this.resetAllLayersColor();
          cmapSetupSliprateSegments(this.egd_minrate_min,this.egd_minrate_max,this.egd_maxrate_min,this.egd_maxrate_max);
       $("#egd-minMaxrateSliderTxt").val(this.egd_maxrate_min);
          $("#egd-maxMaxrateSliderTxt").val(this.egd_maxrate_max);
       if(this.track_basemap != undefined ) {
            switchLayer(this.track_basemap);
            this.track_basemap = undefined;
          }
        }

        this.setMinrateRangeColor = function (target_min, target_max){
          let myColor=cmapGetSegmentColors();
          let myColorString="linear-gradient(to right, "+myColor.toString()+")";
          $("#slider-minrate-range .ui-slider-range" ).css( "background", myColorString );
        }


        this.resetMinrateSlider = function () {
          if( this.searchingType != this.searchType.minrate) return;
          $("#slider-minrate-range").slider('values', 
                              [this.egd_minrate_min, this.egd_minrate_max]);
          $("#egd-minMinrateSliderTxt").val(this.egd_minrate_min);
          $("#egd-maxMinrateSliderTxt").val(this.egd_minrate_max);
        }

        this.setMaxrateRangeColor = function (target_min, target_max){
          let myColor=cmapGetSegmentColors();
          let myColorString="linear-gradient(to right, "+myColor.toString()+")";
          $("#slider-maxrate-range .ui-slider-range" ).css( "background", myColorString );
        }

        this.resetMaxrateSlider = function () {
          if( this.searchingType != this.searchType.maxrate) return;
          $("#slider-maxrate-range").slider('values', 
                              [this.egd_maxrate_min, this.egd_maxrate_max]);
          $("#egd-minMaxrateSliderTxt").val(this.egd_maxrate_min);
          $("#egd-maxMaxrateSliderTxt").val(this.egd_maxrate_max);
        }

        this.refreshMaxrateSlider = function () {
          if( this.searchingType != this.searchType.maxrate) return;
          let maxrate_min=parseFloat($("#egd-minMaxrateSliderTxt").val());
          let maxrate_max=parseFloat($("#egd-maxMaxrateSliderTxt").val());
window.console.log("HERE...");
          $("#slider-maxrate-range").slider('values', 
                              [maxrate_min, maxrate_max]);
          this.search(this.searchingType, [maxrate_min, maxrate_max]);
        }

        this.refreshMinrateSlider = function () {
          if( this.searchingType != this.searchType.minrate) return;
          let minrate_min=parseFloat($("#egd-minMinrateSliderTxt").val());
          let minrate_max=parseFloat($("#egd-maxMinrateSliderTxt").val());
          $("#slider-minrate-range").slider('values', 
                              [minrate_min, minrate_max]);
          this.search(this.searchingType, [minrate_min, minrate_max]);
        }

/********************* marker color function **************************/
// marker.scec_properties.full_high_rate_color, marker.sce_properties.full_low_rate_color
        this.fillAllLayersColors = function() {
            let lsz = this.egd_layers.length;
            for(let i=0; i<lsz; i++) {
                let layer=this.egd_layers[i];
                let hr = layer.scec_properties.high_rate;
                let lr = layer.scec_properties.low_rate;
                layer.scec_properties.full_low_rate_color = cmapGetSliprateLowRateColor(lr);
                layer.scec_properties.full_high_rate_color = cmapGetSliprateHighRateColor(hr);
            }
        }

        this.replaceLayerColor = function(layer) {
            let myColor = site_colors.normal;

            let hr = layer.scec_properties.high_rate;
            let lr = layer.scec_properties.low_rate;
            if( this.searchingType == this.searchType.minrate) {
                myColor = cmapGetSliprateLowRateColor(lr);
            }
            if( this.searchingType == this.searchType.maxrate) {
                myColor = cmapGetSliprateHighRateColor(hr);
            }
            if(layer.scec_properties.selected) {
                myColor = site_colors.selected;
            }
            layer.setStyle({fillColor:myColor, color:"white"});
       }

       // iterate through active layer and update color by type
       this.replaceActiveLayersColor = function () {
            let myColor = site_colors.normal;

            let layers=this.egd_active_layers.getLayers();
            let sz=layers.length;
            for(let i=0; i<sz; i++) {
              let layer=layers[i];
              this.replaceLayerColor(layer);
            }
       }

       // iterate through all layer and update color by type
       this.resetAllLayersColor = function () {
            let myColor = site_colors.normal;

            let layers=this.egd_layers;
            let sz=layers.length;
            for(let i=0; i<sz; i++) {
              let layer=layers[i];
              layer.setStyle({fillColor:myColor, color:"white"});
            }
        }


/********************* sliprate INTERFACE function **************************/
        this.setupEGDInterface = function() {

            var $result_table = $('#result-table');
            $result_table.floatThead('destroy');
            $("#result-table").html(makeResultTable(egd_sliprate_site_data));
            $result_table.floatThead({
                 scrollContainer: function ($table) {
                     return $table.closest('div#result-table-container');
                 },
            });

            let elt=document.getElementById("dataset_sliprate");
            elt.click();

            $("#egd-controlers-container").css('display','');
            $("#egd-sliprate-controlers-container").css('display','none');

            $("div.mapData div.map-container").css('padding-left','30px');

            var $download_queue_table = $('#metadata-table');
            $download_queue_table.floatThead('destroy');
            this.replaceMetadataTable([]);
            $download_queue_table.addClass('sliprate');
            $download_queue_table.floatThead({
                 scrollContainer: function ($table) {
                     return $table.closest('div#metadata-table-container');
                 },
            });

            this.activateData();

            if(this.egd_markerLocations.length == 0) {
window.console.log("BAD.. no markers ???");
              } else {
                viewermap.invalidateSize();
                let bounds = L.latLngBounds(this.egd_markerLocations);
window.console.log("fit bounds to all marker");
                viewermap.fitBounds(bounds);
            }
/*
{
let center=viewermap.getCenter();
let zoom=viewermap.getZoom();
window.console.log(center, zoom);
}
*/


/* setup  sliders */
            $("#slider-minrate-range").slider({ 
              range:true, 
              step:0.001,
              min:this.egd_minrate_min, 
              max:this.egd_minrate_max, 
              values:[this.egd_minrate_min, this.egd_minrate_max],
              slide: function( event, ui ) {
                           $("#egd-minMinrateSliderTxt").val(ui.values[0]);
                           $("#egd-maxMinrateSliderTxt").val(ui.values[1]);
                           EGD_SLIPRATE.setMinrateRangeColor(ui.values[0],ui.values[1]);
                     },
              change: function( event, ui ) {
                           $("#egd-minMinrateSliderTxt").val(ui.values[0]);
                           $("#egd-maxMinrateSliderTxt").val(ui.values[1]);
                           EGD_SLIPRATE.setMinrateRangeColor(ui.values[0],ui.values[1]);
                     },
              stop: function( event, ui ) {
                           let searchType = EGD_SLIPRATE.searchType.minrate;
                           EGD_SLIPRATE.search(searchType, ui.values);
                     },
              create: function() {
                          $("#egd-minMinrateSliderTxt").val(this.egd_minrate_min);
                          $("#egd-maxMinrateSliderTxt").val(this.egd_minrate_max);
                    }
            });
            $('#slider-minrate-range').slider("option", "min", this.egd_minrate_min);
            $('#slider-minrate-range').slider("option", "max", this.egd_minrate_max);

/* setup  sliders */
            $("#slider-maxrate-range").slider({ 
              range:true, 
              step:0.001,
              min:this.egd_maxrate_min,
              max:this.egd_maxrate_max,
              values:[this.egd_maxrate_min, this.egd_maxrate_max],
              slide: function( event, ui ) {
window.console.log("in maxrate slider..-- change");
                           $("#egd-minMaxrateSliderTxt").val(ui.values[0]);
                           $("#egd-maxMaxrateSliderTxt").val(ui.values[1]);
                           //EGD_SLIPRATE.setMaxrateRangeColor(ui.values[0],ui.values[1]);
                     },
              change: function( event, ui ) {
window.console.log("in maxrate slider..-- change");
                           $("#egd-minMaxrateSliderTxt").val(ui.values[0]);
                           $("#egd-maxMaxrateSliderTxt").val(ui.values[1]);
                           //EGD_SLIPRATE.setMaxrateRangeColor(ui.values[0],ui.values[1]);
                     },
              stop: function( event, ui ) {
window.console.log("in maxrate slider..-- stop");
                           let searchType = EGD_SLIPRATE.searchType.maxrate;
                           EGD_SLIPRATE.search(searchType, ui.values);
                     },
              create: function() {
window.console.log("in maxrate slider..-- create");
                          $("#egd-minMaxrateSliderTxt").val(this.egd_maxrate_min);
                          $("#egd-maxMaxrateSliderTxt").val(this.egd_maxrate_max);
                    }
            });
window.console.log("setting up the maxrate slider ..");
            $('#slider-maxrate-range').slider("option", "min", this.egd_maxrate_min);
            $('#slider-maxrate-range').slider("option", "max", this.egd_maxrate_max);
    };

/******************  Result table functions **************************/
    function makeResultTableBody(json) {

        var html="<tbody id=\"result-table-body\">";
        var sz=json.length;

//onmouseover=EGD_SLIPRATE.hoverSiteSelectedByGid("+gid+") onmouseout=EGD_SLIPRATE.unhoverSiteSelectedByGid("+gid+ ")
        var tmp="";
        for( var i=0; i< sz; i++) {
           var s=json[i];
           var gid=parseInt(s.gid);
           var name=s.faultname + " | " +s.sitename;
           var t="<tr id=\"row_"+gid+"\"><td style=\"width:25px\"><button class=\"btn btn-sm cxm-small-btn\" id=\"button_"+gid+"\" title=\"highlight the fault\" onclick=EGD_SLIPRATE.toggleSiteSelectedByGid("+gid+")><span id=\"sliprate-result-gid_"+gid+"\" class=\"glyphicon glyphicon-unchecked\"></span></button></td><td><label for=\"button_"+gid+"\" onmouseover=EGD_SLIPRATE.hoverSiteSelectedByGid("+gid+") onmouseout=EGD_SLIPRATE.unhoverSiteSelectedByGid("+gid+ ")>" + name + "</label></td></tr>";
           tmp=tmp+t;
        }
        html=html+ tmp + "</tbody>";

        return html;
    }

    function replaceResultTableBodyWithGids(glist) {

        var html="";
        var sz=glist.length;

        for( var i=0; i< sz; i++) {
           let gid=glist[i];
           let layer=EGD_SLIPRATE.getLayerByGid(gid);
           let s=layer.scec_properties;
           let name= s.fault_name + " | " +s.site_name;

           var t="<tr id=\"row_"+gid+"\"><td style=\"width:25px\"><button class=\"btn btn-sm cxm-small-btn\" id=\"button_"+gid+"\" title=\"highlight the fault\" onclick=EGD_SLIPRATE.toggleSiteSelectedByGid("+gid+")><span id=\"sliprate-result-gid_"+gid+"\" class=\"glyphicon glyphicon-unchecked\"></span></button></td><td><label for=\"button_"+gid+"\">" + name + "</label></td></tr>";
           html=html+t;
        }

        document.getElementById("result-table-body").innerHTML = html;
    }


    function makeResultTable(json) {
        var html="";
        html+=`
<thead>
<tr>
   <th class='text-center'><button id=\"egd-allBtn\" class=\"btn btn-sm cxm-small-btn\" title=\"select all visible sliprate sites\" onclick=\"EGD_SLIPRATE.toggleSelectAll();\"><span class=\"glyphicon glyphicon-unchecked\"></span></button></th>
<th class='myheader'>EGD Site Location ( fault | site )</th>
</tr>
</thead>`;
        var body=makeResultTableBody(json);
        html=html+ "<tbody>" + body + "</tbody>";

        return html;
    }

/********************** zip utilities functions *************************/
    this.downloadURLsAsZip = function(ftype) {
window.console.log("calling download..");
        var nzip=new JSZip();
        var layers=EGD_SLIPRATE.egd_active_layers.getLayers();
        let timestamp=$.now();
        let mlist=[];
      
        var cnt=layers.length;
        for(var i=0; i<cnt; i++) {
          let layer=layers[i];

          if( !layer.scec_properties.selected ) {
            continue;
          }

          if(ftype == "metadata" || ftype == "all") {
          // create metadata from layer.scec_properties
            let m=createMetaData(egd_sliprate_site_data[layer.scec_properties.idx]);
            mlist.push(m);
          }
      
/***** this is for downloading some generated file from the result directory..
          if(ftype == "extra") {
            let downloadURL = getDataDownloadURL(layer.scec_properties.egd_id);
            let dname=downloadURL.substring(downloadURL.lastIndexOf('/')+1);
            let promise = $.get(downloadURL);
            nzip.file(dname,promise);
          }
***/
        }

        if(mlist.length != 0) {
          var data=getCSVFromMeta(mlist);
          saveAsCSVBlobFile("EGD_sliprate_", data, timestamp);
        }
    };


    function getCSVFromMeta(mlist) {
        var len=mlist.length;  // each data is a meta data format
        var last=len-1;

    // grab the first meta data and generate the title..
        var meta=mlist[0];
        var keys=Object.keys(meta);
        var jlen=keys.length;
        
//        var csvblob = keys.join(",");
        var csvblob=sliprate_csv_keys[keys[0]];
        for(let k=1; k< jlen; k++) {
           csvblob += (','+sliprate_csv_keys[keys[k]]);
        }
        csvblob +='\n';

        for(let i=0; i< len; i++) {
            let j=0;
            meta=mlist[i];
            var values=Object.values(meta)
            var vblob=JSON.stringify(values[0]);
            for(j=1; j< jlen; j++) {
                var vv=values[j];
                if(vv != null) {
                  if(isNaN(vv)) {
                    vblob=vblob+","+ JSON.stringify(vv);
                    } else {
                      vblob=vblob+","+vv;
                  }
                  } else {
                    vblob=vblob+",";
                }
            }
            csvblob += vblob;
            if(i != last) {
            csvblob +='\n';
            }
        }
//http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
        return csvblob;
    }
           
};
