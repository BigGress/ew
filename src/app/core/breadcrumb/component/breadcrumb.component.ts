import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, Routes, Route, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/toArray';

export interface Breadcrumb {
  title: string;
  link?: string;
  parent?: string;
  skip?: boolean;
  params?: any;
}

@Component({
  selector: 'ew-breadcrumb',
  template: `
  <nz-breadcrumb>
      <nz-breadcrumb-item *ngFor="let item of breadcrumbs">
          <a [routerLink]="[item?.link, item.params]">{{item.title}}</a>
      </nz-breadcrumb-item>
  </nz-breadcrumb>
  `
})

export class EwBreadcrumbComponent implements OnInit, OnDestroy {
  rotueConfig: Routes;

  breadcrumbs: Breadcrumb[] = [];

  subscribes: Subscription[] = [];

  constructor(
    private router: Router,
    private currentRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.makeBread();

    const routeChange = this.router.events
        .filter(e => e instanceof NavigationEnd)
        .subscribe(e => {
          this.makeBread();
        });

    this.subscribes.push(routeChange);
  }

  ngOnDestroy() {
    this.subscribes.forEach(e => e.unsubscribe());
  }

  makeBread() {
    this.breadcrumbs = [];

    this.rotueConfig = this.router.config || this.router['routerConfig'];
    const url = this.router.url;

    // console.log(this.currentRoute);

    this.analyzeRotue(url.split('/'));
  }

  // analyze route to make breadcrumb
  analyzeRotue(urls: string[]) {
    // console.log(urls);

    if (!this.rotueConfig.length) {
      throw new Error('route isn\'t exist.');
    }
    let config = this.rotueConfig;

    urls.filter(e => {
      if (!!e) {
        return true;
      } else {
        // filter the root route config
        const theRoute = this.rotueConfig.find(route => route.path === e);
        if (theRoute && this.isShowBreadcrumb(theRoute)) {
          this.addBreadcrumb(theRoute.data.breadcrumb, '');
        }

        return false;
      }
    }).forEach((e, i) => {
      let theRoute = config.find(route => route.path === e);

      /**
       * handle route
       * if `theRoute` has parent then reset parent route
       * then set the route and children
       */
      if (theRoute) {
        config = theRoute.loadChildren ? theRoute['_loadedConfig'].routes : theRoute.children;

        if (this.isShowBreadcrumb(theRoute)) {
          // make parent breadcrumbs
          if (theRoute.data.breadcrumb.parent) {
            this.breadcrumbs = [];
            this.analyzeRotue(theRoute.data.breadcrumb.parent.split('/'));
          }

          if (config) {
            const emptyRoute = config.find(route => route.path === '');
            if (emptyRoute) {
              if (!!emptyRoute.data.breadcrumb) {
                theRoute = emptyRoute;
              }
            }
          }
          this.addBreadcrumb(theRoute.data.breadcrumb, `/${urls.slice(1, i + 2).join('/')}`);
        }
      }

    });
  }

  // 添加面包屑
  addBreadcrumb(name: string, link: string) {
    this.breadcrumbs.push({
      title: this.showBreadName(name),
      link: link
    });
  }

  isShowBreadcrumb(route: Route) {
    // console.log(route);
    if (!route.data) {
      return false;
    }

    if (route.data.breadcrumb) {
      return !route.data.breadcrumb.skip;
    }
    return !!route.data.breadcrumb;
  }

  // show breadcrumb name
  showBreadName(name: string | Breadcrumb) {
    if (typeof name === 'string') {
      return name;
    } else {
      return name.title;
    }
  }
}
