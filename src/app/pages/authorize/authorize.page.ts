import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { DbapiService } from '../../services/dbapi.service';

import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.page.html',
  styleUrls: ['./authorize.page.scss'],
})
export class AuthorizePage implements OnInit {
  
   paymentAmount;
   creditcardnumber;
   year: string;
   month: string;
   cvv;
   idclient;
   
   all_months: any;
   all_years: any;
   

   $itemName = "Credit added / Re-load";  
   $itemNumber = "1";  

   loading: any;
  
   process: boolean;
   authorizefinish: boolean = false;

   primaryccdata: any;
   all_creditcard: any;
   tdc_data: any;

   zipcode: string = "";
   name: string = "";
   lastname: string  = "";

   tdc_isReadOnly: boolean = true;
   cvv_isReadOnly: boolean = true;
   name_isReadOnly: boolean = true;
   lastname_isReadOnly: boolean = true;
   zipcode_isReadOnly: boolean = true;
   year_isDisabled: boolean = true;
   month_isDisabled: boolean = true;
   
  constructor(private _route: Router, private _dbApiServ: DbapiService, private _loadingCtrl: LoadingController) { 
    this.all_months = _dbApiServ.g_all_months;
    this.all_years = _dbApiServ.g_all_years;  
  }

  ngOnInit() {
  }

