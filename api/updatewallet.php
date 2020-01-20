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

            $opcion   = $request->opcion;
            $idclient = $request->idclient;            
            $monto    = $request->monto;
            $tipopago = $request->tipopago;
            $idpago   = $request->idpago;
            $escupon  = $request->escupon;
            $idtdc    = $request->idtdc;
            $idbatt   = $request->idbatt;
            
            
            $dbConnection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME, DB_PORT);

            mysqli_autocommit($dbConnection, false);

           
            if(!($opcion == "")){	
                    $flag = true;
                    $detaill = "";
                    if($opcion == 1){	
                        //Nuevo crédito wallet
                        $sql = "INSERT INTO Wallet (idcliente, credito) VALUES
                        ('{$idclient}', $monto)";
                        
                        $result = mysqli_query($dbConnection, $sql);

                        if (!$result) {
                            $flag = false;
                            
                            $detaill = "Error details: " . mysqli_error($dbConnection) . "."; 
                            
                        }   
                    }
                    else
                    if($opcion == 2){
                        //Aumentar crédito wallet
                        //Update tabla Wallet
                        $sql = "UPDATE Wallet SET credito = credito + $monto             
                        WHERE (idcliente = '{$idclient}')";
                        
                        $result = mysqli_query($dbConnection, $sql);
                       
                        if (!$result) {
                            $flag = false;
                            
                            $detaill = "Error details: " . mysqli_error($dbConnection) . "."; 
                            
                        }
                        
                        //Esto es para trajar con stripe/authorize (funciona)
                        $sql = "INSERT INTO Wallet_Detalle (idcliente, credito_actual, monto, tipo_pago, idpago, id_tarjeta) 
                                VALUES($idclient, (SELECT (credito - $monto) FROM Wallet WHERE (idcliente = $idclient)), $monto, $tipopago, '{$idpago}', '{$idtdc}')";
                        
                                
                        $result = mysqli_query($dbConnection, $sql);
                       
                        if (!$result) {
                            $flag = false;
                            
                            $detaill = "Error details: " . mysqli_error($dbConnection) . "."; 
                            
                        }

                        /////////////////////////////////
                        //Si la recarga viene de un cupón                        
                        if($escupon == 1){
                             //Update tabla Cupones            
                            $sql = "UPDATE Cupones SET usados = usados + 1
                            WHERE (numero = '{$idpago}')";
                                
                            $result = mysqli_query($dbConnection, $sql);

                            if (!$result) {
                                $flag = false;

                                $detaill = "Error details: " . mysqli_error($dbConnection) . "."; 

                            }
                        }//Fin if(!$cupon === "")
                        //Fin Si la recarga viene de un cupón
                        //////////////////////////////////

                    }	
                    else
                    if($opcion == 3){
                        //Restar crédito wallet
                        //Update tabla Wallet
                        $sql = "UPDATE Wallet SET credito = credito - $monto             
                        WHERE (idcliente = '{$idclient}')";
                        
                        $result = mysqli_query($dbConnection, $sql);
                        

                        if (!$result) {
                            $flag = false;
                            
                            $detaill = "Error details: " . mysqli_error($dbConnection) . "."; 
                            
                        }
                                            
                        $sql = "INSERT INTO Wallet_Detalle (idcliente, credito_actual, monto, tipo_pago, idpago, id_alquiler) 
                                VALUES($idclient, (SELECT (credito + $monto) FROM Wallet WHERE (idcliente = $idclient)), $monto * -1, $tipopago, '{$idpago}', $idbatt)";
                        
                        $result = mysqli_query($dbConnection, $sql);
                        

                        if (!$result) {
                            $flag = false;
                            
                            $detaill = "Error details: " . mysqli_error($dbConnection) . "."; 
                            
                        }
                    
                    }//Fin Opción 3
                    
                    
                    if ($flag) {
                        mysqli_commit($dbConnection);
                        
                        $array = [
                            'Exito' => true,
                            'Detalle' =>  "Todos los querys se ejecutaron satisfactoriamente."
                        ];

                        echo json_encode($array);
                    } else {
                        mysqli_rollback($dbConnection);
                    
                        $array = [
                            'Exito' => false,
                            'Detalle' => $detaill . ".  Rollback transaction",
                            'Detalle2' => $sql                    
                        ];
                        echo json_encode($array);
                    } 
            }//Fin if(!($opcion == ""))
            
            mysqli_close($dbConnection);


    }//Fin if(isset($postdata) && !empty($postdata))
?>