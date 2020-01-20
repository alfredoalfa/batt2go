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


 $nro_tarj = $request->tarjeta;
 $codigo1  = $request->codigo1;
 $codigo2  = $request->codigo2;
 $cod_seg  = $request->cod_seg;
 $idcliente = $request->idcliente;
 $primarytdc = $request->primarytdc;
 $namecli = $request->namecli;
 $lastnamecli = $request->lastnamecli;
 $zipcodecli = $request->zipcodecli;
  
  /*$sql = "INSERT INTO tarjetas_clientes (id_cliente, nro_tarjeta, codigo1, codigo2, codigo_seguridad, principal) VALUES
        ('{$idcliente}', '{$nro_tarj}', '{$codigo1}', '{$codigo2}', '{$cod_seg}', $primarytdc)";
    
  echo putSQL($sql);
  */

  $flag = true;
  $detaill = "";
  $dbConnection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME, DB_PORT);

  mysqli_autocommit($dbConnection, false);

  if($primarytdc){
    $sql = "UPDATE tarjetas_clientes SET principal = 0
    WHERE id_cliente = $idcliente";

                    
    $result = mysqli_query($dbConnection, $sql);
        

    if (!$result) {
        $flag = false;
            
        $detaill = "Error details: " . mysqli_error($dbConnection) . "."; 
            
    }
  }

  $sql = "INSERT INTO tarjetas_clientes (id_cliente, nro_tarjeta, codigo1, codigo2, codigo_seguridad, principal, nombre, apellido, zipcode) 
          VALUES ('{$idcliente}', '{$nro_tarj}', '{$codigo1}', '{$codigo2}', '{$cod_seg}', $primarytdc, 
                  '{$namecli}', '{$lastnamecli}', '{$zipcodecli}')";
                        
  $result = mysqli_query($dbConnection, $sql);
  
  if (!$result) {
      $flag = false;
      
      $detaill = "Error details: " . mysqli_error($dbConnection) . "."; 
      
  }
  else{
    $ultimo_id = mysqli_insert_id($dbConnection);    
  }


  if ($flag) {
    mysqli_commit($dbConnection);
    
    $array = [
        'Exito' => true,
        'Id_Tdc' => $ultimo_id,
        'Detalle' =>  "Todos los querys se ejecutaron satisfactoriamente. 6666666",                                                         
    ];
      echo json_encode($array);
  } 
  else {
        mysqli_rollback($dbConnection);
    
        $array = [
            'Exito' => false,
            'Detalle' => $detaill . ".  Rollback transaction",
            'Detalle2' => $sql                    
        ];
        echo json_encode($array);
  }
  
/*$array = [
	'email' => $sql,
	'pass'  => "",	
  ];

  echo json_encode($array);
  */

}//Fin PHP


?>