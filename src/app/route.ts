import { Routes } from '@angular/router';
import { BreadComponent } from './example/breadcrumb/breadcrumb.component';

export const routes: Routes = [{
  path: '',
  data: {
    breadcrumb: '我是root'
  },
  redirectTo: 'test',
  pathMatch: 'full'
}, {
  path: 'test',
  component: BreadComponent,
  data: {
    breadcrumb: '我是1',
  },
  children: [{
    path: 'test',
    component: BreadComponent,
    data: {
      breadcrumb: {
        title: '我是1.1'
      }
    }
  }, {
    path: 'test2',
    component: BreadComponent,
    data: {
      breadcrumb: {
        title: '我是1.2'
      }
    }
  }, {
    path: 'forModule',
    loadChildren: 'app/example/testModule/test.module#TestModule',
    data: {
      breadcrumb: {
        title: '我是forModule',
        // skip: true,
        parent: '/test/test2'
      }
    }
  }]
}];
