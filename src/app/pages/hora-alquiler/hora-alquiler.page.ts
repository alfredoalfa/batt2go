import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { DbapiService } from '../../services/dbapi.service';
import { stringify } from '@angular/core/src/util';

@Component({
  selector: 'app-hora-alquiler',
  templateUrl: './hora-alquiler.page.html',
  styleUrls: ['./hora-alquiler.page.scss'],
})
export class HoraAlquilerPage implements OnInit {

  selected_radio = -1;
  batterycliente;
  batterybase;
  credito = 0;
  objcredito;
  objPreciosByHora;
  opcion_venta;
  
  solicitud = false;

  constructor(private router: Router, private dbApiServ: DbapiService) { }

  ngOnInit() {
  }

  ionViewDidEnter() {  
    this.solicitud = false;
    this.montoBateriaByHora();
    
    //this.getnextBatterysdisponiblesbybase();
   }

  
  okRadioButton(){
    
    //this.registraBateriaByVenta("HYCB98000023wwwww")

    //Esto si va  
    if(this.selected_radio == -1){
      alert("Choose an option.");
    }
    else{
            
      if(!(this.solicitud)){
        //this.dbApiServ.g_precio_batt = this.selected_radio;
        
        this.dbApiServ.g_precio_batt = this.buscarMontoHoraAlquiler();

        //this.rentarbyWallet(); 
  
        //Verificamos si la base aun sigue activa
        this.solicitud = true;
        this.getDetallesBaseBattery(this.dbApiServ.g_codigobase);
  
        //Verificar si el server está en línea
        //this.serverOnline(this.dbApiServ.g_codigobase);
      }
      else{
        alert("request in process");
      }
           
    }
     
  }// Fin okRadioButton


///7777777777777777777
/** Proceder a realizar el descuento del wallet y luego liberar la batería.
 * Si el wallet se actualiza satisfactoriamente se procede a liberar la batería
*/
ventaWallet(monto, opcion){
  
  /*opcion = 1 Nuevo wallet
    opcion = 2 sumar wallet
    opcion = 3 restar wallet
  */
  this.dbApiServ.g_tipopago = 2; //wallet
  
  let datos = { opcion: opcion, idclient: this.dbApiServ.g_idcliente, monto: monto, tipopago: this.dbApiServ.g_tipopago, idpago: null, idbatt: this.dbApiServ.g_idbatt_alq};
        
    this.dbApiServ.update_Wallet(datos).then(
     res => {
         console.log(res);
         
         if(!res["Exito"]){
           alert("Trasaction failed. " + res["Detalle"]);
           this.back_home();
         }
         else{
          
          // Esto si va 
          //OJOOOOOOOO88888888 ESTO VA this.liberarBatt();

          //alert("Libera batería");
          //Sólo prueba
          //this.registraBateriaByVenta("12345678");
          
         }            

     }, err =>{
     
         console.log(err.message);        
         alert("An error has occurred updating your wallet credit.");
         this.solicitud = false;
         this.back_home();
     });
         

}//Fin ventaeWallet
///7777777777777777777


////333333333333333
registraBateriaByVenta(codigobatt){
  var codbateria: string;

  codbateria = codigobatt;

  //this.dbApiServ.g_tipopago = 2;

  this.dbApiServ.g_tipopago = 2; //wallet
  
  //Esto es para ver los parámetros de actualizar wallet
  //let datos = { opcion: opcion, idclient: this.dbApiServ.g_idcliente, monto: monto, tipopago: this.dbApiServ.g_tipopago, idpago: null, idbatt: this.dbApiServ.g_idbatt_alq};

  /*Anterior      
  let datos = { idclient: this.dbApiServ.g_idcliente, idbase: this.dbApiServ.g_idbatterybase, 
                idbateria: this.dbApiServ.g_idbatt_alq, monto: this.dbApiServ.g_precio_batt,
                idtransaccion: null, idtipopago: this.dbApiServ.g_tipopago, 
                idmontobatt: this.selected_radio, codbateria: codbateria};
   */             
  //Nuevo
  let datos = { idclient: this.dbApiServ.g_idcliente, idbase: this.dbApiServ.g_idbatterybase, 
    idbateria: this.dbApiServ.g_idbatt_alq, monto: this.dbApiServ.g_precio_batt,
    idtransaccion: null, idtipopago: this.dbApiServ.g_tipopago, 
    idmontobatt: this.selected_radio, codbateria: codbateria};

  
  this.dbApiServ.ventaClient_Wallet(datos).then(
    res => {
        console.log(res);
        
        if(!res["Exito"]){
          alert("Trasaction failed. " + res["Detalle"]);
          this.solicitud = false;
          this.back_home();
        }
        else{

          
        }            

    }, err =>{
    
        console.log(err.message);
        this.solicitud = false;        
        alert("An error occurred recording operation.");

        this.back_home();
    });
}//Fin registraBateriaByVenta()
////3333333333333333

///////////////////////////////////////
//Método que realiza la venta de la batería a través del wallet
rentarbyWallet(){
         
     this.dbApiServ.g_slot = "0" + this.dbApiServ.g_slot;

     this.dbApiServ.g_tipopago = 2;

     //let datos = { idclient: this.dbApiServ.g_idcliente, idbase: this.dbApiServ.g_idbatterybase, idbateria: this.dbApiServ.g_idbatt_alq, monto: this.dbApiServ.g_precio_batt, idtransaccion: null, idtipopago: this.dbApiServ.g_tipopago};
     
     if(this.dbApiServ.g_creditowallet >= this.dbApiServ.g_precio_batt){
        //
        /******999999999
        this.opcion_venta = 3; //Indica que se debe restar el monto del wallet 
        this.ventaWallet(this.dbApiServ.g_precio_batt, 3);
        999999999*/

        //Agregado 14/01/2020 para 
        this.liberarBatt();
              
     }
     else{
       alert("Your credit is less than the amount, please recharge your wallet.");
       this.solicitud = false;
       this.back_home();
     }     
    


}//Fin rentarbyWallet

//Método que permite liberar la batería vendida
liberarBatt(){
  var _auxcadarray;
  var _auxbateriaarray;
  
  var _base: string;
  var _bateria: string;
  var _bateria_aux: string;
  var _bateria_text: string;
  var _bateria_cod: string;
  var _slot;
  var _orden;
  var _msj;
  
   let comando = "04";
   
   //this.registraBateriaByVenta("12345678");
   //alert("Please remove the battery from de base, thanks!. " + _bateria);   
   
   this.dbApiServ.getliberaBatt(comando, this.dbApiServ.g_codigobase, this.dbApiServ.g_slot).then(
     res => {
         console.log(res);
                  
         if(res == null){
           alert("Host off line.")
           this.back_home();
         }
         else{
              _auxcadarray = res["msg"].split(",");
                 
              _orden = _auxcadarray[0];
              _base = _auxcadarray[1];

              _auxbateriaarray = _auxcadarray[2].split(":");
              _bateria = _auxbateriaarray[1];              

              _slot = _auxcadarray[3];
              _msj = _auxcadarray[4];
                                              
              if(_orden == "1"){          
                this.registraBateriaByVenta(_bateria);
                alert("Please remove the battery from de base, thanks!. " + _bateria);   
                this.back_home();
            }
            if(_orden == "0"){
              alert(_msj);
              this.back_home();
            }
            else{
              console.log(res);
            }
 
         }//else if(!res == null)
                   
     }, err =>{
     
         console.log(err.message);
     
         alert("Error trying to free battery. Please contact the nearest provider.");
         this.back_home();
     }); 
  
 }//Fin liberarBatt

//////////////////////////////////////////


//////9999999999999999999999999999999
//Obtener la próxima disponible con mayor carga
getnextBatterysdisponiblesbybase(){

  if(this.dbApiServ.g_batterydisponibles > 0){        
        this.dbApiServ.getnextBatterysdisponiblesbybase(this.dbApiServ.g_idbatterybase).then(
          data => {
            console.log(data);
            //return this.batterybase = data;                                    
            this.batterycliente = data;      
                  
            if(!(this.batterycliente[0] == null)){
             
              this.dbApiServ.g_idbatt_alq = this.batterycliente[0]["id_bateria"];
              this.dbApiServ.g_precio_batt = this.batterycliente[0]["precio"];
              this.dbApiServ.g_slot = this.batterycliente[0]["slot"];
              
              this.getCreditoWalletByCliente();
            
              //this.nextbattdata = "Código:" + this.nextbattcodigo + " Carga: " + this.nextbattcarga + "%   precio: " + this.nextbattprecio
            }
            else{
              alert("There is no battery with maximum charge to rent. ");
              this.back_home();
            }
          },
          error => {
              //  loading.dismiss();
              //Mensaje de error o de no encontrar la base
              console.log(error);
              alert("An error has occurred checking if there are batteries with maximum charge. ");
              this.solicitud = false;
              this.back_home();

          }
        );
  }
  else{
    alert("There are no batteries to rent. ");
    this.back_home();  
  }// fin else
}//fin getnextBatterysdisponiblesbybase()


/**
   * Obtener el crédito que posee el cliente en el wallet
   */ 
  getCreditoWalletByCliente(){    
    this.dbApiServ.getCreditoWalletByCliente(this.dbApiServ.g_idcliente).then(
      data => {     
        console.log(data);      
        
        this.objcredito = data;
        
        if(this.objcredito.length == 0){  
           this.credito = 0;
           this.dbApiServ.g_creditowallet = this.credito;
                      
        }
        else{          
          this.credito = data[0]["credito"]; 
                    
          if(this.credito >= 1){
           
           this.dbApiServ.g_creditowallet = this.credito;           
           //this.router.navigateByUrl('/hora-alquiler');
          }
          else{                        
           alert("You do not have enough funds, please recharge your wallet.");
           this.back_home();
          }
          
        }
  
      },
      error =>{
            //  loading.dismiss();
            //Mensaje de error o de no encontrar la base
            console.log("Ocurrió un error consultando credit wallet");
            alert("An error occurred checking credit wallet");
            ///this.tipospago = [];
            this.solicitud = false;
            this.back_home();
      }
    );
    
  }//Fin getCreditoWalletByCliente()

//////9999999999999999999999999999999


//Obtener los precios por hora de las baterías
montoBateriaByHora(){
   
   this.dbApiServ.getPrecioBateriaByHora(this.dbApiServ.g_idbatterybase).then(
     res => {
         console.log(res);
         this.objPreciosByHora = res; 
         
                  
         //Buscar Próxima batería a alquilar
         this.getnextBatterysdisponiblesbybase();


         //this.getCreditoWalletByCliente();
     }, err =>{
     
         console.log(err.message);
     
         alert("An error has occurred consulting sale prices.");
         this.objPreciosByHora = [];
         this.solicitud = false;
         this.back_home();
     }); 
  
 }//Fin liberarBatt


