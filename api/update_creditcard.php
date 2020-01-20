<?php
  //Header('Access-Control-Allow-Origin: *');
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
            
            $idtarj   = $request->id;            
            $yearcc     = $request->year;
            $monthcc     = $request->month;
            $cvv   = $request->cvv;
            $nrotarj  = $request->nrotarj;
            $primarytdc = $request->primarytdc;
            $idcliente = $request->idcliente;
            $namecli = $request->namecli;
            $lastnamecli = $request->lastnamecli;
            $zipcodecli = $request->zipcodecli;
 
                        
            $dbConnection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME, DB_PORT);

            mysqli_autocommit($dbConnection, false);

            $flag = true;
            $detaill = "";
           
            if(!($idtarj == "")){	
                   
                    //Si es principal poner el resto como no principal
                    if($primarytdc){
                            $sql = "UPDATE tarjetas_clientes SET principal = 0
                            WHERE id_cliente = $idcliente";
                    
                                            
                            $result = mysqli_query($dbConnection, $sql);
                                

                            if (!$result) {
                                $flag = false;
                                    
                                $detaill = "Error details: " . mysqli_error($dbConnection) . "."; 
                                    
                            }
                    }
                                        
                                                            
                    $sql = "UPDATE tarjetas_clientes SET nro_tarjeta = '{$nrotarj}', codigo1 = '{$yearcc}', 
                                    codigo2 = '{$monthcc}', codigo_seguridad = '{$cvv}', principal = $primarytdc,
                                    nombre = '{$namecli}', apellido = '{$lastnamecli}', zipcode = '{$zipcodecli}'
                            WHERE id = $idtarj";
                     
                                            
                    $result = mysqli_query($dbConnection, $sql);
                        

                    if (!$result) {
                        $flag = false;
                            
                        $detaill = "Error details: " . mysqli_error($dbConnection) . "."; 
                            
                    }
                    
                    
                    if ($flag) {
                        mysqli_commit($dbConnection);
                        
                        $array = [
                            'Exito' => true,
                            'Detalle' =>  "Todos los querys se ejecutaron satisfactoriamente.",                                                         
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