import { Component, OnInit, HostListener } from '@angular/core';

import { Router} from '@angular/router';
import { AlertController } from '@ionic/angular';

import { DbapiService } from '../../services/dbapi.service';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.page.html',
  styleUrls: ['./payment-page.page.scss'],
})
export class PaymentPagePage implements OnInit {
  
  tarjeta: string;
  year: string;
  month: string;  
  cod_seguridad: string;
  idcliente: string;
  email: string;
  updatecc: boolean = false;
  primarytdc: boolean = false;
  principaltdc: any = 0;
  tdc_data: any;
  zipcode: string = "";
  name: string = "";
  lastname: string  = "";

  progress: boolean = false;

  all_months: any;
  all_years: any;

  constructor(private _router: Router, private _dbApiServ: DbapiService, 
              private alertCtrl: AlertController) {
                
                this.all_months = _dbApiServ.g_all_months;
                this.all_years = _dbApiServ.g_all_years;
            
               }

  ngOnInit() {        
  }

  ionViewDidEnter() { 
    this.progress = false;  

    this.limpiar_variables();
                
    this.idcliente = this._dbApiServ.g_idcliente;
    //this.email = this._dbApiServ.g_email;
    
    if(this._dbApiServ.g_updatecc){
    
      this.updatecc = this._dbApiServ.g_updatecc;      
      this.tarjeta = this._dbApiServ.g_numbercc;
      this.year = this._dbApiServ.g_yearcc.toString();      
      this.month = this._dbApiServ.g_monthcc.toString();
      this.cod_seguridad = this._dbApiServ.g_cvv;
      this.primarytdc = this._dbApiServ.g_primarytdc;

      this.name = this._dbApiServ.g_nameclient;
      this.lastname = this._dbApiServ.g_lastnameclient;
      this.zipcode = this._dbApiServ.g_zipcodeclient;
      //this.year = "2022";
    }
    else{
      this.updatecc = false;
    }
     
  }


  limpiar_variables(){
    this.tarjeta = "";
    this.year = "";
    this.month = "";
    this.cod_seguridad = "";
    this.name = "";
    this.lastname = "";
    this.zipcode = "";

  }

  //Bloque alert
  async presentAlert(_message: string) {
    console.log("Alert msg");
    const alert = await this.alertCtrl.create({
      header: "IPower",
      subHeader: "",
      message: _message,
      buttons: ['OK']
    });

    await alert.present();
    //let result = await alert.onDidDismiss();
    //console.log(result);
  }//Fin presentAlert


  async presentAlertConfirm(_form) {
    
    const alert = await this.alertCtrl.create({
      header: 'BATT2GO',
      message: '<strong>Add credit card??</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.progress = false;
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Ok');
                        
            let datos = { idcliente: this.idcliente, tarjeta: _form.value.tarjeta, codigo1 : this.year, 
                          codigo2 : this.month, cod_seg : _form.value.cod_seguridad, primarytdc: this.principaltdc,
                          namecli: this.name, lastnamecli: this.lastname, zipcodecli: this.zipcode
                        }
                                                            
            this._dbApiServ.nuevaPayment(datos).then(
              res => {
                  console.log(res);
                 
                  if(res["Exito"]){                    
                    this.limpiar_variables();                   
                    this.back_home();
                  }
                  else{
                    this.showmsjalert(res["Detalle"]);
                    this.progress = false;  
                  }
              }, err =>{
                             
                //this.presentAlert("Error recording data.");
                this.progress = false;  
                this.presentAlert(err.message);              
              });
            
            
          }
        }
      ]
    });

    await alert.present();
  }

  /////Fin bloque alert


