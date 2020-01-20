<?php

Header("Access-Control-Allow-Origin: *");
Header("Access-Control-Allow-Credentials: true");
Header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
Header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require 'database.php';

// Get the posted data.
$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata))
{
  // Extract the data.
  $request = json_decode($postdata);


 $idclient   = $request->idclient;
 $idbase     = $request->idbase;
 $idalq_batt = $request->idalq_batt;
 
 /*$array = [
	'idclient' => $idclient,
    'idbase' => $idbase,   
    'venta' => $ttalventa
  ];

 echo json_encode($array);
*/
 
 
 //Esto es lo que funciona
 $sql = "UPDATE Alquiler_baterias SET fecha_devolucion = NOW(), id_base_devuelta = $idbase
 WHERE (id = $idalq_batt)";

 $sql1 = "UPDATE Bases SET Alquiladas = Alquiladas - 1
 WHERE (id = $idbase)";   
 
 echo putAlquiler($sql, $sql1, ""); 
  
}//Fin PHP

?>