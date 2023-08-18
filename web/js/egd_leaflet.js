/***
   egd_leaflet.js

This is leaflet specific utilities for EGD
***/

var init_map_zoom_level = 6;
var init_map_coordinates =  [37.73, -119.89];
var drawing_rectangle = false;

var scecAttribution ='<a href="https://www.scec.org">SCEC</a>';


var rectangle_options = {
       showArea: false,
         shapeOptions: {
              stroke: true,
              color: "red",
              weight: 3,
              opacity: 0.5,
              fill: true,
              fillColor: null, //same as color by default
              fillOpacity: 0.1,
              clickable: false
         }
};

var rectangleDrawer;
var mymap, baseLayers, layerControl, currentLayer;
var mylegend;

var egd_latlon_area_list=[];
var egd_latlon_point_list=[];

/*****************************************************************/

function clear_popup()
{
  viewermap.closePopup();
}

function resize_map()
{
  viewermap.invalidateSize();
}

function refresh_map()
{
  if (viewermap == undefined) {
    window.console.log("refresh_map: BAD BAD BAD");
    } else {
      viewermap.setView( init_map_coordinates, init_map_zoom_level);
  }
}

function set_map(center,zoom)
{
  if (viewermap == undefined) {
    window.console.log("set_map: BAD BAD BAD");
    } else {
      viewermap.setView(center, zoom);
  }
}

function get_bounds()
{
   var bounds=viewermap.getBounds();
   return bounds;
}

function get_map()
{
  var center=init_map_coordinates;
  var zoom=init_map_zoom_level;

  if (viewermap == undefined) {
    window.console.log("get_map: BAD BAD BAD");
    } else {
      center=viewermap.getCenter();
      zoom=viewermap.getZoom();
  }
  return [center, zoom];
}

function setup_viewer()
{
// esri
  // web@scec.org  - ArcGIS apiKey, https://leaflet-extras.github.io/leaflet-providers/preview/
  var esri_apiKey = "AAPK2ee0c01ab6d24308b9e833c6b6752e69Vo4_5Uhi_bMaLmlYedIB7N-3yuFv-QBkdyjXZZridaef1A823FMPeLXqVJ-ePKNy";
  var esri_topographic = L.esri.Vector.vectorBasemapLayer("ArcGIS:Topographic", {apikey: esri_apiKey});
  var esri_imagery = L.esri.Vector.vectorBasemapLayer("ArcGIS:Imagery", {apikey: esri_apiKey});
  var osm_streets_relief= L.esri.Vector.vectorBasemapLayer("OSM:StreetsRelief", {apikey: esri_apiKey});
  var esri_terrain = L.esri.Vector.vectorBasemapLayer("ArcGIS:Terrain", {apikey: esri_apiKey});

// otm topo
  var topoURL='https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
  var topoAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreeMap</a> contributors,<a href=http://viewfinderpanoramas.org"> SRTM</a> | &copy; <a href="https://www.opentopomap.org/copyright">OpenTopoMap</a>(CC-BY-SA)';
  L.tileLayer(topoURL, { detectRetina: true, attribution: topoAttribution, maxZoom:18 })

  var otm_topographic = L.tileLayer(topoURL, { detectRetina: true, attribution: topoAttribution, maxZoom:18});

  var jawg_dark = L.tileLayer('https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
        attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 0,
        maxZoom: 18,
        accessToken: 'hv01XLPeyXg9OUGzUzaH4R0yA108K1Y4MWmkxidYRe5ThWqv2ZSJbADyrhCZtE4l'});

  var jawg_light = L.tileLayer('https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
        attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 0,
        maxZoom: 18,
        accessToken: 'hv01XLPeyXg9OUGzUzaH4R0yA108K1Y4MWmkxidYRe5ThWqv2ZSJbADyrhCZtE4l' });

// osm street
  var openURL='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var openAttribution ='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  var osm_street=L.tileLayer(openURL, {attribution: openAttribution, maxZoom:18});

  baseLayers = {
    "esri topo" : esri_topographic,
    "esri imagery" : esri_imagery,
    "jawg light" : jawg_light,
    "jawg dark" : jawg_dark,
    "osm streets relief" : osm_streets_relief,
    "otm topo": otm_topographic,
    "osm street" : osm_street,
    "esri terrain": esri_terrain
  };

  var overLayer = {};
  var basemap = L.layerGroup();
  currentLayer = esri_topographic;


// ==> mymap <==
  mymap = L.map('EGD_plot', { zoomSnap: 0.25, drawControl:false, zoomControl:true} );

  mymap.setView(init_map_coordinates, init_map_zoom_level);
  mymap.attributionControl.addAttribution(scecAttribution);

  esri_topographic.addTo(mymap);

// basemap selection
  var ctrl_div=document.getElementById('external_leaflet_control');

// ==> layer control <==
// add and put it in the customized place
//  L.control.layers(baseLayers, overLayer).addTo(mymap);
  layerControl = L.control.layers(baseLayers, overLayer,{collapsed: true });
  layerControl.addTo(mymap);
  var elem= layerControl._container;
  elem.parentNode.removeChild(elem);

  ctrl_div.appendChild(layerControl.onAdd(mymap));
  // add a label to the leaflet-control-layers-list
  var forms_div=document.getElementsByClassName('leaflet-control-layers-list');
  var parent_div=forms_div[0].parentElement;
  var span = document.createElement('span');
  span.style="font-size:14px;font-weight:bold;";
  span.className="leaflet-control-layers-label";
  span.innerHTML = 'Select background';
  parent_div.insertBefore(span, forms_div[0]);



