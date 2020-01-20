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

 $orden      = $request->orden;
 $idclient   = $request->idclient;
 
 /*$array = [
	'idclient' => $idclient,
    'idbase' => $idbase,   
    'venta' => $ttalventa
  ];

 echo json_encode($array);
*/
 
 
 //Cambio clave
 if($orden == 1){	
    $email = $request->email;
    $oldpass  = $request->oldpass;
    $newpass  = $request->newpass;

    $sql = "UPDATE Clientes SET password = $newpass
    WHERE email = '{$email}' AND password = '{$oldpass}'"; 
 }
 
 echo putSQL($sql);
 
/*$array = [
	  'sql' => $sql
    
  ];

 echo json_encode($array);*/

  
}//Fin PHP

?>