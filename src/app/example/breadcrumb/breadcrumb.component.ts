import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'test-bread',
  template: `
    <ew-breadcrumb></ew-breadcrumb>
    <router-outlet></router-outlet>
  `
})

export class BreadComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}
