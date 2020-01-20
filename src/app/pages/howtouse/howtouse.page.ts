import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-howtouse',
  templateUrl: './howtouse.page.html',
  styleUrls: ['./howtouse.page.scss'],
})
export class HowtousePage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  

  back(){
    this.router.navigateByUrl("support-page");       
  }


}
