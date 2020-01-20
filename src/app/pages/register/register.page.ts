import { Component, OnInit} from '@angular/core';
import { Router} from '@angular/router'

import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';



import { DbapiService } from '../../services/dbapi.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  errorMessage: string = '';
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  passconf: string;
  cliente: any;

  loading;
    

   
  constructor(
    private router:  Router, private dbApiServ: DbapiService,
    private alertCtrl: AlertController,
    private _loadingCtrl: LoadingController)
    {  }

  ngOnInit() {
  
  }

  ionViewDidEnter() {
    this.dbApiServ.g_registro = false;    
    if(!(this.dbApiServ.g_terminosandc)){
      this.email = "";
      this.password = "";
      this.passconf = "";
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


  
  /////Fin bloque alert

 registerClient2(form){
  if(form.value.email === ""){
    this.presentAlert("Enter email.");
  }
  else     
  if(form.value.pass === ""){        
    this.presentAlert("Enter password.");
  }
  else{
    this.dbApiServ.g_email_reg = form.value.email;
    this.dbApiServ.g_pass_reg = form.value.pass;
    
    if(form.value.pass === form.value.passconf){
       this.getClienteExiste(form.value.email, form);
    }
    else{
      this.presentAlert("Password and password confirmation do not match.");
    }
  }

 }//registerCliente2
 
 
 

  //Verificar si existe cliente  
  async getClienteExiste(email, form){
    this.loading = await this._loadingCtrl.create({spinner: 'bubbles'});
    this.loading.present();

    
    this.dbApiServ.getClientebyemail(email).then(
      data => {
              
              console.log(data);
              this.cliente = data;
              
              if(this.cliente.length > 0){                
                this.loading.dismiss();
                alert("Warning: email already exists.");                
              }
              else{                
                //this.crearCliente(form)   
                this.loading.dismiss();       
                this.dbApiServ.g_registro = true;
                this.router.navigateByUrl('aboutus');
              }
      },
      error => {
        console.log(error);    
        this.loading.dismiss();    
        alert("An attempt to create a new account failed..");                
      }
    )
  }//Fin getClienteExiste
  //////


  registersubmit(form){
    //
  }

  back(){
    this.router.navigateByUrl('login');
  }


}//Fin Class
