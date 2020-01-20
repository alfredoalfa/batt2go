import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';


@Component({
  selector: 'app-technical-faq',
  templateUrl: './technical-faq.page.html',
  styleUrls: ['./technical-faq.page.scss'],
})
export class TechnicalFaqPage implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit() {
  }


  back(){    
      this._router.navigateByUrl("support-page");         
  }

}
