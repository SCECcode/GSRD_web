<?php
require_once("GSRD_SLIPRATE.php");

$gsrd_sliprate = new SLIPRATE();

$type = $_REQUEST["t"];
$criteria = json_decode($_REQUEST["q"]);

//$type = 'faultname';
//$criteria = array();
//array_push($criteria, 'Almanor');

if (is_object($criteria[0])) {
     $criteria = (array)$criteria[0];
}

//print_r($criteria);exit;

try {
    print $gsrd_sliprate->search($type, $criteria)->outputJSON();
} catch (BadFunctionCallException $e) {
    print "gsrd_sliprate search error";
}