//Confir Update credit card
  async presentAlertConfirmUpdatecc(_form, _idcc) {
    this.progress = true;        
    const alert = await this.alertCtrl.create({
      header: 'BATT2GO',
      message: '<strong>Update credit card?</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.progress = false;
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Ok');
          
              let datos = { idcliente: this.idcliente, id: _idcc, nrotarj: _form.value.tarjeta, year : this.year, month : this.month, 
                            cvv : _form.value.cod_seguridad, primarytdc: this.principaltdc,
                            namecli: this.name, lastnamecli: this.lastname, zipcodecli: this.zipcode
                          }
           
              this._dbApiServ.udateCreditCard(datos).then(
              res => {
                  console.log(res);
                  
                  if(!(res["Exito"])){
                      if (res["Detalle"].indexOf('Duplicate')!=-1) {                     
                        console.log("Duplicate card.");
                        this.progress = false;
                        this.showmsjalert("Duplicate card.");
                      }  
                  }
                  
                  
                  this.limpiar_variables();
                  this.back_home();
              }, err =>{
              
                this.presentAlert("Error updating data.");
                  this.progress = false;
                  console.log(err.message);
                  this.back_home();
              });
                        
          }
        }
      ]
    });

    await alert.present();
  }

  /**Registrar tarjeta de pago del cliente */
  registrar_Tarjeta(_form){
  
    if(this.progress){
      alert("Operation in progress...");
    }
    else    
    if(_form.value.tarjeta === ""){     
      this.presentAlert("Enter credit card number.");
    }
    else 
    if(_form.value.year === ""){      
      this.presentAlert("Enter Year.");
    }
    else 
    if(_form.value.codigo2 === ""){      
      this.presentAlert("Enter Moth.");
    }
    else
    if((parseInt(this.month) == 0) || (parseInt(this.month) > 12)){      
      this.presentAlert("Enter Valid Moth.");      
    }
    else 
    if(_form.value.cod_seguridad === ""){      
      this.presentAlert("Enter vvv.");
    }
    else{ 
      if(this.validaData()){  
         this.progress = true;           
         this.existTdc(_form, false);                  
      }
    }
    
  }//Fin registrar_Tarjeta

  //Actualizar credit card
  
  update_Tarjeta(_form){
  
    if(this.progress){
      alert("Operation in progress...");
    }
    else
    if(_form.value.tarjeta === ""){
      //alert("Por favor indique nro de tarjeta.");
      this.presentAlert("Enter credit card number.");
    }
    else 
    if(_form.value.year === ""){      
      this.presentAlert("Enter Year.");
    }
    else 
    if(_form.value.codigo2 === ""){      
      this.presentAlert("Enter Moth.");
    }
   
    else 
    if(_form.value.cod_seguridad === ""){      
      this.presentAlert("Enter vvv.");
    }
    else{      
      if(this.validaData()){
        //this.presentAlertConfirmUpdatecc(_form, this._dbApiServ.g_idcc);
        
        if(this._dbApiServ.g_numbercc === _form.value.tarjeta){
          this.progress = true;        
          this.presentAlertConfirmUpdatecc(_form, this._dbApiServ.g_idcc); 
        }
        else{
          this.progress = true;          
          this.existTdc(_form, true);
        }
      }
          
    }
  }//update_Tarjeta


//Validar sólo nros. 
_keyPress(event: any) {
  const pattern = /[0-9]/;  
  
  let inputChar = String.fromCharCode(event.charCode);

  if (!pattern.test(inputChar)) {
   //invalid character, prevent input
    event.preventDefault();
  }
}


//Verificar cambios en la tarjeta
_onChangeTarjeta() {  
      if(this.tarjeta.length == 4){
        this.tarjeta = this.tarjeta + "-";        
      }
      else
      if((this.tarjeta.length > 4) && (this.tarjeta.length == 9)){
        this.tarjeta = this.tarjeta + "-";        
      }
      else
      if((this.tarjeta.length > 9) && (this.tarjeta.length == 14)){        
        this.tarjeta = this.tarjeta + "-";
        
      }
      
}//Fin _onChangeTarjeta


//Verificar cambios en la tarjeta
/*_onChangeTarjeta_b(event: any) {  
  var aux_tdc: string;
  
  console.log(event.charCode);

  if(this.tarjeta.length == 4){
    this.tarjeta = this.tarjeta + "-";        
  }
  else
  if((this.tarjeta.length > 4) && (this.tarjeta.length == 9)){
    this.tarjeta = this.tarjeta + "-";        
  }
  else
  if((this.tarjeta.length > 9) && (this.tarjeta.length == 14)){        
    this.tarjeta = this.tarjeta + "-";    
  }
  
  if(this.tarjeta.length < 16){
     //this.tarjeta = this.tarjeta.replace(/[0-9]/g, '*');
  }

}//Fin _onChangeTarjeta
*/

