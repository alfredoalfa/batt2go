<?php 
	Header("Access-Control-Allow-Origin: *");
	Header("Access-Control-Allow-Credentials: true");
	Header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
	Header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

   //exec("/home/acortesia/Proyectos_Local/Apps_Ionic/prueba.php");

  // echo("Prueba");

   $array = [
	'sql' => "dasdasdasdasdasd",
	'pass' => "3333333",	
   ];


    echo json_encode($array);


?>