import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { DbapiService } from '../../services/dbapi.service';


@Component({
  selector: 'app-recargawallet',
  templateUrl: './recargawallet.page.html',
  styleUrls: ['./recargawallet.page.scss'],
})
export class RecargawalletPage implements OnInit {
 walletsdefault: any;
 listopcionrecarga;
 selected_recarga = -1;
 coupon: string = "";
 datacoupon: any;

 process: boolean = false;
 
  constructor(private route: Router, private dbApiServ: DbapiService) {
    
    this.listopcionrecarga = [
      /*{"id":1, "valor":"5.00",  "descripcion":"$5.00"},
      {"id":2, "valor":"10.00", "descripcion":"$10.00"},
      {"id":3, "valor":"15.00", "descripcion":"$15.00"},
      {"id":4, "valor":"20.00", "descripcion":"$20.00"},
      {"id":5, "valor":"0",  "descripcion":"Coupon"}*/

      {"id":1, "valor":"4.99",  "descripcion":"$4.99"},
      {"id":2, "valor":"9.99", "descripcion":"$9.99"},
      {"id":3, "valor":"14.99", "descripcion":"$14.99"},    
      {"id":5, "valor":"0",  "descripcion":"Coupon"}
    ];


  }

  ngOnInit() {
  }


  ionViewDidEnter() {
    
    this.dbApiServ.getWalletsdefault();
  }// Fin ionViewDidEnter


  getWalletsdefault(){
    
    this.dbApiServ.getWalletsdefault().then(
      data => {
        console.log(data);      
        this.walletsdefault = data;
      },
      error =>{
            
            console.log(error)
            this.walletsdefault = [];
      }
    )
  }//Fin getWalletsdefault()

 

  recargarCredito(){ 
    
    if(this.process){
      alert("Operation in progress...");
    } 
    else      
    if(this.selected_recarga == -1){
      //alert("Debe elegir una opción");
      alert("Choose Option");
    }
    else
    if(this.selected_recarga == 0){
      this.coupon = this.coupon.trim();
     // alert(this.coupon);
      if(this.coupon === ""){
        alert("Enter coupon code");
      }
      else{        
        this.verificacoupon(this.coupon);
      }        
    }
    else{
      //opcion: 2. Indica que se sumará monto al wallet
      this.dbApiServ.g_recargawallet = this.selected_recarga;

      //Esta opción es fija, por ahora
      //this.route.navigateByUrl('pago-stripe');   
      this.route.navigateByUrl('authorize');   
      
    }

  }//Fin recargaCredito2

  

  verificacoupon(_coupon){

    this.dbApiServ.getDataByCoupon(_coupon).then(
      data => {
        console.log(data);  
        this.datacoupon = data;    
        if(this.datacoupon.length == 0){
          alert("Coupon does not exist.");
        }
        else{
          
          if(this.datacoupon[0]["estado"] == 0){
            alert("Inactive coupon");
          }
          else
          if(this.datacoupon[0]["periodovalido"] == 0){
            alert("Invalid Period Coupon.");
          }
          else
          if(this.datacoupon[0]["limitemax"] == 1){
            alert("Limit of use reached.");
          }
          else{            
            this.verificaCouponByCliente(_coupon, this.dbApiServ.g_idcliente, this.datacoupon[0]["valor"]);
          }
             
        }
        //this.walletsdefault = data;
      },
      error =>{            
            console.log(error)
            alert("Error: " + error);
           // this.walletsdefault = [];
      }
    )

  }//Fin verificacoupon(_coupon){

  //Verificar si el cliente ha usado el cupón
  //En caso de no haberelo usado, recargar wallet.
  verificaCouponByCliente(_coupon, _idcliente, _valorcupon){
    this.dbApiServ.getCouponByCliente(_coupon, _idcliente).then(
      data => {
        console.log(data);  
        this.datacoupon = data;    
        if(this.datacoupon.length == 0){         
          //this.recargarWallet(_coupon, _idcliente, _valorcupon);
          this.process = true;
         
          this.dbApiServ.recargarWallet(2, _coupon, _coupon, _idcliente, _valorcupon, 5, 1);
                             
        }
        else{
          alert("Used coupon.");             
        }
        //this.walletsdefault = data;
      },
      error =>{            
            console.log(error)
            alert("Error: " + error);
           // this.walletsdefault = [];
      }
    )
  }//verificaCouponByCliente()


 //Regresar
 back(){
   
  this.route.navigateByUrl('consultawallet');
  
}  
}//Fin Clase
