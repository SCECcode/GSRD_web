<?php
require_once("php/navigation.php");
$header = getHeader("User Guide");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link href="css/vendor/font-awesome.min.css" rel="stylesheet">

    <link rel="stylesheet" href="css/vendor/bootstrap.min.css">
    <link rel="stylesheet" href="css/vendor/bootstrap-grid.min.css">
    <link rel="stylesheet" href="css/vendor/jquery-ui.css">
    <link rel="stylesheet" href="css/vendor/glyphicons.css">
    <link rel="stylesheet" href="css/cxm-ui.css">
    <link rel="stylesheet" href="css/sidebar.css">

    <script type='text/javascript' src='js/vendor/popper.min.js'></script>
    <script type='text/javascript' src='js/vendor/jquery.min.js'></script>
    <script type='text/javascript' src='js/vendor/bootstrap.min.js'></script>
    <script type='text/javascript' src='js/vendor/jquery-ui.js'></script>
    <title>Earthquake Geology Data Web Tool: User Guide</title>
</head>
<body>
<?php echo $header; ?>

<div class="container info-page-container scec-main-container guide">

    <h1>Geologic Slip Rate Database Explorer User Guide</h1>

    <div class="row">
        <div class="col-12">
            <figure class="cxm-interface figure float-lg-right">
                <img src="img/gsrd-viewer.png" class="figure-img img-fluid" alt="Screen capture of Geologic Slip Rate Database Explorer interface">
                <figcaption class="figure-caption">Screen capture of Geologic Slip Rate Database Explorer interface</figcaption>
            </figure>
            <h4><strong>Geologic Slip Rate Database Explorer Overview</strong></h4>

	    <p>The Geologic Slip Rate Database Explorer provide interactive map-based views of
               the database source data. The explorers allow users to search and view the
               Slip Rate Database archive using the pull-down menu near the top left of the
               interface without having to download the entire Slip Rate Database archive.
               The pages on this site include the main
               <a href="<?php echo $host_site_actual_path; ?>">Geologic Slip Rate Database Explorer page</a>, 
               this user guide, <a href="disclaimer">a disclaimer</a>, and a 
               <a href="contact">contact information</a> page.</p>

	    <p>The main Geologic Slip Rate Database Explorer interface is on the explorer page. 
               When first loaded, 
	       all sites in the database are listed on the left side of the screen (labeled by
	       fault name | site name) and shown on the interactive map interface 
	       (with blue circles) on the right side of the page. Users can click
	       on the checkboxes in the "Slip Rate Site Location" table to select specific sites or 
	       click on sites directly on the map (See Viewing and Downloading Metadata 
	       below for more details). Sites can be removed from the list at the 
	       bottom of the interface by clicking on the trash can icon, or all 
	       sites can be cleared by clicking on the “reset” button near the top
               left of the interface. Note that some of the database locations refer to 
               multiple studies. These are indicated with squares on the map interface.
               Clicking on a square expands the sites to show the individual database sites.</p>

	    <p>The interactive map on the right displays the geographic location of 
	       each database site. In the top right corner of the interactive map, there 
	       is a pull-down menu that allows the basemap to be changed. By default,
	       the basemap shown is
	       <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ESRI Topographic</a>, but
               <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer">ESRI Imagery</a>,
              <a href="http://jawg.io">Jawg Light</a>, <a href="http://jawg.io">Jawg Dark</a>,
              <a href="https://www.openstreetmap.org">OSM Streets Relief</a>,
              <a href="https://opentopomap.org">OTM Topographic</a>,
              <a href="https://www.openstreetmap.org">OSM Street</a>, and
              <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer">ESRI Terrain</a> are also available.</p>

	    <p>The map interface has a small default size, but the map interface can
	       be resized by clicking on the black dashed square icon located in the 
	       bottom right corner of the interface. Three size options are available,
	       small (default), medium, and full-screen. The medium and full-screen 
	       sizes hide some of the tools, so these options are provided for 
	       visualization and data comparison purposes and are not intended to be
               used when querying the model for download.</p>

	    <p><i>To report any bugs or issues, please see the <a href="contact">contact page</a>
               or contact <a href="mailto:software@scec.org">software@scec.org</a>.</i></p>

            <h4><strong>Searching/Querying the Slip Rate Database</strong></h4>

	    <p>The Geologic Slip Rate Database Explorer provides several search criteria,
               including fault name,
	       latitude/longitude, low rate, and high rate. Most database sites do not have 
	       a “preferred” rate, so there is no search by preferred rate option. 
	       Once a search type is selected, additional controls will appear in the form 
	       of text input boxes, or sliders. Note that due to the large range in slip
	       rate values, the low rate and high rate values are colored on a logarithmic
               scale.</p>

	    <p>When performing a latitude/longitude search, there are two search methods.
	       Users can either enter the latitude/longitude values in the text boxes 
	       (bottom left first, followed by top right corners of a bounding rectangle),
	       or simply click and drag on the map to draw a bounding rectangle. In either
	       case, any portion of a database site that lies within the bounding rectangle will
	       appear in the search results at the left side of the interface. These search 
	       results can be added to the download table at the bottom of the interface by
	       clicking on the checkbox next to the site name, or all sites can be added by
               clicking on the checkbox at the top of the search results list.</p>

	    <p>To return to the initial view showing all the faults, click the "RESET" button,
               or reload the page using your browser’s reload button.</p>

            <h4><strong>Downloading and Using Data</strong></h4>

	    <p>Geologic Slip Rate Database metadata files in CSV format are available for
               download from this site. 
	       First, select the desired database sites by clicking on individual circles on the 
	       map, or using the search methods discussed earlier in this guide. Selected 
	       sites are highlighted in red on the map when clicked and key metadata for 
	       the selected site(s) appears in the table at the bottom of the interface. 
	       When available, references for the Geologic Slip Rate Database are provided as 
               clickable hyperlinks 
	       that link directly to the source publications/resources. Click on the 
	       “DOWNLOAD ALL DATA” button to download a CSV file with the complete metadata 
	       (the full 28 columns) for every selected site. CSV files are plain text (ASCII)
               and can also be directly
	       opened by Microsoft Excel, or Google Sheets. For more information about the 
               complete metadata contents, refer to the Geologic Slip Rate Database Zenodo archive.</p>

            <h4><strong>KML/KMZ Uploader</strong></h4>

	    <p>Users can now upload their own spatially registered data in kml/kmz format 
	       for display on the map interface. This is intended to allow users to compare
	       their own data to the Slip Rate Database. The kml/kmz uploader currently supports point/line 
	       data (kml/kmz), image overlays (kmz only), and remote links in kml/kmz file 
	       are not supported. If you discover a kml/kmz file that will not display 
               correctly, please contact us at <a href="mailto:software@scec.org">software@scec.org</a>.</p>

            <h4><strong>Browser Requirements</strong></h4>
	    <p>This site supports the latest versions of
               <a href="https://www.google.com/chrome/">Chrome</a>,
               <a href="https://www.microsoft.com/en-us/windows/microsoft-edge">Microsoft Edge</a>,
               <a href="https://www.mozilla.org/en-US/firefox/">Firefox</a>, and
               <a href="https://www.apple.com/safari/">Safari</a>.</p>

	    <p>More information including a complete model archive can be found at:
               <a href="https://www.scec.org/research/gsrd">https://www.scec.org/research/gsrd</a>.</p>

        </div>
    </div>
</body>
</html>
