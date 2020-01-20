import { Injectable } from '@angular/core';

import { EmailComposer } from '@ionic-native/email-composer/ngx';


@Injectable({
  providedIn: 'root'
})
export class EmailserviceService {

  constructor(private _email: EmailComposer) { }

  sendEmail(_to, _cc, _subject, _body){
    /*this._email.isAvailable().then((available: boolean) =>{
      if(available) {
        //Now we know we can send
        alert("Enviar.");
        
    
      }
      
     });*/
    
    
    let email = {
      to: _to,
      cc: _cc,
      bcc: [],
      attachments: [],
      subject: _subject,
      body: _body,
      isHtml: true,
      //app:"gmail"
    };

    this._email.open(email);
    
  }
}//Fin Class Emailservice
