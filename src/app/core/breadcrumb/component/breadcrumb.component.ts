import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
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
  templateUrl: './breadcrumb.component.html',
})

export class EwBreadcrumbComponent implements OnInit, OnDestroy {
  rotueConfig: Routes;

  breadcrumbs: Breadcrumb[] = [];

  subscribes: Subscription[] = [];

  constructor(
    private router: Router,
    private currentRoute: ActivatedRoute,
  ) {
  }

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

    this.rotueConfig = this.router.config;
    const url = this.router.url;

    this.analyzeRotue(url.split('/'));
  }

  // analyze route to make breadcrumb
  analyzeRotue(urls: string[]) {

    if (!this.rotueConfig.length) {
      throw new Error('route isn\'t exist.');
    }
    let config = this.rotueConfig;
    let skipCount = 0;

    urls.filter(e => {
      if (!!e) {
        return true;
      } else {
        // filter the root route config
        let theRoute = this.rotueConfig.find(route => route.path === e);
        // if root route has redirectTo then use the redirectTo
        if (theRoute) {
          if (theRoute.children && theRoute.children.length) {
            config = theRoute.children;
          }

          if (theRoute.redirectTo) {
            theRoute = this.rotueConfig.find(route => route.path === theRoute.redirectTo);
          }
          if (this.isShowBreadcrumb(theRoute)) {
            this.addBreadcrumb(theRoute.data.breadcrumb, '');
          }
        }

        return false;
      }
    }).forEach((e, i) => {
      let theRoute = config.find(route => route.path === e);

      if (skipCount) {
        skipCount--;
        return;
      }
      if (!theRoute) {
        theRoute = config.find(route => route.path.startsWith(e) && route.path.includes(':'));
        skipCount = theRoute.path.split('').filter(chart => chart === ':').length;
      }

      /**
       * handle route
       * if `theRoute` has parent then reset parent route
       * then set the route and children
       */
      if (theRoute) {
        config = theRoute.loadChildren ? theRoute['_loadedConfig'].routes : theRoute.children;

        // if route children has empty route, then use empty route config
        if (config) {
          const emptyRoute = config.find(route => route.path === '');
          if (emptyRoute && emptyRoute.data && emptyRoute.data.breadcrumb) {
            theRoute = emptyRoute;
          }
        }

        if (this.isShowBreadcrumb(theRoute)) {
          // make parent breadcrumbs
          if (theRoute.data.breadcrumb.parent) {
            this.breadcrumbs = [];
            this.analyzeRotue(theRoute.data.breadcrumb.parent.split('/'));
          }
          this.addBreadcrumb(theRoute.data.breadcrumb, `/${urls.slice(1, i + 2).join('/')}`);
        }
      }

    });
  }

  // add breadcrumb
  addBreadcrumb(name: string, link: string) {
    this.breadcrumbs.push({
      title: this.showBreadName(name),
      link: link
    });
  }

  isShowBreadcrumb(route: Route) {
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

  navigateTo(link, params) {
    this.router.navigateByUrl(link, {queryParams: params});
  }
}
