import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit {

  constructor( private router: Router ) {
    this.router.events
    .filter( event => event instanceof ActivationEnd )
    .filter( (event: ActivationEnd) => event.snapshot.firstChild === null )
    .subscribe( event => {
        console.log(event);
      });
  }

  ngOnInit() {
  }

}