// ==> scalebar <==
  L.control.scale({metric: 'false', imperial:'false', position: 'bottomleft'}).addTo(mymap);

  function onMapMouseOver(e) {
    if(EGD_SLIPRATE.toDraw()) {
      drawRectangle();
    }
  }

  function onMapZoom(e) { 
    var zoom=mymap.getZoom();
window.console.log("map got zoomed..>>",zoom);
//XXX   need to resize the marker circle
    EGD_SLIPRATE.gotZoomed(zoom);
  }

  mymap.on('mouseover', onMapMouseOver);
  mymap.on('zoomend dragend', onMapZoom);

// ==> rectangle drawing control <==
  rectangleDrawer = new L.Draw.Rectangle(mymap, rectangle_options);
  mymap.on(L.Draw.Event.CREATED, function (e) {
    var type = e.layerType,
        layer = e.layer;
    if (type === 'rectangle') {  // only tracks rectangles
        // get the boundary of the rectangle
        var latlngs=layer.getLatLngs();
        // first one is always the south-west,
        // third one is always the north-east
        var loclist=latlngs[0];
        var sw=loclist[0];
        var ne=loclist[2];
        add_bounding_rectangle_layer(layer,sw['lat'],sw['lng'],ne['lat'],ne['lng']);
        mymap.addLayer(layer);
// XX CHECK, the rectangle created on the mapview does not seem to 'confirm'
// like hand inputed rectangle. Maybe some property needs to be set
// For now, just redraw the rectangle
	    //
        EGD_SLIPRATE.searchLatlon(1,latlngs);        
    }
  });

// enable the expand view key
$("#EGD_plot").prepend($("#expand-view-key-container").html());

// should  only have 1, adjust the attribution's location
let v= document.getElementsByClassName("leaflet-control-attribution")[0];
v.style.right="1.5rem";
v.style.height="1.4rem";
v.style.width="35rem";

// finally,
  return mymap;
}

function removeColorLegend() {
  mylegend.update();
}
function showColorLegend(param) {
  mylegend.update({}, param);
}

function drawRectangle(){
  rectangleDrawer.enable();
}
function skipRectangle(){
  rectangleDrawer.disable();
}

function addRectangleLayer(latA,lonA,latB,lonB) {
  var bounds = [[latA, lonA], [latB, lonB]];
  var layer=L.rectangle(bounds).addTo(viewermap);
  return layer;
}

// make it without adding to map
function makeRectangleLayer(latA,lonA,latB,lonB) {
  var bounds = [[latA, lonA], [latB, lonB]];
  var layer=L.rectangle(bounds);
  return layer;
}

function makeLeafletMarker(bounds,cname,size) {
  var myIcon = L.divIcon({className:cname});
  var myOptions = { icon : myIcon};

  var layer = L.marker(bounds, myOptions);
  var icon = layer.options.icon;
  var opt=icon.options;
  icon.options.iconSize = [size,size];
  layer.setIcon(icon);
  return layer;
}

// icon size 8 
function addMarkerLayerGroup(latlng,description,sz) {
  var cnt=latlng.length;
  if(cnt < 1)
    return null;
  var markers=[];
  for(var i=0;i<cnt;i++) {
     var bounds = latlng[i];
     var desc = description[i];
     var cname="default-point-icon";
     var marker=makeLeafletMarker(bounds,cname,sz);
     marker.bindTooltip(desc);
     markers.push(marker);
  }
  var group = new L.FeatureGroup(markers);
  mymap.addLayer(group);
  return group;
}

function switchLayer(layerString) {
    mymap.removeLayer(currentLayer);
    mymap.addLayer(baseLayers[layerString]);
    currentLayer = baseLayers[layerString];

}

/****************************** from a list ****************/

function add_bounding_rectangle(a,b,c,d) {
  // remove old one and add a new one
  remove_bounding_rectangle_layer();
  var layer=addRectangleLayer(a,b,c,d);
  var tmp={"layer":layer, "latlngs":[{"lat":a,"lon":b},{"lat":c,"lon":d}]};
  egd_latlon_area_list.push(tmp);
  return layer;
}

function remove_bounding_rectangle_layer() {
   if(egd_latlon_area_list.length == 1) {
     var area=egd_latlon_area_list.pop();
     var l=area["layer"];
     viewermap.removeLayer(l);
   }
}


function add_bounding_rectangle_layer(layer, a,b,c,d) {
  // remove old one and add a new one
  remove_bounding_rectangle_layer();
  var tmp={"layer":layer, "latlngs":[{"lat":a,"lon":b},{"lat":c,"lon":d}]};
  egd_latlon_area_list.push(tmp);
}

function add_marker_point(a,b) {
  // remove old one and add a new one
  remove_marker_point_layer();
  var layer=addMarkerLayer(a,b);
  var tmp={"layer":layer, "latlngs":[{"lat":a,"lon":b}]};
  egd_latlon_point_list.push(tmp);
  return layer;
}

function remove_marker_point_layer() {
   if(egd_latlon_point_list.length == 1) {
     var point=egd_latlon_point_list.pop();
     var l=point["layer"];
     viewermap.removeLayer(l);
   }
}

function add_marker_point_layer(layer, a,b) {
  // remove old one and add a new one
  remove_marker_point_layer();
  var tmp={"layer":layer, "latlngs":[{"lat":a,"lon":b}]};
  egd_latlon_point_list.push(tmp);
}


// see if layer is contained in the layerGroup
function containsLayer(layergroup,layer) {
    let target=layergroup.getLayerId(layer);
    let layers=layergroup.getLayers();
    for(var i=0; i<layers.length; i++) {
      let id=layergroup.getLayerId(layers[i]);
      if(id == target) {
        return 1;
      }
    }
    return 0;
}
