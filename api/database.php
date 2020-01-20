<?php 

define('DB_HOST', '45.79.217.58');
define('DB_USER', 'dbadmin');
define('DB_PASS', 'charge*2019');
define('DB_NAME', 'Charger');
define('DB_PORT', '3306');

function conecta_bd()
{
  $connect = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME, DB_PORT);

  if (mysqli_connect_errno($connect)) {
    die("Failed to connect:" . mysqli_connect_error());
  }

  mysqli_set_charset($connect, "utf8");

  return $connect;
}



//////////////////////
 
function getSQL($sql){
	//$res;
	
	$conn	=	conecta_bd();
	$rs = mysqli_query($conn, $sql);
	$array = array();
	if ($rs) {
		$array = array();
		
		while ($fila = mysqli_fetch_assoc($rs)) {	
			$array[] = array_map('utf8_encode', $fila);
		}
		$res = json_encode($array, JSON_NUMERIC_CHECK);
	}else{
		$res = null;
		echo mysqli_error($conn);
	}
	mysqli_close($conn);
	return $res;
}
 
function putSQL($sql){
	$res;
	$conn	=	conecta_bd();
	$rs = mysqli_query($conn, $sql);
	if ($rs) {
		$array = true;
		$res = json_encode($array, JSON_NUMERIC_CHECK);
	}else{
		$array = false;
		$res = json_encode($array, JSON_NUMERIC_CHECK);
		echo mysqli_error($conn);
	}
	mysqli_close($conn);
	return $res;
}


function putAlquiler($sql, $sql1, $sql2){
  		 
    $conex	=	conecta_bd();
	
	$conex->autocommit(false);
	
	try {
		//$conex->beginTransaction('MYSQLI_TRANS_START_READ_ONLY');

			if(!empty($sql)){
				$conex->query($sql);
			}

			if(!empty($sql1)){
				$conex->query($sql1);
			}

			if(!empty($sql2)){
				$conex->query($sql2);
			}
			
			$conex->commit();
		
			$array = [
				'Ok' => true,
				'Error' => null	
				
			];
			echo json_encode($array);
	} catch (Exception $e) {
		$conex->rollback();
		$array = [
			'Ok' => false,
			'Error' => $e->getMessage()
		  ];
		//echo 'Something fails: ',  $e->getMessage(), "\n";
		echo json_encode($array);
	}
 
}//Fin putAlquiler

 

?>
