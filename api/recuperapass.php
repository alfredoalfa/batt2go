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
         
            $idcliente  = $request->idcliente;                        
                        
            $dbConnection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME, DB_PORT);

            mysqli_autocommit($dbConnection, false);

            $flag = true;
            $detaill = "";

            //Insertar tabla Clientes
            $sql = "UPDATE Recupera_Pass SET status = 0
                    WHERE (idcliente = $idcliente) AND (status = 1)";
                         
            $result = mysqli_query($dbConnection, $sql);

            if (!$result) {
                $flag = false;
                
                $detaill = "Error details: " . mysqli_error($dbConnection) . ". " . $sql; 
                                
            }     
                          
            //Aceptar terminos y condiciones
            $sql = "INSERT INTO Recupera_Pass (idcliente) VALUES($idcliente)";
         
                                                
            $result = mysqli_query($dbConnection, $sql);

            if (!$result) {
                $flag = false;
                
                $detaill = "Error details: " . mysqli_error($dbConnection) . ". " . $sql;                                
                
            }
            
                                   
            if ($flag) {
                mysqli_commit($dbConnection);
                
                $array = [
                    'Exito' => true,
                    'Detalle' => "Todos los querys se ejecutaron satisfactoriamente.", 
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