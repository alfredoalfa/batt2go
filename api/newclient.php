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
            $nombre   = $request->nombre;
            $apellido = $request->apellido;
            $docid    = $request->docid;
            $telf     = $request->telf;
            $ref      = $request->ref;
            $pass     = $request->pass;
            $activo   = 1;

            
                        
            $dbConnection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME, DB_PORT);

            mysqli_autocommit($dbConnection, false);

            $flag = true;
            $detaill = "";

            //Insertar tabla Clientes
            $sql = "INSERT INTO Clientes (email, nombre, apellido, doc_id, telefono, password) VALUES
                   ('{$email}', '{$nombre}', '{$apellido}', '{$docid}', '{$telf}', '{$pass}')";
                         
            $result = mysqli_query($dbConnection, $sql);

            if (!$result) {
                $flag = false;
                
                $detaill = "Error details: " . mysqli_error($dbConnection) . ". " . $sql; 
                                
            }     
                          
            //Aceptar terminos y condiciones
            $sql = "INSERT INTO TerminosAndCondicionesByCliente (idcliente) VALUES             
                     (LAST_INSERT_ID())";
                                                
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