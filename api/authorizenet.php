<?php 
Header("Access-Control-Allow-Origin: *");
Header("Access-Control-Allow-Credentials: true");
Header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
Header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");


// Include Authorize.Net PHP sdk 
//require_once('/home/carlos/cochero//authorizenet_sdk_php/sdk-php-master/autoload.php');
//require_once('/home/acortesia/Proyectos_Local/Apps_Ionic/autorizenet/sdk-php-master/autoload.php');
require_once('//home/acortesia/Proyectos/App_ionic/Authorizetnet/sdk-php-master/autoload.php');

// Include configuration file  
require_once ('authorize_config.php'); 


use net\authorize\api\contract\v1 as AnetAPI; 
use net\authorize\api\controller as AnetController; 
 
 
$paymentID = $statusMsg = ''; 
$ordStatus = 'error'; 
$responseArr = array(1 => 'Approved', 2 => 'Declined', 3 => 'Error', 4 => 'Held for Review'); 

 // Get the posted data.
 $postdata = file_get_contents("php://input");

 
 if(isset($postdata) && !empty($postdata))
 {
     // Extract the data.
     $request = json_decode($postdata);

    
     $name = $request->name; 
     $email = $request->email; 
     $card_number = preg_replace('/\s+/', '', $request->card_number); 
     $card_exp_month = $request->card_exp_month; 
     $card_exp_year = $request->card_exp_year; 
     $card_exp_year_month = $card_exp_year.'-'.$card_exp_month; 
     $card_cvc = $request->card_cvc; 
     $itemPrice = $request->paymentamount;
     $itemName = $request->itemName;
     $itemNumber = $request->itemNumber;

     //////////////////////
     $datosxz ="ItemName: " . $itemName . "ItemPrice: " . $itemPrice . "ItemNumbre: " . $itemNumber;
     
     ////////////////////////
 
// Check whether card information is not empty 
if(!empty($card_number) && !empty($card_exp_month) && !empty($card_exp_year) && !empty($card_cvc)){ 
     
      
    // Set the transaction's reference ID 
    $refID = 'REF'.time(); 
     
    // Create a merchantAuthenticationType object with authentication details 
    // retrieved from the config file 
    $merchantAuthentication = new AnetAPI\MerchantAuthenticationType();    
    $merchantAuthentication->setName(ANET_API_LOGIN_ID);    
    $merchantAuthentication->setTransactionKey(ANET_TRANSACTION_KEY);    
     
    // Create the payment data for a credit card 
    $creditCard = new AnetAPI\CreditCardType(); 
    $creditCard->setCardNumber($card_number); 
    $creditCard->setExpirationDate($card_exp_year_month); 
    $creditCard->setCardCode($card_cvc); 
     
    // Add the payment data to a paymentType object 
    $paymentOne = new AnetAPI\PaymentType(); 
    $paymentOne->setCreditCard($creditCard); 
    
    
    // Create order information 
    $order = new AnetAPI\OrderType(); 
    $order->setDescription($itemName); 
     
    // Set the customer's identifying information 
    $customerData = new AnetAPI\CustomerDataType(); 
    $customerData->setType("individual"); 
    $customerData->setEmail($email); 
     
    // Create a transaction 
    $transactionRequestType = new AnetAPI\TransactionRequestType(); 
    $transactionRequestType->setTransactionType("authCaptureTransaction");    
    $transactionRequestType->setAmount($itemPrice); 
    $transactionRequestType->setOrder($order); 
    $transactionRequestType->setPayment($paymentOne); 
    $transactionRequestType->setCustomer($customerData); 
    $request = new AnetAPI\CreateTransactionRequest(); 
    $request->setMerchantAuthentication($merchantAuthentication); 
    $request->setRefId($refID); 
    $request->setTransactionRequest($transactionRequestType); 
    $controller = new AnetController\CreateTransactionController($request); 
    $response = $controller->executeWithApiResponse(constant("\\net\authorize\api\constants\ANetEnvironment::$ANET_ENV")); 
     
    if ($response != null) { 
        // Check to see if the API request was successfully received and acted upon 
        if ($response->getMessages()->getResultCode() == "Ok") { 
            // Since the API request was successful, look for a transaction response 
            // and parse it to display the results of authorizing the card 
            $tresponse = $response->getTransactionResponse(); 
 
            if ($tresponse != null && $tresponse->getMessages() != null) { 
                // Transaction info 
                $transaction_id = $tresponse->getTransId(); 
                $payment_status = $response->getMessages()->getResultCode(); 
                $payment_response = $tresponse->getResponseCode(); 
                $auth_code = $tresponse->getAuthCode(); 
                $message_code = $tresponse->getMessages()[0]->getCode(); 
                $message_desc = $tresponse->getMessages()[0]->getDescription(); 
                 
                // Include database connection file  
                /*include_once 'dbConnect.php'; 
                 
                // Insert tansaction data into the database 
                $sql = "INSERT INTO orders(name,email,item_name,item_number,item_price,item_price_currency,card_number,card_exp_month,card_exp_year,paid_amount,txn_id,payment_status,payment_response,created,modified) VALUES('".$name."','".$email."','".$itemName."','".$itemNumber."','".$itemPrice."','".$currency."','".$card_number."','".$card_exp_month."','".$card_exp_year."','".$itemPrice."','".$transaction_id."','".$payment_status."','".$payment_response."',NOW(),NOW())"; 
                $insert = $db->query($sql); 
                $paymentID = $db->insert_id; 
                 */

                $ordStatus = 'success'; 
                $statusMsg = 'Your Payment has been Successful!'; 
                
                /////////////////Ojo 999999999
                $array = [
                    'status' => $ordStatus,
                    'statusmsg' => $statusMsg,
                    'idtransaction' => $transaction_id,
                    'authcode' => $auth_code
                    
                ];

                echo json_encode($array);
                ///////
            } else { 
                $error = "Transaction Failed! \n"; 
                if ($tresponse->getErrors() != null) { 
                    $error .= " Error Code  : " . $tresponse->getErrors()[0]->getErrorCode() . "<br/>"; 
                    $error .= " Error Message : " . $tresponse->getErrors()[0]->getErrorText() . "<br/>"; 

                    //Agregado para separar mensajes Ajcv (10/12/2018 14:s3)
                    $errorcode = $tresponse->getErrors()[0]->getErrorCode();
                    $errormsg  = $tresponse->getErrors()[0]->getErrorText();
                } 
                $statusMsg = $error; 

                /////////////////Ojo 999999999
                $array = [
                    'status' => "Transaction Failed!",
                    'statusmsg' => $error,
                    'errorcode' => $errorcode,
                    'errormsg' => $errormsg
                    
                ];

                echo json_encode($array);
                ///////
            } 
            // Or, print errors if the API request wasn't successful 
        } else { 
            $error = "Transaction Failed! \n"; 
            $tresponse = $response->getTransactionResponse(); 
         
            if ($tresponse != null && $tresponse->getErrors() != null) { 
                $error .= " Error Code  : " . $tresponse->getErrors()[0]->getErrorCode() . "<br/>"; 
                $error .= " Error Message : " . $tresponse->getErrors()[0]->getErrorText() . "<br/>";
                
                //Agregado para separar mensajes Ajcv (10/12/2018 14:s3)
                $errorcode = $tresponse->getErrors()[0]->getErrorCode();
                $errormsg  = $tresponse->getErrors()[0]->getErrorText();
            } else { 
                $error .= " Error Code  : " . $response->getMessages()->getMessage()[0]->getCode() . "<br/>"; 
                $error .= " Error Message : " . $response->getMessages()->getMessage()[0]->getText() . "<br/>"; 

                //Agregado para separar mensajes Ajcv (10/12/2018 14:s3)
                $errorcode = $tresponse->getErrors()[0]->getErrorCode();
                $errormsg  = $tresponse->getErrors()[0]->getErrorText();
            } 
            $statusMsg = $error; 

            /////////////////Ojo 999999999
            $array = [
                'status' => "Transaction Failed!",
                'statusmsg' => $error,
                'errorcode' => $errorcode,
                'errormsg' => $errormsg
                
            ];

            echo json_encode($array);
            ///////
        } 
    } else { 
        $statusMsg =  "Transaction Failed! No response returned"; 
        
        /////////////////Ojo 999999999
        $array = [
            'status' => "",
            'statusmsg' => $statusMsg
            
        ];

        echo json_encode($array);
        ///////
    } 
}else{ 
    $statusMsg = "Error on form submission."; 
    
    /////////////////Ojo 999999999
    $data = "card_number: " . $card_number . 'card_exp_month: '. $card_exp_month . 'card_exp_year: '. $card_exp_year . 'card_cvc:' . $card_cvc;
    $array = [
        'status' => $data,
        'statusmsg' => $statusMsg
        
    ];

    echo json_encode($array);
    ///////
} 

}//Fin if(isset($postdata) && !empty($postdata))
?>


