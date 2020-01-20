<?php

  Header("Access-Control-Allow-Origin: *");
  Header("Access-Control-Allow-Credentials: true");
  Header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
  Header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

  //Casa
  //require_once('/home/acortesia/Proyectos/App_ionic/api_php_stripe/stripe-php-6.43.0/init.php');
  //Oficina
  //require_once('/home/acortesia/Proyectos_Local/Apps_Ionic/api_php_stripe/stripe-php-6.43.0/init.php');
  //Server en la nube
  //require_once('/var/www/html/api/stripe-php-6.43.0//init.php');
  

  require_once('/home/acortesia/Proyectos_Local/Apps_Ionic/stripe-php-6.43.0//init.php');
    
  //Lecuna
  \Stripe\Stripe::setApiKey('sk_test_AfZS9XDVX8bUyPBwcQ1H0c2S00rDx2wHW9');
  
    
  //Si no se cuenta con certificado SSL poner falso la siguiente variable
  \Stripe\Stripe::setVerifySslCerts(false);

  // Get the posted data.
  $postdata = file_get_contents("php://input");


  $request = json_decode($postdata);
  
  $token = $request->token;
 
  $amount = $request->amount;
  $currency = $request->currency;
  $descrip = $request->descrip;

  // Realizar el cargo.
  $charge = \Stripe\Charge::create(
        array(
            'amount' => $amount,
            'currency' => $currency,
            'source' => $token,
            'description' => $descrip            
        )
  );
  
  echo json_encode($charge);
  
  /*$array = [
  	'token' => $token,
    'descrip' => "stripepayment"
    
  ];

 echo json_encode($array);
*/
?>