import { Injectable } from '@angular/core';

import { HttpClient} from '@angular/common/http';

import { Observable } from  'rxjs';

import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class DbapiService {

  batterybase: any;
    
  //url = "http://localhost:8080/";
  url = "http://45.79.217.58:8080/";
  
  peticion   = "peticiones.php";
  createuser = "newclient.php";  
  loginUser  = "login.php";
  alquiler_batt = "alquiler_batt.php";
  alquiler_batt_wallet = "alquiler_batt_wallet.php";
  return_batt = "return_batt.php";
  nuevo_payment = "payment.php";
  updating = "updating.php";
  stripepayment = "stripe_payment.php";
  recarga_wallet = "recarga_wallet.php";
  update_wallet = "updatewallet.php";
  libera_batt = "cliente3.php";
  updatecc =  "update_creditcard.php";
  authorizenet = "authorizenet.php";
  recuperapass = "recuperapass.php";

  //Bloque variable globales
  public g_idcliente;
  public g_idbase;
  public g_codigo;
  public g_email;
  public g_disponibles;
  public g_nombrecliente;
  public g_opcion;
  public g_idbatterybase;
  public g_codigobase;
  public g_batterydisponibles;
  public g_terminosandc = false;
  //Para indicar la acción a ejecutar ddesde el sitio donde se loguea.
  public g_login_accion;

  public g_precio_batt = 0;
  public g_creditowallet = 0;
  public g_recargawallet = 0;
  public g_idbatt_alq;
  public g_tipopago;
  public g_slot: string;
  
  //Para actualizar credit card
  public g_updatecc = false;
  public g_idcc = -1;
  public g_numbercc: string = "";
  public g_numbercc_b: string = "";
  public g_yearcc: string = "";
  public g_monthcc: string = "";
  public g_cvv: string = "";
  public g_primarytdc: boolean = false;

  public g_email_reg = "";
  public g_pass_reg = "";
  public g_registro: boolean = false;

  public g_nameclient = "";
  public g_lastnameclient = "";
  public g_zipcodeclient = "";


  public g_autorize_creditcar_list: boolean = false;  

  public g_email_support: string = "";
  public g_all_months: any;
  public g_all_years: any;
  public g_fecha_wallet_detalle: string = "";


  
  constructor(public httpC: HttpClient, private route: Router) {

    this.g_all_months = [
      {"id":1, "month":"01"},
      {"id":2, "month":"02"},
      {"id":3, "month":"03"},
      {"id":4, "month":"04"},
      {"id":5, "month":"05"},
      {"id":6, "month":"06"},
      {"id":7, "month":"07"},
      {"id":8, "month":"08"},
      {"id":9, "month":"09"},
      {"id":10, "month":"10"},
      {"id":11, "month":"11"},
      {"id":12, "month":"12"},
    ];

    this.g_all_years = [
      {"id":1, "year":"2020"},
      {"id":2, "year":"2021"},
      {"id":3, "year":"2022"},
      {"id":4, "year":"2023"},
      {"id":5, "year":"2024"},
      {"id":6, "year":"2025"},
      {"id":7, "year":"2026"},
      {"id":8, "year":"2027"},
      {"id":9, "year":"2028"},
      {"id":10, "year":"2029"},
      {"id":11, "year":"2030"},
      {"id":12, "year":"2031"},
      {"id":13, "year":"2032"},
      {"id":14, "year":"2033"},
      {"id":15, "year":"2034"},
      {"id":16, "year":"2035"},
      {"id":17, "year":"2036"},
      {"id":18, "year":"2037"},
      {"id":19, "year":"2038"},
      {"id":20, "year":"2039"},
      {"id":21, "year":"2040"},
      {"id":22, "year":"2041"},
      {"id":23, "year":"2042"},
      {"id":24, "year":"2043"},
      {"id":25, "year":"2044"},
      {"id":26, "year":"2045"},
      {"id":27, "year":"2046"},
      {"id":28, "year":"2047"},
      {"id":29, "year":"2048"},
      {"id":30, "year":"2049"},
      {"id":31, "year":"2050"},

    ];
   }


   limpiar_Variables_Globales(){
      this.g_idcliente = null;
      this.g_idbase = null;
      this.g_codigo = null;
      this.g_email = null;
      this.g_disponibles = null;
      this.g_nombrecliente = null;
      this.g_opcion = null;
      this.g_idbatterybase = null;
      this.g_codigobase = null;
      this.g_batterydisponibles = null;      
      this.g_login_accion = null;
      this.g_slot = "";
    
   }
  
  //9999
  //Obtener todas los bancos de baterías.
  loginClient_2(params){
    
   return this.httpC.post<any>(this.url + this.loginUser, params);    
   
   }//Fin loginClient
  //9999


  //Crear nuevo cliente
  createClient(params): Observable<any>{      
    return this.httpC.post<any>(this.url + this.createuser, params);    
  }


  //Venta cliente
  ventaClient(datos){        
    return this.httpC.post<any>(this.url + this.alquiler_batt, JSON.stringify(datos));    
    
  }//Fin ventaClient

  //Venta cliente Wallet
  ventaClient_Wallet(datos){        
    //return this.httpC.post<any>(this.url + this.alquiler_batt_wallet, JSON.stringify(datos));           
    return this.httpC.post(this.url + this.alquiler_batt_wallet, JSON.stringify(datos)).toPromise();    
    
  }//Fin ventaClient_Wallet

  //////////////////////////
  //Recargar cliente Wallet
  recarga_Wallet(datos){            
    return this.httpC.post(this.url + this.recarga_wallet, JSON.stringify(datos)).toPromise();    
    
  }//Fin recarga_Wallet


  update_Wallet(datos){            
    return this.httpC.post(this.url + this.update_wallet, JSON.stringify(datos)).toPromise();    
    
  }//Fin recarga_Wallet
  //////////////////////////

  //Retornar Batería
  returnBatt(datos){            
    return this.httpC.post<any>(this.url + this.return_batt, JSON.stringify(datos));      
  }//Fin ventaClient

  //agregar nueva forma de payment
  nuevaPayment(datos){    
    return this.httpC.post(this.url + this.nuevo_payment, JSON.stringify(datos)).toPromise();    
    
  }//Fin ventaClient

  //Actualizar password
  upDatePass(_datos){        
    return this.httpC.post(this.url + this.updating, JSON.stringify(_datos)).toPromise();        
  }//Fin ventaClient

  //Pago Stripe  
  stripePayment(datos){        
    return this.httpC.post(this.url + this.stripepayment, JSON.stringify(datos)).toPromise();    
  }//Fin ventaClient

  //Realizar pago Authorizenet
  pago_Authorizenet(datos){ 
    return this.httpC.post(this.url + this.authorizenet, JSON.stringify(datos)).toPromise();        
  }//Fin pago_Authorizenet(datos)

  //Actualizar datos de credit card
  udateCreditCard(_datos){        
    return this.httpC.post(this.url + this.updatecc, JSON.stringify(_datos)).toPromise();        
  }//Fin ventaClient

   //Actualizar password
   recuperaPass(_datos){        
    return this.httpC.post(this.url + this.recuperapass, JSON.stringify(_datos)).toPromise();        
  }//Fin ventaClient

/////////////////////////////////////////////////////////////////////////////////
//Bloque get
/////////////////////////////////////////////////////////////////////////////////

  //Base baterías activas
  getBaseBattery_Detalles(_status): Observable<any>{
    return this.httpC.get(this.url + this.peticion + "?opcion=1&status=" + _status);    
  }

  //Base baterías activas
  getBaseBattery(){
    return this.httpC.get(this.url + this.peticion + "?opcion=2");
  }

  //Obtener detalles de la base a alquilar
  getDetallesBaseBattery(idbase){      
    return this.httpC.get(this.url + this.peticion + "?opcion=3&codigo=" + idbase).toPromise();
  }

  //Baterías por clientes
  getBatteryByCliente_promise(idcliente){    
    return this.httpC.get(this.url + this.peticion + "?opcion=4&idcliente=" + idcliente).toPromise();
  }

  //Baterías disponible por base
  getBatterysdisponiblesbybase(idbase){     
    this.httpC.get(this.url + this.peticion + "?opcion=5&idbase=" + idbase).toPromise()
  }

  //Proxima batería a rentar
  getnextBatterysdisponiblesbybase(idbase){         
    return this.httpC.get(this.url + this.peticion + "?opcion=6&idbase=" + idbase).toPromise()
  }

  //Obtener datos del cliente by email
  getClientebyemail(email){
    return this.httpC.get(this.url + this.peticion + "?opcion=7&email=" + email).toPromise()
  }


  //Obtener historial cliente
  getHistorialByCliente(idcliente){  
    return this.httpC.get(this.url + this.peticion + "?opcion=8&idcliente=" + idcliente).toPromise()
  }

  //Obtener tipos de pagos activos
  getTipoPagos_promise(){    
    return this.httpC.get(this.url + this.peticion + "?opcion=9").toPromise();
  }

  //Obtener total de crédito del cliente
  getCreditoWalletByCliente(idcliente){    
    return this.httpC.get(this.url + this.peticion + "?opcion=10&idcliente=" + idcliente).toPromise();
  }

  //Baterías disponible por base
  getWalletsdefault(){     
    return this.httpC.get(this.url + this.peticion + "?opcion=11").toPromise();
  }


  //Buscar los precios por hora de las baterías
  getPrecioBateriaByHora(idbase){     
    
    return this.httpC.get(this.url + this.peticion + "?opcion=12&idbase=" + idbase).toPromise();
  }

  //
  //Buscar credit cards asociadas a un cliente
  getCreditCardByCliente(idcliente){     
    
    return this.httpC.get(this.url + this.peticion + "?opcion=13&idcliente=" + idcliente).toPromise();
  }

   //Obtener historial wallet
   getWalletHistorialByCliente(idcliente){  
    return this.httpC.get(this.url + this.peticion + "?opcion=14&idcliente=" + idcliente).toPromise()
  }

  //Verificar validez y existencia de cupón
  getDataByCoupon(coupon){  
    return this.httpC.get(this.url + this.peticion + "?opcion=15&cupon=" + coupon).toPromise()
  }

  //Verificar si el cliente ya usó el cupón
  getCouponByCliente(_coupon, _idcliente){      
    return this.httpC.get(this.url + this.peticion + "?opcion=16&cupon=" + _coupon + "&idcliente=" + _idcliente).toPromise()
  }

  //Obtener los datos de la TDC principal del cliente
  getPrimaryTdcByCliente(_idcliente){  
    return this.httpC.get(this.url + this.peticion + "?opcion=17&idcliente=" + _idcliente).toPromise()
  }

  //Obtener los datos de la TDC principal del cliente
  getTdcByClienteAndNro(_idcliente, _tarjeta){  
    return this.httpC.get(this.url + this.peticion + "?opcion=18&idcliente=" + _idcliente + "&tarjeta=" + _tarjeta).toPromise()
  }

  //verificar si lña tarjeta ya está asignada a algú cliente
  getExistTdc(_tarjeta){  
    return this.httpC.get(this.url + this.peticion + "?opcion=19&tarjeta=" + _tarjeta).toPromise()
  }

  //Ejecuta la búsqueda de las base por zipcod, ubicació o dirección
  getsearchBase(_search){  
    return this.httpC.get(this.url + this.peticion + "?opcion=20&searchbase=" + _search).toPromise()
  }
  //Ejecutar liberación de batería
  getliberaBatt(comando, base, slot){
    //let _url = this.url + this.libera_batt + "?comando=" + comando + "&base=" + base + "&slot=" + slot;
        
    let _url = this.url + this.libera_batt + "?comando=" + comando + "&base=" + base;    
    return this.httpC.get(_url).toPromise();

  }

  
 recargarWallet(_opcion, _idtransaccion, _idtdc, _idcliente, _monto, _tipopago, _escupon){
  
  //opcion: 2. Indica que se sumará monto al wallet
  let datos = { opcion: 2, idtdc: _idtdc, idclient: _idcliente, monto: _monto, tipopago: _tipopago, idpago: _idtransaccion, escupon: _escupon};
  
            
  this.update_Wallet(datos).then(
  res => {
      console.log(res);
      
      if(!res["Exito"]){
        alert("Trasaction failed. " + res["Detalle"]);
        
        //this.process = false;
       // this.back();
        this.route.navigateByUrl('');
      }
      else{
        alert("Successful");
       
        this.route.navigateByUrl('');
      }            
    }, err =>{
  
      console.log(err.message);        
      alert("Error adding credit wallet.");
      
     // this.process = false;
    //  this.back();
     this.route.navigateByUrl('');
  });
    
  
}//Fin recargarCredito


}//DbapiService
