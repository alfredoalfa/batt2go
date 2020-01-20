import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { DbapiService } from '../../services/dbapi.service';

@Component({
  selector: 'app-support-page',
  templateUrl: './support-page.page.html',
  styleUrls: ['./support-page.page.scss'],
})
export class SupportPagePage implements OnInit {

  supports: any;  

  constructor(private _router: Router, private _dbService: DbapiService) {
        this.supports = [
          {"id":1, "descrip":'How To Use'},
          //{"id":2, "descrip":'Payment Details'},
          {"id":2, "descrip":'Technical Faq'},
          {"id":3, "descrip":'Contact Us'},      
          {"id":4, "descrip":'Report Bug'},
          {"id":5, "descrip":'Terms & Conditions'}           
        ];

   }

  ngOnInit() {
  }


  itemSelected(id){    
    if(id == 1){
      this._router.navigateByUrl('howtouse');  
    }
    else
    if(id == 2){
      this._router.navigateByUrl('technical-faq');    
    }
    else
    if(id == 3){
      this._dbService.g_email_support =  "support@batt2go.com";  
      this._router.navigateByUrl('sendmail');      
    }
    else
    if(id == 4){ 
      this._dbService.g_email_support = "support@batt2go.com";
      this._router.navigateByUrl('sendmail');      
    }
    if(id == 5){
      this._router.navigateByUrl('aboutus');    
    }
    
    
  }

  back(){
    this._router.navigateByUrl("");
       
  }


}//Fin Clase

