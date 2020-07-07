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

            $idalquiler = 0;
           
            $dbConnection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME, DB_PORT);

            mysqli_autocommit($dbConnection, false);

            $flag = true;
            $detaill = "";

            
            $sql1 = "INSERT INTO Alquiler (id_cliente, id_base, total_alquiler, tipo_pago, id_pago) VALUES
                   ('{$idclient}', '{$idbase}', $monto, $idtipopago, '{$idtransaccion}')";
             
            
            $result = mysqli_query($dbConnection, $sql1);

            if (!$result) {
                $flag = false;
                
                $detaill = "Error details: " . mysqli_error($dbConnection) . "."; 
                
            }     
                                          
            
            $sql2 = "INSERT INTO Alquiler_baterias (id_alquiler, id_cliente, id_base_alquila, id_bateria, precio_alquiler) VALUES             
            (LAST_INSERT_ID(), '{$idclient}', '{$idbase}', '{$idbateria}', $monto)";

            $result = mysqli_query($dbConnection, $sql2);

            if (!$result) {
                $flag = false;
                
                $detaill = "Error details: " . mysqli_error($dbConnection) . "."; 
                
            }

            
            $sql3 = "UPDATE Bases SET Alquiladas = Alquiladas + 1           
            WHERE (id = $idbase)";

            $result = mysqli_query($dbConnection, $sql3);

            if (!$result) {
                $flag = false;
                
                $detaill = "Error details: " . mysqli_error($dbConnection) . "."; 
                
            }


            if ($flag) {
                mysqli_commit($dbConnection);
                
                $array = [
                    'Exito' => true,
                    'Detalle' => "Todos los querys se ejecutaron satisfactoriamente.", 
                    'IdTransaction' => $idalquiler
                ];

                echo json_encode($array);
            } else {
                mysqli_rollback($dbConnection);
               
                $array = [
                    'Exito' => false,
                    'Detalle' => $detaill . ".  Rollback transaction"                    
                ];
                echo json_encode($array);
            } 
            
            mysqli_close($dbConnection);


    }//Fin if(isset($postdata) && !empty($postdata))
?>
