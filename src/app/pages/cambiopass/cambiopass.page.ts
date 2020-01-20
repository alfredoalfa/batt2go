import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { DbapiService } from '../../services/dbapi.service';


@Component({
  selector: 'app-cambiopass',
  templateUrl: './cambiopass.page.html',
  styleUrls: ['./cambiopass.page.scss'],
})
export class CambiopassPage implements OnInit {

  email: string;
  oldpass: string;
  newpass: string;
  idcliente;

  constructor(private _router: Router, private _dbApiServ: DbapiService, 
    private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
        
    this.idcliente = this._dbApiServ.g_idcliente;
    this.email = "";
    this.oldpass = ""
    this.newpass = "";
         
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
  }


  async presentAlertConfirm(_form) {
    const alert = await this.alertCtrl.create({
      header: 'Batt2go',
      message: '<strong>Update Password?</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm yes');
          
            let datos = { orden: 1, idcliente: this.idcliente, email: _form.value.email, oldpass : _form.value.oldpass, newpass: _form.value.newpass};
            
            this._dbApiServ.upDatePass(datos).then(
              res => {
                  console.log(res);
                  this.presentAlert("Your password has been updated.");  
                  this._router.navigateByUrl("");
              }, err =>{
              
                this.presentAlert("An error has occurred.");
                  console.log(err.message);
              });
            
            
          }
        }
      ]
    });

    await alert.present();
  }


  cobrocreditcardsubmit(_form){        
    if(!(this.idcliente == null)){      
      this.presentAlertConfirm(_form);
    }
       
  }


  cambiarpass(form){
    //
  }


 back(){
    this._router.navigateByUrl("setting");       
 }


}//Fin Class
