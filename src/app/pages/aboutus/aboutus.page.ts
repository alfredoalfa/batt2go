import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { LoadingController, AlertController } from '@ionic/angular';

import { DbapiService } from '../../services/dbapi.service';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.page.html',
  styleUrls: ['./aboutus.page.scss'],
})
export class AboutusPage implements OnInit {
  tandc: boolean; //Para control de checkbox términos y condiciones
  idclient;

  cliente;
  loading;

  constructor(private _router: Router, private _dbservice: DbapiService, private alertCtrl: AlertController,
    private _loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    
    this.tandc = false;
    
    this.idclient = this._dbservice.g_idcliente;
         
  }

  aceptarTermsandConditions(){
       
    if(this.tandc){
      this.crearCliente();
    }
    
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


  /**
  * Crear Nuevo Cliente
  */
 async crearCliente(){
  
  let datos = { email: this._dbservice.g_email_reg, pass: this._dbservice.g_pass_reg, nombre: "*", apellido: "*", docid: this._dbservice.g_email_reg, telf: "*", ref: ""};  
  
  this.loading = await this._loadingCtrl.create({spinner: 'bubbles'});
  this.loading.present();

  this._dbservice.createClient(datos).subscribe(
    data => {
      console.log("Cliente creado. ", data);      
    },
    error => {
      console.log(error);
     // this.loading.dismiss();
      this.loading.dismiss();
      this.presentAlert("Error creating account");
    },
    () => {
    
      //this.loading.dismiss();
               
      this.autologin(this._dbservice.g_email_reg);
      
    }

)//fin dbApiServ

}//Fin Crear Cliente



//Ingresar, automáticamente, al sitema con las credenciales del nuevo cliente
autologin(email){
    
  this._dbservice.getClientebyemail(email).then(
    data => {
            
            console.log(data);
            this.cliente = data;
            
            if(this.cliente.length > 0){
               this.loading.dismiss();

               this._dbservice.g_idcliente = this.cliente[0]["id"];
               this._dbservice.g_email = email;
               this._dbservice.g_nombrecliente = this.cliente[0]["nombre"] + " " + this.cliente[0]["apellido"];

               //Almacenar localmente credenciales
               window.localStorage.setItem("btt2go_iduser", this.cliente[0]["id"]);
               window.localStorage.setItem("btt2go_email", this.cliente[0]["email"]);
               window.localStorage.setItem("btt2go_nombre", this.cliente[0]["nombre"]);
                                                 
               this._router.navigateByUrl(''); 
            }
            else{
              this.loading.dismiss();
              alert("Error to login.");
              this._router.navigateByUrl('/login');
            }
    },
    error => {
      console.log(error);
      this.loading.dismiss();
      alert("Error to login.");
      this._router.navigateByUrl('/login');
      
    }
  )
}//Fin Autologin



  back(){
    if(this._dbservice.g_registro){
      this._dbservice.g_registro = false;
      this._router.navigateByUrl("register");         
    }
    else{
      this._router.navigateByUrl("support-page");       
    }
    
  }



 }//Fin Class
