import { NgModule } from '@angular/core';
import { TestComponent } from './test.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: '',
  component: TestComponent,
  data: {
    breadcrumb: {
      title: '我是testModule',
    }
  }
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  declarations: [TestComponent],
})
export class TestModule { }
