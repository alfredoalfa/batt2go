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


 $email    = $request->email;
 $pass     = $request->password;
 
  
  // Create.
  //WHERE email = '{$email}' AND password = '{$pass}'";       
 $sql = "SELECT id, nombre, apellido, telefono, email FROM Clientes         
         WHERE email = '{$email}' AND password = '{$pass}'"; 
  
  echo getSQL($sql);
  //echo("Prueba");

  
}//Fin PHP

?>