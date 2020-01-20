import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { DbapiService } from '../../services/dbapi.service';
import { AlertController, LoadingController } from '@ionic/angular';

declare var Stripe;



@Component({
  selector: 'app-pago-stripe',
  templateUrl: './pago-stripe.page.html',
  styleUrls: ['./pago-stripe.page.scss'],
})
export class PagoStripePage implements OnInit {

  
  //Lecuna
  stripe = Stripe('pk_test_Pya00RRCafq3HRL4SXLPS0wX00UxfCH6FN');

  paymentAmount = 0;
  card: any;
  loading: any;

  

  constructor(private _router: Router, private _alertCtrl: AlertController, 
              private _dbService: DbapiService, private _loadingCtrl: LoadingController)
   
  { }

  ngOnInit() {    
    //this.setupStripe();
  }

  ionViewDidEnter() {   
    this.setupStripe(); 

    if(this._dbService.g_precio_batt == null){
      this.paymentAmount = 0;
    }
    else
    {
      //this.paymentAmount = this._dbService.g_precio_batt;
      this.paymentAmount = this._dbService.g_recargawallet;
      
    }

    
   }//Fin ionViewDidEnter

 
   async presentAlert(_message: string) {
    console.log("Alert msg");
    const alert = await this._alertCtrl.create({
      header: "Batt2go",
      subHeader: "",
      message: _message,
      buttons: ['OK']
    });

    await alert.present();
  }//present Alert

  
//Bloque donde se crea el token de stripe
 setupStripe() {  
  let elements = this.stripe.elements();
  var style = {
    base: {
      color: '#32325d',
      lineHeight: '24px',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  };

  this.card = elements.create('card', { style: style });
  
  this.card.mount('#card-element');

  this.card.addEventListener('change', event => {
    var displayError = document.getElementById('card-errors');
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {      
      displayError.textContent = '';
    }
  });
  
  var form = document.getElementById('payment-form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    console.log(event);
    //Activar loading controller    
    //this.esperar()
    
    
    this.stripe.createSource(this.card).then(result => {
     
      if (result.error) {
        var errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
        
        //this.terminarespera();
        console.log("Error");
      } else {
        console.log(result);
        console.log("Todo Bien");
        console.log(result.source.id);

        //this.esperar();
        
        this.makePayment(result.source);
      }
    });
  });
  
}//Fin setupStripe


////
  //realizar pago stripe
  makePayment(token){
    
    /*if((this._dbService.g_idcliente == null) || (this._dbService.g_idbatt_alq == null) ||
       (this._dbService.g_idbatt_alq == null) || this._dbService.g_idbatterybase == null){        
        this.presentAlert("Erro. Data inconsistente. Por favor reinicie sesión.")
       }*/
    if(this._dbService.g_idcliente == null){        
        this.presentAlert("Erro. Data inconsistente. Por favor reinicie sesión.")
       }   
    else{        
        let datos = { amount: this.paymentAmount * 100, currency: "usd", token: token.id, descrip: "Baterry2go"};
        this.esperar();
        this._dbService.stripePayment(datos).then(
          data => {
            console.log(data);      
            
            if (data['amount_refunded'] == 0 && data['failure_code'] == null && data['paid'] == 1 && data['captured'] == 1 && data['status'] == 'succeeded')
            {              
              //this.registrarCompra(data['id']);
              
              //Cargar crédito wallet
              this.recargarCredito(data['id'])
                            
            }
              // transaction details
          },
          error =>{        
                
                this.terminarespera();
                console.log(error);
                this.presentAlert("Ha ocurrido un error procesando pago.")
          }
        )
    }// fin else
  }//makePayment
////



  //Comprar baterías.
  registrarCompra(idstripe){  
                let datos = { idclient: this._dbService.g_idcliente, idbase: this._dbService.g_idbatterybase, idbateria: this._dbService.g_idbatt_alq, monto: this._dbService.g_precio_batt, idtransaccion: idstripe, idtipopago: this._dbService.g_tipopago}
                let error = false;
                let detalles = "";

                this._dbService.ventaClient(datos).subscribe(
                  data => {
                    console.log("Registrando venta. ", data);
                    //alert(data["Exito"]);
                    error = data["Exito"];
                    detalles = data["Detalle"]
                  },
                  error => {
                    console.log(error);
        
                    this.terminarespera();
                    this.presentAlert("Ha ocurrido un error registrando venta.")        
                  },
                  () => {
                                                        
                    this.terminarespera();

                    if(!error){
                      alert("Trasacción fallida. " + detalles);
                    }
                    else{
                      this.presentAlert("Trasacción exitosa. Aceptar para liberar batería.");
                    }
                    
                                        
                    this.back();                                                       
                  }
              )//fin this.dbApiServ
    
  }//fin buyBattery



  /////////////////////      
  recargarCredito(idstripe){
    this._dbService.g_tipopago = 1;

    //opcion: 2. Indica que se sumará monto al wallet
    let datos = { opcion: 2, idclient: this._dbService.g_idcliente, monto: this.paymentAmount, tipopago: this._dbService.g_tipopago, idpago: idstripe};
              
    this._dbService.update_Wallet(datos).then(
    res => {
        console.log(res);
        
        if(!res["Exito"]){
          alert("Trasaction failed. " + res["Detalle"]);
          this.terminarespera();
          this.back();
        }
        else{
          
          //alert("Recarga exitosa.");
          this.terminarespera();
          alert("Successful");
          this.back();
        }            
      }, err =>{
    
        console.log(err.message);        
        alert("Error adding credit wallet.");
        this.terminarespera();
        this.back();
    });
      
    
  }//Fin recargarCredito
    
      
  ////////////////////

  //Crear loadingcontroller
  async esperar(){
    this.loading = await this._loadingCtrl.create({spinner: 'bubbles'});
    this.loading.present();    
  }

  //Destruir loading controller
  terminarespera(){       
    this.loading.dismiss();    
  }

  back(){
    this._router.navigateByUrl("");     
  } 
}//Fin Class
