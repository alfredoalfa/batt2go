import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { EmailserviceService } from '../../services/emailservice.service';
import { DbapiService } from '../../services/dbapi.service';

@Component({
  selector: 'app-sendmail',
  templateUrl: './sendmail.page.html',
  styleUrls: ['./sendmail.page.scss'],
})
export class SendmailPage implements OnInit {

  subject: string = "";
  content: string = "";
  to: string = "";

  constructor(private _router: Router, private _emailService: EmailserviceService, private _dbService: DbapiService) {
    
   }

  ngOnInit() {
    this.to = this._dbService.g_email_support;
  }

  ionViewDidEnter() { 

  }

  send(){
    
    if(this.subject.length == 0){
      alert("Type your subject.");
    }
    else
    if(this.content.length == 0){
      alert("Type your body content.");
    }
    else{      
      //this.to = this._dbService.g_email_support;
      this._emailService.sendEmail(this.to, "", this.subject, this.content); 
    }
    

    
  }

  back(){
    this._router.navigateByUrl("support-page");       
  }

}//Fin class
