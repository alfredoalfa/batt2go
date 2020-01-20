import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DbapiService } from '../../services/dbapi.service';


@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {

  paymentAmount;
  creditos;

  constructor(private route: Router, private _dbService: DbapiService)
  { }

  
  
  ngOnInit() {
  }

  ionViewDidEnter() {   
    this.paymentAmount = 0;
    this.creditos = 0;

    this.getCreditoWalletByCliente();
    
    if(this._dbService.g_precio_batt == null){
      this.paymentAmount = 0;
    }
    else
    {
      this.paymentAmount = this._dbService.g_precio_batt;
    }
       

   }//Fin ionViewDidEnter


/**
 * Obtener crédito del cliente en el wallet
 */
getCreditoWalletByCliente(){  
  this._dbService.getCreditoWalletByCliente(this._dbService.g_idcliente).then(
    data => {     
      console.log(data);      
      //this.tipospago = data;

      if (data == []){
         this.creditos = 0;         
      }
      else{
        this.creditos = data[0]["credito"];        
      }

    },
    error =>{
          //  loading.dismiss();
          //Mensaje de error o de no encontrar la base
          console.log("Ocurrió un error consultando tipos de pagos");
          ///this.tipospago = [];
    }
  )
}//Fin getCreditoWalletByCliente()


rentarbyWallet(){
      
  if ((parseInt(this.creditos) == 0) || (parseInt(this.creditos) < parseInt(this.paymentAmount))){  
    alert("Crédito insufiente para completar ésta operación.");
  }
  else{
    //Rentar Batería
    
    this._dbService.g_slot = "0" + this._dbService.g_slot;

    let datos = { idclient: this._dbService.g_idcliente, idbase: this._dbService.g_idbatterybase, idbateria: this._dbService.g_idbatt_alq, monto: this._dbService.g_precio_batt, idtransaccion: null, idtipopago: this._dbService.g_tipopago}
    alert("idclient: "  + this._dbService.g_idcliente + " base: " + this._dbService.g_idbatterybase + " idbateria: " + this._dbService.g_idbatt_alq + " monto: " + this._dbService.g_precio_batt + " idtransaccion: null " + " idtipopago: " + this._dbService.g_tipopago);

    this._dbService.ventaClient_Wallet(datos).then(
      res => {
          console.log(res);
          
          if(!res["Exito"]){
            alert("Trasacción fallida. " + res["Detalle"]);
          }
          else{
            //alert("Trasacción exitosa. Aceptar para liberar batería.");
           // this.liberarBatt();
          }

          this.back_home();

      }, err =>{
      
          console.log(err.message);
      
          alert("Ha ocurrido un error registrando venta.");
      });    
  }

}//Fin rentarbyWallet

liberarBatt(){
  //alert("aaaaaaaaaa");
  //let datos = { idclient: this._dbService.g_idcliente, idbase: this._dbService.g_idbatterybase, idbateria: this._dbService.g_idbatt_alq, monto: this._dbService.g_precio_batt, idtransaccion: null, idtipopago: this._dbService.g_tipopago}
   let comando = "01";
   
   this._dbService.getliberaBatt(comando, this._dbService.g_codigobase, this._dbService.g_slot).then(
     res => {
         console.log(res);
         
         if(res["msg"] == "01"){
          alert("Por favor retire su batería.");
         }
         if(res["msg"] == "00"){
            alert("Error. Ha surgido un problema.");
        }
          
 
     }, err =>{
     
         console.log(err.message);
     
         alert("Ha ocurrido un error registrando venta.");
     }); 
 
 }//Fin liberarBatt


//Regresar
back(){
   
    this.route.navigateByUrl('');
    
  }

  back_home(){
    this.route.navigateByUrl('');
  }

}
