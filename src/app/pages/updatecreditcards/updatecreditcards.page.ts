import { Component, OnInit } from '@angular/core';
import { DbapiService } from '../../services/dbapi.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-updatecreditcards',
  templateUrl: './updatecreditcards.page.html',
  styleUrls: ['./updatecreditcards.page.scss'],
})
export class UpdatecreditcardsPage implements OnInit {

  objcreditcards;

  constructor(private _dbService: DbapiService, private _route: Router) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this._dbService.g_updatecc = false;
    
    this.getCreditCardsByCliente();
  }
  

    /**
   * Obtener las tarjetas asociadas a un cliente
   */ 
getCreditCardsByCliente(){    
  var aux_objcreditcards: any = [];
  var aux_tdc: string;
  var aux_cvv: string;
  
  this._dbService.getCreditCardByCliente(this._dbService.g_idcliente).then(  
    data => {     
      console.log(data);      
               
      this.objcreditcards = data;
       
      if(this.objcreditcards.length == 0){
        
         this.objcreditcards = [] ;
         
      }      
      else{
        //Nuevo        
        for(let i = 0; i <= this.objcreditcards.length - 1; i++){
            aux_tdc = this.objcreditcards[i]["nro_tarjeta"].replace(/-/gi, ' ')                 
            aux_tdc = aux_tdc.replace(/\d{4}(?= \d{4})/g, "****");             

            aux_cvv = this.objcreditcards[i]["codigo_seguridad"].toString().replace(/[0-9]/g, '*')

            aux_objcreditcards.push({       
                              id: this.objcreditcards[i]["id"],                
                              nro_tarjeta : this.objcreditcards[i]["nro_tarjeta"], 
                              nro_tarjeta_b : aux_tdc, 
                              codigo1 : this.objcreditcards[i]["codigo1"],
                              codigo2 : this.objcreditcards[i]["codigo2"], 
                              codigo_seguridad : this.objcreditcards[i]["codigo_seguridad"], codigo_seguridad_b: aux_cvv,
                              principal : this.objcreditcards[i]["principal"], nombre : this.objcreditcards[i]["nombre"],
                              apellido : this.objcreditcards[i]["apellido"],  zipcode : this.objcreditcards[i]["zipcode"] });            
        }

        this.objcreditcards = aux_objcreditcards;
      }
      
    },
    error =>{
          //  loading.dismiss();
          //Mensaje de error o de no encontrar la base
          console.log("Error: Searching credit cards by client.");
          ///this.tipospago = [];
    }
  )
}//getCreditCardsByCliente()

//Actualizar credit card
updatecc(id, tarjeta, tarjeta_b, year, month, cvv, principal, name, lastname, zipcode){  
    
  this._dbService.g_idcc = id;
  this._dbService.g_numbercc = tarjeta;
  this._dbService.g_numbercc_b = tarjeta_b;
  this._dbService.g_yearcc = year;
  this._dbService.g_primarytdc = principal
 
  this._dbService.g_nameclient = name;
  this._dbService.g_lastnameclient = lastname;
  this._dbService.g_zipcodeclient = zipcode;

  this._dbService.g_monthcc = month.toString();

  if(this._dbService.g_monthcc.length < 2){
    this._dbService.g_monthcc = '0' + this._dbService.g_monthcc;
  }
 
  this._dbService.g_cvv = cvv;

  if(this._dbService.g_autorize_creditcar_list){
    //Ir a pago autorize
    this._route.navigateByUrl('authorize');      
  }
  else{
    //Se trata de actualizar tarjeta
    this._dbService.g_updatecc = true;
    this._route.navigateByUrl('payment-page');      
  }
  
}


back(){
  
  if(this._dbService.g_autorize_creditcar_list)
  {    
    this._route.navigateByUrl('authorize');
  }
  else{
    this._route.navigateByUrl("consultawallet");
  }
}

}//Fin class
