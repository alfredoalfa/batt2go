import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbapiService } from '../../services/dbapi.service';

import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {


  settings: any;
  idclient;
  nombreclient: String;
  email: string;
  version = "BATT2GO V-1.2.4";

  constructor(private _router: Router, private _dbService: DbapiService, private alertCtrl: AlertController) { 
    this.settings = [
      {"id":1, "name":"Change Password"},
      {"id":2, "name":"Logout"},
      {"id":3, "name":"Version"}
    ];

  }

  ngOnInit() {
  }


  ionViewDidEnter() {
    
    this.idclient = this._dbService.g_idcliente;
    this.email = this._dbService.g_email;
    this.nombreclient = this._dbService.g_nombrecliente;
             
  }


  async presentAlertConfirm_logout() {
    const alert = await this.alertCtrl.create({
      header: 'BATT2GO',
      message: '<strong>Confirm Logout?</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Logout Ok');
            this.idclient = null;
            this.nombreclient = null;
            this.limpiar_localstorage();
          
            this._dbService.limpiar_Variables_Globales();
            this._router.navigateByUrl("");                  
          }
        }
      ]
    });

    await alert.present();
  }


  //Acción de la lista
  itemSelected(item){       
    if(item == 1){
      //alert("Ir a cambio clave.");
      this._router.navigateByUrl("/cambiopass");
    }
    else
    if(item == 2){      
      this.presentAlertConfirm_logout();
    }
    else
    if(item == 3){
      alert(this.version);
    }
    
  }

  //Limpiar almacenamiento local de las credenciales.
  limpiar_localstorage(){
    localStorage.clear();
  }

  back(){
    this._router.navigateByUrl("");       
  } 



}//Fin Class