  ionViewDidEnter() {   
  
    this.creditcardnumber = "";
    this.year = "";
    this.month = "";
    this.cvv = "";

    this.zipcode = "";
    this.name = "";
    this.lastname = "";
  
    this.process = false;
    this.paymentAmount = this._dbApiServ.g_recargawallet;
   
    if(this._dbApiServ.g_autorize_creditcar_list){     
      //Eligió de la lista 
      
      //Desactivar elementos
      
      this.activa_Desactiva_Elementos(true);

      this.creditcardnumber = this._dbApiServ.g_numbercc;
      this.year = this._dbApiServ.g_yearcc.toString();
      this.month = this._dbApiServ.g_monthcc.toString();
      this.cvv = this._dbApiServ.g_cvv;

      this.name = this._dbApiServ.g_nameclient;
      this.lastname = this._dbApiServ.g_lastnameclient;
      this.zipcode = this._dbApiServ.g_zipcodeclient;

      this._dbApiServ.g_autorize_creditcar_list = false; 
      
      //Si no eligió ninguna tarjeta de la lista
      if(this.creditcardnumber.length == 0){                 
      
        this.getPrimaryCreditCard(this._dbApiServ.g_idcliente);
      }
      
    }
    else{      
      //Obtener la tdc principal                  
      this.getPrimaryCreditCard(this._dbApiServ.g_idcliente);
    }
        
  }

activa_Desactiva_Elementos(ok){
  this.tdc_isReadOnly = ok;  
  this.cvv_isReadOnly = ok;  
  this.name_isReadOnly = ok;  
  this.lastname_isReadOnly = ok;  
  this.zipcode_isReadOnly = ok;  
  this.year_isDisabled = ok;  
  this.month_isDisabled = ok;  
   
}//Fin desactivar_Elementos

pagoAuthorizenet_B(_auxtdc: string, _nuevatdc: boolean, _idtdc: number){

let datos = { name: this.name + " " + this.lastname, email: this._dbApiServ.g_email, 
  card_number: _auxtdc, card_exp_month: this.month, 
  card_exp_year:this.year, card_cvc: this.cvv, itemName: this.$itemName,
  itemNumber: this.$itemNumber, paymentamount: this.paymentAmount                            
};
//this.process = true;
this._dbApiServ.pago_Authorizenet(datos).then(
  res => {
      console.log(res);
      
      if(!(res["status"] == "success")){
        // alert(res["statusmsg"]);
          alert(res["errormsg"]);
        
          this.process = false;
          this.authorizefinish = true;
        //999 this.back();
      }
      else{
          this.authorizefinish = true;          
          this._dbApiServ.recargarWallet(2, res["idtransaction"], _idtdc, this._dbApiServ.g_idcliente, this.paymentAmount, 1, 0);
          
        //this.getTdcByClienteAndNro(this._dbApiServ.g_idcliente, this.creditcardnumber);
        
        /*        
        //Bloque de agregar la nueva tarjeta luego de haber cobrado con authorize 
        if(_nuevatdc){
            if(this.primaryccdata.length > 0){
              //Tiene primary card          
              this.agregarNuevaTarjeta(0);
            }                           
            else{
              //No tiene primary card          
              this.agregarNuevaTarjeta(1);
            } //Fin if(this.primaryccdata.length > 0)
        }//fin if(_nuevatdc)        
        //Fin bloque de agregar la nueva tarjeta luego de haber cobrado con authorize 
        */
        
        this.process = false;
      }            

      
  }, err =>{
  
      console.log(err.message);   
      this.authorizefinish = true;
      this.process = false;     
      //this.terminarespera();
      alert("Error making Authorize payment.");

    // this.back();         
  });
 
}//Fin pagoAuthorizenet_B() 

pagoAuthorizenet(){
  
      var ok: boolean;
      var auxtdc: string = "";
     
      auxtdc = this.creditcardnumber.replace(/-/gi, '');
            
      if(this.process){
        alert("Operation in progress...");
      }
      else{
        ok = true;
        /*if(auxtdc.length < 16){
          alert("Invalid credit card length");
          ok = false;
        }
        else*/
        if(this.month.length < 2){
          this.month = "0" + this.month;        
        }
        else
        if((parseInt(this.month) == 0) || (parseInt(this.month) > 12)){
          alert("Invalid month.");
          ok = false;
        }
        else
        if(this.year.length < 4){
          alert("Invalid year length");
          ok = false;
        }
        else
        if((parseInt(this.year) == 0)){
          alert("Invalid year.");
          ok = false;
        }
        else
        if(this.cvv.length < 3){
          alert("Invalid cvv length");
          ok = false;
        }
                        
        if(ok){       
          //////////////////////
          this.process = true;
                    
          this._dbApiServ.getExistTdc(this.creditcardnumber).then(
              res => {
                  console.log(res);
                  this.tdc_data = res;                  
                  if(!(this.tdc_data == null)){  
                      //alert("Dsitinto de null: " + this.tdc_data[0]["id_cliente"]);                    
                      if(this.tdc_data.length > 0){                                                
                          if(this.tdc_data[0]["id_cliente"] == this._dbApiServ.g_idcliente){                                                    
                            this.pagoAuthorizenet_B(auxtdc, false, this.tdc_data[0]["id"]);                        
                          }
                          else{
                            this.process = false;
                            //La tarjeta pertenece a un cliente                            
                            alert("Credit card not allowed.");
                          }
                      }//fin if(this.tdc_data.length > 0)
                      else{                    
                        //9999999999999  this.pagoAuthorizenet_B(auxtdc, true);
                        
                           //Bloque de agregar la nueva tarjeta luego de haber cobrado con authorize 
                            
                            if(this.primaryccdata.length > 0){
                              //Tiene primary card                                        
                              this.agregarNuevaTarjeta(auxtdc, 0);                                                            
                            }                           
                            else{
                              //No tiene primary card                                  
                              this.agregarNuevaTarjeta(auxtdc, 1);                              
                            } //Fin if(this.primaryccdata.length > 0)
                       
                          //Fin bloque de agregar la nueva tarjeta luego de haber cobrado con authorize                                                   
                      }
                    }//Fin if(!(this.tdc_data == null))
                    else{                      
                      this.process = false;
                      alert("Credit card not exits.");
                    }
              }, err =>{
              
                console.log(err.message);          
                this.process = false;
                alert("Error searching credit card data.");          
                // this.back();         
              });
  
        }//Fin ok
      }//Fin else process
  
    }// Fin pagoAuthorize


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
_onChangeCreditCardNumber() {
  if(this.creditcardnumber.length == 0){
     this.year = "";
     this.month = "";
     this.cvv = "";
  }
  else       
  if(this.creditcardnumber.length == 4){
    this.creditcardnumber = this.creditcardnumber + "-";        
  }
  else
  if((this.creditcardnumber.length > 4) && (this.creditcardnumber.length == 9)){
    this.creditcardnumber = this.creditcardnumber + "-";        
  }
  else
  if((this.creditcardnumber.length > 9) && (this.creditcardnumber.length == 14)){        
    this.creditcardnumber = this.creditcardnumber + "-";
    
  }
  
}//Fin _onChangeTarjeta


//Encontrar data primary credit card
getPrimaryCreditCard(idcliente){  
  var auxmonth: String = "";
    
  this._dbApiServ.getPrimaryTdcByCliente(idcliente).then(    
    res => {
        console.log(res);
        
        this.primaryccdata = res;
        if(this.primaryccdata.length > 0){
          //Desactivar elementos
          this.activa_Desactiva_Elementos(true);

          this.creditcardnumber = this.primaryccdata[0]["nro_tarjeta"];
          
          this.year = this.primaryccdata[0]["codigo1"].toString();

          this.month = this.primaryccdata[0]["codigo2"].toString();
          if(this.month.length < 2){
            this.month = "0" + this.month;
          }

          this.cvv = this.primaryccdata[0]["codigo_seguridad"];          

          this.zipcode = this.primaryccdata[0]["zipcode"];;
          this.name = this.primaryccdata[0]["nombre"];;
          this.lastname = this.primaryccdata[0]["apellido"];;

  
          this._dbApiServ.g_numbercc = this.creditcardnumber;
          this._dbApiServ.g_yearcc = this.year;
          this._dbApiServ.g_monthcc = this.month;
          this._dbApiServ.g_cvv = this.cvv;

          this._dbApiServ.g_nameclient  = this.name;
          this._dbApiServ.g_lastnameclient  = this.lastname;
          this._dbApiServ.g_zipcodeclient  = this.zipcode;  
            
        }// Fin if(this.primaryccdata.length > 0)
        else{
          //Activar elementos
          this.activa_Desactiva_Elementos(false);
        }
                
    }, err =>{
    
        console.log(err.message);          
        this.activa_Desactiva_Elementos(false);
        alert("Error searching for primary credit card data.");

      // this.back();         
    });
  
}//Fin getPrimaryCreditCard

//Obtener los datos de la tarjeta por cliente y nro tarjeta
/*
getTdcByClienteAndNro(_idcliente, _nrotarj){  

  this._dbApiServ.getTdcByClienteAndNro(_idcliente, _nrotarj).then(
    res => {
        console.log(res);
        
        this.tdc_data = res;
        
        if(!(this.tdc_data.length > 0)){  
          if(this.primaryccdata.length > 0){
            //Tiene primary card
            this.agregarNuevaTarjeta(0);
          }                           
          else{
            //No tiene primary card
            this.agregarNuevaTarjeta(1);
          } //Fin if(this.primaryccdata.length > 0)
          
        }//Fin if(!(this.tdc_data.length > 0))
        
                
    }, err =>{
    
        //this.presentAlert("Error consulting data.");
        alert("Error consulting data.");
        console.log(err.message);
        this.back_home();
        
    });

}// Fin getTdcByClienteAndNro()
*/

/**
 * Agregar nueva tarjeta de crédito
 */
agregarNuevaTarjeta(_auxtdc, _primarycard){
     
      let datos = { idcliente: this._dbApiServ.g_idcliente, tarjeta: this.creditcardnumber, 
                    codigo1 : this.year, codigo2 : this.month, cod_seg : this.cvv, primarytdc: _primarycard,
                    namecli: this.name, lastnamecli: this.lastname, zipcodecli: this.zipcode}
                                  
      this._dbApiServ.nuevaPayment(datos).then(
        res => {
            console.log(res);
           
            if(!(res["Exito"])){   
              //Error agregando nueva tarjeta           
              this.process = false;
              alert("Error: " + res["Detalle"]);
            }
            else{            
              this.pagoAuthorizenet_B(_auxtdc, true, res["Id_Tdc"]);
            }
        }, err =>{
                       
          //this.presentAlert("Error recording data.");
          console.log(err.message);
          this.process = false;
          alert("Error adding new credit card. Details: " + err.message)          
        });            
}//agregarNuevaTarjeta(){


//Ir a escoger tarjeta de crédito
allCreditCard(){
  this._dbApiServ.g_autorize_creditcar_list = true;  
  this._route.navigateByUrl('updatecreditcards');
}
  
//Crear loadingcontroller
async esperar(){
  this.loading = await this._loadingCtrl.create({spinner: 'bubbles'});
  this.loading.present();    
}

//Destruir loading controller
terminarespera(){       
  this.loading.dismiss();    
}


cobrocreditcardsubmit(form){
  //
}


//Regresar
back(){
  this._dbApiServ.g_numbercc = "";
  this._dbApiServ.g_yearcc = "";
  this._dbApiServ.g_monthcc = "";
  this._dbApiServ.g_cvv = "";

  this._dbApiServ.g_nameclient  = "";
  this._dbApiServ.g_lastnameclient  = "";
  this._dbApiServ.g_zipcodeclient  = "";  
  
  this._route.navigateByUrl('recargawallet');
    
}

back_home(){
  this._route.navigateByUrl('');
}

}//Fin class Authorize
