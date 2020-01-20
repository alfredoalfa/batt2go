<?php
   /* Header("Access-Control-Allow-Origin: *");
    Header("Access-Control-Allow-Credentials: true");
    Header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
    Header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");*/


    require 'database.php';


    // Get the posted data.
    $postdata = file_get_contents("php://input");

    if(isset($postdata) && !empty($postdata))
    {
            // Extract the data.
            $request = json_decode($postdata);


            $idclient   = $request->idclient;                        
            $monto      = $request->monto;            
            $idtransaccion = $request->idtransaccion;
            //$idtransaccion = null;
                       
            $dbConnection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME, DB_PORT);

            mysqli_autocommit($dbConnection, false);

            $flag = true;
            $detaill = "";

            //Update tabla Wallet
            $sql1 = "UPDATE Wallet SET credito = credito - $monto             
            WHERE (idcliente = '{$idclient}')";

            $result = mysqli_query($dbConnection, $sql1);

            if (!$result) {
                $flag = false;
                
                $detaill = "Error details: " . mysqli_error($dbConnection) . "."; 
                
            }
            else{
                //mysql_affected_rows()

                $array = [
                    'sql' =>  mysql_affected_rows()
                    //'pass' => $email,	
                ];

                echo json_encode($array);

                //Insertar tabla Alquiler
                /*$sql1 = "INSERT INTO Wallet (id_cliente, credito) VALUES
                ('{$idclient}', $monto)";
           
                $result = mysqli_query($dbConnection, $sql1);

                if (!$result) {
                    $flag = false;
                    
                    $detaill = "Error details: " . mysqli_error($dbConnection) . "."; 
                    
                }*/

            }//fin else INSERT INTO Wallet

                        
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