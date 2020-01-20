import { Component, OnInit } from '@angular/core';
import { DbapiService } from '../../services/dbapi.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-verificaruser',
  templateUrl: './verificaruser.page.html',
  styleUrls: ['./verificaruser.page.scss'],
})
export class VerificaruserPage implements OnInit {

  pass: string= "";
  cliente: any;

  constructor(private _router: Router, private _dbService: DbapiService, 
    private _loadingCtrl: LoadingController,
    private _alertCtrl: AlertController) { 

  }

  ngOnInit() {
    this.pass = "";
    this.cliente = null;
  }

  async presentAlert(_message: string) {
    console.log("Alert msg");
    const alert = await this._alertCtrl.create({
      header: "BATT2GO",
      subHeader: "",
      message: _message,
      buttons: ['OK']
    });

    await alert.present();
  }//present Alert

  async verificarUser(){
    
    let datos = { email: this._dbService.g_email, password: this.pass};

    const loading = await this._loadingCtrl.create({spinner: 'bubbles'});
    loading.present();
    
    this._dbService.loginClient_2(datos).subscribe(
            data => {
              this.pass = "";
              console.log("Datos cliente ", data);
              this.cliente = data;
              loading.dismiss();              
            },
            error => {
              this.pass = "";
              console.log(error);                
              loading.dismiss();
              this.presentAlert(error)
            },
            () => {
        
              loading.dismiss();
              if(this.cliente.length == 0){                
                this.presentAlert("Invalid credentials.")                
              }
              else{                                            
                  this._router.navigateByUrl('updatecreditcards');
              }         
            }
        ) 
  } //fin verificarUser()

  back(){
      this._router.navigateByUrl('consultawallet');
  }

}
