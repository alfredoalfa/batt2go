<?php
    Header("Access-Control-Allow-Origin: *");
    Header("Access-Control-Allow-Credentials: true");
    Header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
    Header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");


    /*define('DB_HOST', '45.79.217.58');
    define('DB_USER', 'dbadmin');
    define('DB_PASS', 'charge*2019');
    define('DB_NAME', 'Charger');
    define('DB_PORT', '3306');*/

    require 'database.php';


    // Get the posted data.
    $postdata = file_get_contents("php://input");

    if(isset($postdata) && !empty($postdata))
    {
            // Extract the data.
            $request = json_decode($postdata);


            $idclient   = $request->idclient;
            $idbase     = $request->idbase;
            $idalq_batt = $request->idalq_batt;
           
            $dbConnection = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME, DB_PORT);

            mysqli_autocommit($dbConnection, false);

            $flag = true;
            $detaill = "";

             
            $sql1 = "UPDATE Alquiler_baterias SET fecha_devolucion = NOW(), id_base_devuelta = $idbase
            WHERE (id = $idalq_batt)";

            $result = mysqli_query($dbConnection, $sql1);
            if (!$result) {
                $flag = false;
                
                $detaill = "Error details: " . mysqli_error($dbConnection) . "."; 
                
            }

            $sql2 = "UPDATE Bases SET Alquiladas = Alquiladas - 1
            WHERE (id = $idbase)";   

            $result = mysqli_query($dbConnection, $sql2);

            if (!$result) {
                $flag = false;
                
                $detaill = "Error details: " . mysqli_error($dbConnection) . "."; 
                
            }

            if ($flag) {
                mysqli_commit($dbConnection);

                
               $sql = "SELECT A.id_base_alquila, A.id_bateria, A.fecha_alquiler, B.codigo AS cod_base, B.ubicacion AS ubi_base,  B.gracia AS periodo_gracia_base,
                             SYSDATE() As Fecha_Actual, TIMESTAMPDIFF(HOUR,  A.fecha_alquiler, SYSDATE()) AS Horas, 
                             TIMESTAMPDIFF(MINUTE,  A.fecha_alquiler, SYSDATE()) AS Minutos, TIMESTAMPDIFF(SECOND,  A.fecha_alquiler, SYSDATE()) AS Segundos,
                              CASE WHEN TIMESTAMPDIFF(MINUTE,  A.fecha_alquiler, SYSDATE()) > B.gracia THEN  1 ELSE 0 END AS tiempo_cumplido 
                              FROM Alquiler_baterias AS A
                              INNER JOIN Bases AS B ON (B.id = A.id_base_alquila)
                          WHERE	(A.id = $idalq_batt)";
                
                $result = mysqli_query($dbConnection, $sql);

                if ($result){
                  $datos = mysqli_fetch_assoc($result);
                  $tiempo_c =  $datos["tiempo_cumplido"];                
                }
                else
                  $tiempo_c =  -1;
                
                
                $array = [
                    'Exito' => true,
                    'Detalle' => "Todos los querys se ejecutaron satisfactoriamente.",
                    'Tiempo_Cumplido' => $tiempo_c
                    
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