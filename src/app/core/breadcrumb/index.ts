import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

import { NzBreadCrumbModule } from 'ng-zorro-antd';

import { EwBreadcrumbComponent } from './component/breadcrumb.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NzBreadCrumbModule
  ],
  exports: [EwBreadcrumbComponent],
  declarations: [
    EwBreadcrumbComponent,
  ],
})
export class BreadcrumbModule { }
