import { Component, OnInit } from '@angular/core';

import { DbapiService } from '../../services/dbapi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.page.html',
  styleUrls: ['./history-page.page.scss'],
})
export class HistoryPagePage implements OnInit {
  idcliente;
  batthistory: any;
  wallethistory: any;

  constructor(private _dbService: DbapiService, private _router: Router) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    //Este es el original
    this.idcliente = this._dbService.g_idcliente;
    
    this.getHistoryByCliente();  
    //this.getwalletHistoryByCliente(); 
  }




 /**
 * Obtener elhistorail deactividades del cliente
 */
 getHistoryByCliente(){  
  
    this._dbService.getHistorialByCliente(this.idcliente).then(
        data => {
          console.log(data);      
          this.batthistory = data;          
        },
        error =>{
          console.error(error);
        }
    )
     
}//Fin getBatterysByCliente


/**
 * Obtener el historail wallet del cliente
 */
getwalletHistoryByCliente(){  
  
  this._dbService.getWalletHistorialByCliente(this.idcliente).then(
      data => {
        console.log(data);      
        this.wallethistory = data;
      },
      error =>{
        console.error(error);
      }
  )
   
}//Fin getBatterysByCliente


back(){
  this._router.navigateByUrl("");     
}


}//Fin clase
