<?php
require_once("EGD_SLIPRATE.php");

$egd_sliprate = new SLIPRATE();

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
    print $egd_sliprate->search($type, $criteria)->outputJSON();
} catch (BadFunctionCallException $e) {
    print "egd_sliprate search error";
}
