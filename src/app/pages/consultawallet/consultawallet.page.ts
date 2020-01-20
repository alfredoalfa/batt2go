import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbapiService } from '../../services/dbapi.service';

@Component({
  selector: 'app-consultawallet',
  templateUrl: './consultawallet.page.html',
  styleUrls: ['./consultawallet.page.scss'],
})
export class ConsultawalletPage implements OnInit {
  credito;
  objcliente;

  constructor(private route: Router, private _dbService: DbapiService) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    
    this.credito = 0;
    this._dbService.g_updatecc = false;
    this.getCreditoWalletByCliente();
  }

  /**
   * Obtener el crédito que posee el cliente en el wallet
   */ 
getCreditoWalletByCliente(){    
  this._dbService.getCreditoWalletByCliente(this._dbService.g_idcliente).then(  
    data => {     
      console.log(data);      
      
      this.objcliente = data;
       
      if (this.objcliente.length == 0){
        
         this.credito = "0"; 
         //El cliente será registrado en la tabla wallet
         this.nuevoClienteWalletCredito();
      }
      else{
        this.credito = data[0]["credito"];        
      }

    },
    error =>{
          //  loading.dismiss();
          //Mensaje de error o de no encontrar la base
          console.log("Error: Checking wallet credit.");
          ///this.tipospago = [];
    }
  )
}//Fin getCreditoWalletByCliente()


////////////////////
nuevoClienteWalletCredito(){
    let datos = { opcion: 1, idclient: this._dbService.g_idcliente, monto: 0};
                  
    this._dbService.update_Wallet(datos).then(
    res => {
        console.log(res);
        
        if(!res["Exito"]){
          alert("Trasaction failed. " + res["Detalle"]);
          this.back();
        }
        else{
          
          //this.back();
        }            

    }, err =>{
    
        console.log(err.message);        
        alert("Error: Error creating new credit wallet.");

        this.back_home();
    });
  
}//Fin nuevoClienteWalletCredito

/////////////////////

//Ir la página de recarga de wallet
recargaWallet(){   
  this.route.navigateByUrl('recargawallet');    
}


paymentPage(){ 
      this._dbService.g_updatecc = false;      
      this._dbService.g_numbercc = "";
      this._dbService.g_yearcc = "";      
      this._dbService.g_monthcc = "";
      this._dbService.g_cvv = "";
      this._dbService.g_primarytdc = false;

      this._dbService.g_nameclient = "";
      this._dbService.g_lastnameclient = "";
      this._dbService.g_zipcodeclient = "";
      
      this.route.navigateByUrl('payment-page');      
}//Fin paymentPage

//Mostrar las credit cards asociadas al cliente
listarcreditcard(){
 // this.route.navigateByUrl('updatecreditcards');
 this.route.navigateByUrl('verificaruser');
}


 //Regresar
back(){
   
  this.route.navigateByUrl('');
  
}

back_home(){
  this.route.navigateByUrl('');
}
}//Fin Class