////////////////////
/*@HostListener('input', ['$event']) onInputChange(evt) {
alert("222222222222222222222: " + evt.which + evt.charCode);
  if (evt.which === 8 || evt.which === 0) {
      return true;
  }

  const regex = new RegExp("^[0-9\~]*$");
  var key = String.fromCharCode(!evt.charCode ? evt.which : evt.charCode);
  // console.log(regex.test(key))
  if (!regex.test(key)) {
      evt.preventDefault();
      return false;
  }
  return true;
}*/
////////////////////


_onChangePrimarytdc(){
  if(this.primarytdc){
    this.principaltdc = 1;              
  }
  else{
    this.principaltdc = 0;
  }
}

//Validar que todos los datos tengan valores correctos
validaData(){
    var Ok: boolean = true;  
    if(this.tarjeta.length < 19){
      alert("Invalid credit card length");
      Ok = false;
    }
    else
    if(this.month.length < 2){      
      this.month = "0" + this.month;       
    }
    else
    if((parseInt(this.month) == 0) || (parseInt(this.month) > 12)){      
      alert("Invalid month.");
      Ok = false;
    }
    else
    if(this.year.length < 4){
      alert("Invalid year length");
      Ok = false;
    }
    else
    if((parseInt(this.year) == 0)){
      alert("Invalid year.");
      Ok = false;
    }
    else
    if(this.cod_seguridad.length < 3){
      alert("Invalid cvv length");
      Ok = false;
    }
    
    return Ok;
}

/*//Obtener los datos de la tarjeta por cliente y nro tarjeta
getTdcByClienteAndNro(_idcliente, _form, _new: boolean){  
  alert()  
  this._dbApiServ.getTdcByClienteAndNro(_idcliente, _form.value.tarjeta).then(
    res => {
        console.log(res);
        
        this.tdc_data = res;
      
        if(this.tdc_data.length > 0){
          this.progress = false;
          if(_new){
             this.showmsjalert("Credit card already exists.");
          }
          else{
            if(this._dbApiServ.g_numbercc === _form.value.tarjeta){
              this.presentAlertConfirmUpdatecc(_form, this._dbApiServ.g_idcc); 
            }
            else{
              this.showmsjalert("Credit card already exists.");  
            }            
          }          
        }
        else{                   
            // 999this.presentAlertConfirm(_form);                    
        }
        
    }, err =>{
    
        this.presentAlert("Error consulting data.");
        console.log(err.message);
        this.back_home();
    });

}// Fin getTdcByClienteAndNro()
*/

//verificar si la tarjeta existe
existTdc(_form, _update){
  this.progress = true;
  this._dbApiServ.getExistTdc(_form.value.tarjeta).then(
    res => {
        console.log(res);
        this.tdc_data = res;                  
        if(!(this.tdc_data == null)){  
            
            if(this.tdc_data.length > 0){                                                
                //alert("La tarjeta ya está asignada.");
                this.progress = false;                        
                alert("Credit card not allowed.");
                
            }//fin if(this.tdc_data.length > 0)
            else{              
              if(_update){                 
                 //alert("Update");
                
                 this.presentAlertConfirmUpdatecc(_form, this._dbApiServ.g_idcc);
              }
              else{           
                //alert("Add");
                this.presentAlertConfirm(_form);                    
              }
            }
          }//Fin if(!(this.tdc_data == null))          
    }, err =>{
    
      console.log(err.message);                
      alert("Error searching credit card data.");          
      
    });
}//Fin exist tdc
paymentsubmit(form){
  //
}

//Mostrar mensaje en parámetro msj
showmsjalert(msj){
  alert(msj);
}

back(){
    this._router.navigateByUrl("consultawallet");       
}

back_home(){
  this._router.navigateByUrl('');
}

}
