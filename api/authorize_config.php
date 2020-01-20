<?php 

Header("Access-Control-Allow-Origin: *");
Header("Access-Control-Allow-Credentials: true");
Header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
Header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");


// Product Details 
//$itemName = "Demo Product";  
//$itemNumber = "PN12345";  
//$itemPrice = 30;  

$currency = "USD";  
 
// Authorize.Net API configuration  
define('ANET_API_LOGIN_ID', '4DV5Z87xfxEe');  
define('ANET_TRANSACTION_KEY', '8qZ82Q2ZkU8g5udT');  
$ANET_ENV = 'SANDBOX'; // or PRODUCTION 

// Authorize.Net API configuration  
/*define('ANET_API_LOGIN_ID', '9qHr846SA');
define('ANET_TRANSACTION_KEY', '5MsT4bfD357j25U4');
$ANET_ENV = 'PRODUCTION'; //'SANDBOX' or PRODUCTION 
*/


////////////////////////////////////
//En el server
/*// Authorize.Net API configuration  
//define('ANET_API_LOGIN_ID', '4DV5Z87xfxEe');  
define('ANET_API_LOGIN_ID', '9qHr846SA');
//define('ANET_TRANSACTION_KEY', '8qZ82Q2ZkU8g5udT');  
define('ANET_TRANSACTION_KEY', '5MsT4bfD357j25U4');
$ANET_ENV = 'PRODUCTION';//'SANDBOX'; // or PRODUCTION 
*/
/////////////////////////////////////
  

?>