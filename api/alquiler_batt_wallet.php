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
            $idbateria  = $request->idbateria;
            $monto      = $request->monto;
            $idtipopago    = $request->idtipopago;
            $idtransaccion = $request->idtransaccion;
            $cod_batt = $request->codbateria;
            $idmontobatt = $request->idmontobatt;

            //$idtransaccion = null;

            $idalquiler = 0;
           
            $dbConnection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME, DB_PORT);

            mysqli_autocommit($dbConnection, false);

            $flag = true;
            $detaill = "";

            //Insertar tabla Alquiler
            $sql1 = "INSERT INTO Alquiler (id_cliente, id_base, total_alquiler, tipo_pago, id_pago) VALUES
                   ('{$idclient}', '{$idbase}', $monto, $idtipopago, '{$idtransaccion}')";
             
            
            $result = mysqli_query($dbConnection, $sql1);

            if (!$result) {
                $flag = false;
                
                $detaill = "Error details: " . mysqli_error($dbConnection) . "."; 
                                
            }     
                          
            //Insertar tabla Alquiler_baterias
          
           /* $sql2 = "INSERT INTO Alquiler_baterias (id_alquiler, id_cliente, id_base_alquila, id_bateria, codigobatt, precio_alquiler, id_tipo_pago) VALUES             
                     (LAST_INSERT_ID(), '{$idclient}', '{$idbase}', (SELECT id FROM Baterias WHERE codigo = '{$cod_batt}'), '{$cod_batt}', $monto, $idmontobatt)";
                     */

            $sql2 = "INSERT INTO Alquiler_baterias (id_alquiler, id_cliente, id_base_alquila, id_bateria, codigobatt, precio_alquiler, id_tipo_pago, horas) VALUES             
                    ( LAST_INSERT_ID(), '{$idclient}', '{$idbase}', (SELECT id FROM Baterias WHERE codigo = '{$cod_batt}'), '{$cod_batt}', $monto, $idmontobatt,
                      (SELECT tiempo FROM Monto_bateria WHERE id = $idmontobatt)
                    )";
                                                
            $result = mysqli_query($dbConnection, $sql2);

            if (!$result) {
                $flag = false;
                
                $detaill = "Error details: " . mysqli_error($dbConnection) . ".";                                
                
            }
            else{
                $ultimo_id_alquiler_batt = mysqli_insert_id($dbConnection);    
              }
                      
            //Update tabla Wallet
           /* $sql3 = "UPDATE Wallet SET credito = credito - $monto             
            WHERE (idcliente = '{$idclient}')";

            $result = mysqli_query($dbConnection, $sql3);

            if (!$result) {
                $flag = false;
                
                $detaill = "Error details3333: " . mysqli_error($dbConnection) . "."; 
                
            }*/

            //////////////////////////
            //Restar crédito wallet
              //Update tabla Wallet
              $sql5 = "UPDATE Wallet SET credito = credito - $monto             
              WHERE (idcliente = '{$idclient}')";
              
              $result = mysqli_query($dbConnection, $sql5);
              
              if (!$result) {
                  $flag = false;
                  
                  $detaill = "Error details: " . mysqli_error($dbConnection) . "."; 
                  
              }
                                  
              $sql6 = "INSERT INTO Wallet_Detalle (idcliente, credito_actual, monto, tipo_pago, idpago, id_alquiler) 
                      VALUES($idclient, (SELECT (credito + $monto) FROM Wallet WHERE (idcliente = $idclient)), $monto * -1, $idtipopago, '{$idpago}', $ultimo_id_alquiler_batt)";
              
              $result = mysqli_query($dbConnection, $sql6);
              
              if (!$result) {
                  $flag = false;
                  
                  $detaill = "Error details: " . mysqli_error($dbConnection) . "."; 
                  
              }
            ///////////////////////////////
            

            //Update tabla Bases
            $sql4 = "UPDATE Bases SET Alquiladas = Alquiladas + 1           
            WHERE (id = $idbase)";

            $result = mysqli_query($dbConnection, $sql4);

            if (!$result) {
                $flag = false;
                
                $detaill = "Error details: " . mysqli_error($dbConnection) . ".";                                 
            }
            
            if ($flag) {
                mysqli_commit($dbConnection);
                
                $array = [
                    'Exito' => true,
                    'Detalle' => "Todos los querys se ejecutaron satisfactoriamente. Bateria: " . $cod_batt, 
                   // 'IdTransaction' => $idalquiler
                ];

                echo json_encode($array);
            } else {
                mysqli_rollback($dbConnection);
               
                $array = [
                    'Exito' => false,
                    //'Detalle' => $detaill . ".  Rollback transaction",                   
                    'Detalle' => $detaill                    
                ];
                echo json_encode($array);
            } 
            
            mysqli_close($dbConnection);


    }//Fin if(isset($postdata) && !empty($postdata))
?>