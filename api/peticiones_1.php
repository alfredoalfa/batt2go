<?php 


//Header('Access-Control-Allow-Origin: *');
Header("Access-Control-Allow-Origin: *");
Header("Access-Control-Allow-Credentials: true");
Header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
Header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

//include 'funciones.php';

require 'database.php'; 

$opcion = $_GET["opcion"];
$codigo = $_GET["codigo"];
$idcliente = $_GET["idcliente"];
$idbase = $_GET["idbase"];
$email = $_GET["email"];
$status = $_GET["status"];
$cupon = $_GET["cupon"];
$tarjeta = $_GET["tarjeta"];
$searchbase = $_GET["searchbase"];


//Buscar bases activas y detalles
if($opcion == 1){	
		
	$sql = "SELECT id, codigo, ubicacion, capacidad, (capacidad - alquiladas) AS disponibles, alquiladas AS retornables, latitud, longitud, activo, CASE WHEN direccion IS NULL THEN 'HOLA' ELSE direccion END AS direccion, CASE WHEN zipcode IS NULL THEN 'HOLA2' ELSE zipcode END AS zipcode, estatus AS status FROM Bases
	WHERE (((estatus = $status) OR ($status = -1)) AND (NOT (latitud IS NULL)  AND NOT (longitud IS NULL)))  
	ORDER BY id";
	
	echo getSQL($sql);	
}
else
if($opcion == 2){	
	//Obtener sólo las bases activas.
	$sql = "SELECT id, codigo, ubicacion, latitud, longitud FROM Bases
			WHERE (activo = $status) OR ($status = -1)  
			ORDER BY id";
			
	echo getSQL($sql);

	
}
else
if($opcion == 3){	
	//Buscar una base específica
	$sql = "SELECT id, estatus, codigo, ubicacion, latitud, longitud, (capacidad - alquiladas) AS disponibles, alquiladas AS retornables FROM Bases
			WHERE (codigo = '{$codigo}')";
			
	echo getSQL($sql);

}
else
if($opcion == 4){
	//Buscar baterías alquiladas por cliente
	
	$sql = "SELECT  A.id_cliente, A.id AS idAlquiler, A.id_base,  AB.id AS idalquilada, AB.id_bateria, B.codigo, AB.fecha_alquiler 
			FROM Alquiler AS A, Alquiler_baterias AS AB, Baterias As B
			WHERE (A.id_cliente = '{$idcliente}') AND (A.id = AB.id_alquiler) AND (fecha_devolucion IS NULL) AND (AB.id_bateria = B.id)
			ORDER BY AB.fecha_alquiler";
	
	echo getSQL($sql);			
	
}
else
if($opcion == 5){
	//Baterías disponibles por base
	$sql = "SELECT id AS id_bateria, codigo, precio, carga FROM Baterias 
			WHERE (id_base = $idbase) AND
			id NOT IN (
						SELECT  ab.id_bateria FROM Bases AS a
						INNER JOIN Alquiler AS aq ON (aq.id_base = a.id) 
						INNER JOIN Alquiler_baterias AS ab ON (ab.id_alquiler = aq.id) AND (ab.fecha_devolucion IS NULL)
						WHERE (a.id = $idbase)
					)";
	echo getSQL($sql);				
	
}
else
if($opcion == 6){
	//Proxima batería disponible por base
	$sql = "SELECT id AS id_bateria, codigo, precio, carga, slot FROM Baterias 
			WHERE (id_base = $idbase) AND (estatus = 1) AND (carga = 4) 			
			LIMIT 1";
	
	echo getSQL($sql);				
	/*$array = [
		'sql' => $sql
	  ];
	
	
	  echo json_encode($array);*/
	
}
else
if($opcion == 7){	
	//Obtener cliente by email.
	$sql = "SELECT id, nombre, apellido, doc_id, telefono FROM Clientes
			WHERE email = '{$email}'";

	echo getSQL($sql);

	/*$array = [
	'sql' => $sql,
	'pass' => $email,	
  ];
  echo json_encode($array);*/
}
else
if($opcion == 8){
	//Obtener historial cliente
			
			
	$sql = "SELECT  W.idcliente, W.credito AS disponibilidad, WD.credito_actual AS disponibilidad_anterior, 
	                WD.credito_actual + WD.monto AS midisponibilidad,					
	                WD.monto, WD.tipo_pago, TP.descripcion AS descripcion, WD.id_tarjeta, 
					CONCAT('****-****-****-', RIGHT(TC.nro_tarjeta, 4)) AS tarjeta,
					CASE LEFT(TC.nro_tarjeta, 1) WHEN 4 THEN 'vISA' ELSE CASE LEFT(TC.nro_tarjeta, 1)  WHEN 5 THEN 'Master' ELSE '' END END AS tipotarjeta,
					WD.id_alquiler AS id_alquiler_bateria, AB.codigobatt, AB.id_base_alquila, AB.id_base_devuelta,
					DATE_FORMAT(AB.fecha_alquiler, '%m/%d/%Y %h:%i:%s %p') AS fechaalquiler, 
					AB.horas,
					AB.horas, DATE_FORMAT(ADDDATE(fecha_alquiler,  INTERVAL '1' HOUR), '%m/%d/%Y %h:%i:%s %p') AS deberetornar,
					DATE_FORMAT(ADDDATE(ADDDATE(fecha_alquiler,  INTERVAL '1' HOUR),  INTERVAL '1' HOUR), '%m/%d/%Y %h:%i:%s %p') AS deberetornartimeextender,
					DATE_FORMAT(AB.fecha_devolucion, '%m/%d/%Y %h:%i:%s %p') AS fechadevolucion,
					(SELECT direccion FROM Bases WHERE id = AB.id_base_alquila) AS direccion_alquiler,
					(SELECT ubicacion FROM Bases WHERE id = AB.id_base_alquila) AS ubicacion_alquiler,
					(SELECT direccion FROM Bases WHERE id = AB.id_base_devuelta) AS direccion_devolucion,
					(SELECT ubicacion FROM Bases WHERE id = AB.id_base_devuelta) AS ubicacion_devolucion,										
					(SELECT tax FROM Bases  AS A
			         INNER JOIN Estados AS E ON A.id_estado = E.id 
				     WHERE A.id	= AB.id_base_alquila) AS tax,
					DATE_FORMAT(ADDDATE(fecha_alquiler,  INTERVAL '48' HOUR), '%m/%d/%Y %h:%i:%s %p') AS  fechapurchased,					
					DATE_FORMAT(WD.fecha, '%m/%d/%Y %h:%i:%s %p') AS fecha
					
			FROM Wallet AS W
			INNER JOIN Wallet_Detalle AS WD ON (WD.idcliente = W.idcliente)
			INNER JOIN Tipo_pago AS TP ON (TP.id = WD.tipo_pago)
			LEFT JOIN Alquiler_baterias AS AB ON (AB.id_cliente = WD.idcliente) AND (AB.id = WD.id_alquiler)			
			LEFT JOIN tarjetas_clientes AS TC ON (TC.id_cliente = WD.idcliente) AND (TC.id = WD.id_tarjeta)
			WHERE (W.idcliente  = $idcliente) --  AND (WD.tipo_pago = 2)
			ORDER BY WD.fecha DESC";
					
					
	echo getSQL($sql);		
	/*$array = [
		'sql' => $sql,
		'pass' => "dddd" + $idcliente,	
	  ];		
	  echo json_encode($array);*/

}//Fin opción 8
else
if($opcion == 9){
	//Buscar los distintos tipos de pagos activos
	$sql = "SELECT id, descripcion FROM Tipo_pago
			WHERE activo = 1";

	echo getSQL($sql);

}//Fin opción 9
else
if($opcion == 10){
	//Buscar crédito del client en el wallet
	$sql = "SELECT credito FROM Wallet
			WHERE idcliente = '{$idcliente}'";

	echo getSQL($sql);

}//Fin opción 10
else
if($opcion == 11){
	//Buscar los tipos de wallet por defecto a recargar
	$sql = "SELECT id, monto FROM Wallet_Default
			ORDER BY id";

	echo getSQL($sql);

}//Fin opción 11
else
if($opcion == 12){
	//Buscar los montos por hora por batería.
	$sql = "SELECT id, tiempo, monto, CONCAT(tiempo, ' Hours ', '$', monto) AS descripcion FROM Monto_bateria
	        WHERE  (id_base = $idbase)";

	echo getSQL($sql);
	

}//Fin opción 12
else
if($opcion == 13){
	//Buscar las tarjetas asociadas al cliente.
	$sql = "SELECT  id, nro_tarjeta, codigo1, codigo2, codigo_seguridad, principal, nombre, apellido, zipcode FROM tarjetas_clientes
		  WHERE id_cliente = '{$idcliente}'
		  ORDER by principal DESC";

	echo getSQL($sql);
	

}//Fin opción 13
else
if($opcion == 14){
	$sql = "SELECT WD.credito_actual + WD.monto AS credito_disponible, WD.credito_actual AS credito_anterior, WD.monto, WD.tipo_pago, WD.idpago, WD.fecha FROM Wallet AS W
			INNER JOIN Wallet_Detalle AS WD ON WD.idcliente = W.idcliente
			WHERE W.idcliente =  $idcliente";

    echo getSQL($sql);		
}//Fin Opción 14
else
if($opcion == 15){
    //Buscar toda la data del cupón.
	$sql = "SELECT numero, valor, cantidad, usados,  participacion_desde, participacion_hasta, estado,
			CASE WHEN  ((CAST(Now() AS DATE) >= CAST(participacion_desde AS DATE)) AND (CAST(Now() AS DATE) <= CAST(participacion_hasta AS DATE)) ) THEN 1 ELSE 0 END AS periodovalido,
			CASE WHEN usados < cantidad THEN 0 ELSE 1 END  AS limitemax
			FROM Cupones
			WHERE (numero = '{$cupon}')";
		
	echo getSQL($sql);		
}//if($opcion == 15)
else
if($opcion == 16){
	//Verificar si cliente ha usado el cupón
	$sql = "SELECT id, monto, fecha FROM Wallet_Detalle
			WHERE (idpago = '{$cupon}') AND (idcliente = $idcliente)";

	echo getSQL($sql);				
}
else
if($opcion == 17){
	//Obtener la credit card principal del cliente
	$sql = "SELECT nro_tarjeta, codigo1, codigo2, codigo_seguridad, nombre, apellido, zipcode FROM tarjetas_clientes
			WHERE (id_cliente = $idcliente) AND (activo = 1) AND (principal =1)";

	echo getSQL($sql);				

}
else
if($opcion == 18){
	//Buscar tarjeta de crédito por nro y cliente
	$sql = "SELECT id, nro_tarjeta, codigo1, codigo2, codigo_seguridad, principal, nombre, apellido, zipcode FROM tarjetas_clientes
			WHERE (id_cliente = $idcliente) AND (nro_tarjeta = '{$tarjeta}')";

	echo getSQL($sql);				

	/*$array = [
		'sql' => $sql		
	  ];		
	  echo json_encode($array);*/

}//Fin ($opcion == 18)
else
if($opcion == 19){
	//Verificar si la tarjeta está asignada a algún cliente
	$sql = "SELECT id, id_cliente FROM tarjetas_clientes
			WHERE (nro_tarjeta = '{$tarjeta}')";

	echo getSQL($sql);				

	/*$array = [
		'sql' => $sql		
	  ];		
	  echo json_encode($array);*/

}//Fin ($opcion == 19)
else
if($opcion == 20){	
	//Buscar una base específica, según su zipcode, ubicacion o direccion
	$sql = "SELECT id, estatus, codigo, ubicacion, latitud, longitud, (capacidad - alquiladas) AS disponibles, alquiladas AS retornables FROM Bases
			WHERE (ubicacion LIKE CONCAT('%' , '{$searchbase}', '%'))  OR (direccion LIKE CONCAT('%' , '{$searchbase}', '%')) OR (zipcode LIKE CONCAT( '%' , '{$searchbase}', '%'))";
			
			
	echo getSQL($sql);
	
	/*$array = [
		'sql' => $sql		
	  ];		
	  echo json_encode($array);*/
}

?>