 /**
 * Obtener todos los datos de la base indicada en el parámetro base para verificar si está en línea
 */  
getDetallesBaseBattery(base){  
  this.dbApiServ.getDetallesBaseBattery(base).then(
    data => {
      console.log(data);
      this.batterybase = data;
      if(this.batterybase.length == 0){
        alert("PowerBank doesn't exist.");
        this.back_home();
      }
      else
      if(this.batterybase[0]["estatus"] == 0){
        alert("PowerBank Off Line.");
        this.back_home();
      }
      else{  
        //Si todo sigue bien ir a vender.                                   
        
        this.rentarbyWallet();         
      }
    },
    error => {
      console.log('Error: ' + Error);
      alert(Error);
      this.solicitud = false;
      this.back_home();      
    } 
   )
  
 }// Fin getDetallesBaseBattery


////7777777777777777777
/**
 * Verificar si serve está en línea
 * 
 */
serverOnline(){
    
   let comando = "00";
   
   this.dbApiServ.getliberaBatt(comando, this.dbApiServ.g_codigobase, "00").then(
     res => {
         console.log(res);
                  
         if(res == null){
           alert("Host off line.")
           this.back_home();
         }
         else{
             alert("Host on Line.");                                               
             //this.getDetallesBaseBattery(this.dbApiServ.g_codigobase);
         }//else if(!res == null)
                   
     }, err =>{
     
         console.log(err.message);             
         this.back_home();
     }); 
  
 }//Fin liberarBatt

////777777777777777777

//Obtener el monto según el id elegido
buscarMontoHoraAlquiler(){
  var monto = 0;

  for(var i= 0; i < this.objPreciosByHora.length; i++) {    
    if(this.objPreciosByHora[i]["id"] == this.selected_radio){      
      monto = this.objPreciosByHora[i]["monto"];      
    }
  }
  
  return monto;
}


  back(){
    this.router.navigateByUrl("");       
  }


  back_home(){
    this.router.navigateByUrl('');
  }


}// Fin Clase
