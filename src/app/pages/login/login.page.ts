import { Component, OnInit } from '@angular/core';

import { Router } from  "@angular/router";

import { AlertController, LoadingController } from '@ionic/angular';

import { DbapiService } from '../../services/dbapi.service';






@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  errorMessage: string = '';
  email: string;
  password: string;
  //cliente: any[];
  cliente: any;
  batterycliente: any;
    

  constructor(
              private _router:  Router,
              private _dbApiServ: DbapiService,
              private _loadingCtrl: LoadingController,
              private _alertCtrl: AlertController                         
              ) 
  {
    

   }

    
  ngOnInit() {
   
  }

  ionViewDidEnter() {
    this.email = "";
    this.password = "";
    this._dbApiServ.g_terminosandc = false;

    
    //El cliente está loguedo
    if(!(this._dbApiServ.g_idcliente == null)){
      this._router.navigateByUrl('');
    }
  }

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

  

  async loginClient_2(form){          
    
    if(form.value.email === "")
    {      
      this.presentAlert("Enter Email.")
    }
    else
    if(form.value.password === ""){      
      this.presentAlert("Enter Password")
    }
    else{
        const loading = await this._loadingCtrl.create({spinner: 'bubbles'});
        loading.present();
    
        this._dbApiServ.loginClient_2(form.value).subscribe(
            data => {
              console.log("Datos cliente ", data);
              this.cliente = data;
              loading.dismiss();
              
            },
            error => {
              console.log(error);                
              loading.dismiss();
              this.presentAlert("Error while logging.")
            },
            () => {
              loading.dismiss();
              if(this.cliente.length == 0){                
                this.presentAlert("Invalid credentials.")
              }
              else{                                                      
                  this._dbApiServ.g_idcliente = this.cliente[0]["id"];
                  this._dbApiServ.g_email = this.cliente[0]["email"];
                  this._dbApiServ.g_nombrecliente = this.cliente[0]["nombre"] + " " + this.cliente[0]["apellido"]

                  //Almacenar localmente credenciales
                  window.localStorage.setItem("btt2go_iduser", this.cliente[0]["id"]);
                  window.localStorage.setItem("btt2go_email", this.cliente[0]["email"]);
                  window.localStorage.setItem("btt2go_nombre", this.cliente[0]["nombre"]);

                                                      
                  /*if(this._dbApiServ.g_login_accion == 0){
                    this._router.navigateByUrl('');
                  }
                  else*/
                  if(this._dbApiServ.g_login_accion == 1){ 
                    
                    this._router.navigateByUrl('history-page');
                  } 
                  else
                  if(this._dbApiServ.g_login_accion == 2){                   
                    
                    this._router.navigateByUrl('payment-page');
                    
                  }
                  else
                  if(this._dbApiServ.g_login_accion == 3){
                    
                    this._router.navigateByUrl('support-page');
                  }
                  else
                  if(this._dbApiServ.g_login_accion == 4){                    
                    
                    this._router.navigateByUrl('setting');
                  
                  }
                  else
                  if(this._dbApiServ.g_login_accion == 5){                
                    //this._dbApiServ.g_login_accion = 0;
                    
                    //this.getBatterysByCliente()
                    this.rentar_batt();
                  }
                  else
                  if(this._dbApiServ.g_login_accion == 6){                
                    
                    this._router.navigateByUrl('consultawallet');
                  }
                  else{
                    this._router.navigateByUrl('');                    
                  }
              }         
            }
        )
    }//fin else
}//registerClient
  
  registerPage(){    
    
    this._router.navigateByUrl("/register");
  }
     
 //Ir a retan batería
 rentar_batt(){    
  if(!(this._dbApiServ.g_idcliente == null)){
    this._dbApiServ.g_opcion = 1; 
                   
    this._router.navigate(['']);      

  }
}//rentar_batt()


//Metódo para hacer login por facebook
loginfacebook(){
  alert("In construction.");
}


resetPassword(_idcliente){
      let datos = { idcliente: _idcliente};
      
      this._dbApiServ.recuperaPass(datos).then(
        data => {         
          console.log(data)
          
          if(data["Exito"]){
            alert("Your password will be sent to your email account.");
          }
          else{
            alert("Error: " + data["Detalle"])  
          }
          
        },
        error => {
          console.log('Error: ' + Error);
          alert("Error: " + Error)
        } 
      )    
}//Fin recuperaPass

verificaEmail(){
    if(this.email === ""){
      alert("Please enter your email");
    }
    else{
            
      this._dbApiServ.getClientebyemail(this.email).then(
        data => {
                
                console.log(data);
                this.cliente = data;
                
               if(this.cliente.length > 0){                                                   
                  this.resetPassword(this.cliente[0]["id"]);
                }
                else{                
                  alert("Email account does not exist.");
                }
        },
        error => {
          console.log(error);    
          
          alert("Error: " + error);                
        }
      )      
    }
}//verificaEmail


loginsubmit(form){
  //
}


back(){
  this._router.navigateByUrl("");
     
}


}//Fin loginPage
