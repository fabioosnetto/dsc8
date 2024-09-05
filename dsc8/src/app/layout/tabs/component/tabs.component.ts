import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Params, Router, RouterModule } from '@angular/router';
import { TabsService } from '../tabs.service';
import { Tab } from '../tab.class';
import { filter } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class TabsComponent implements OnInit, OnDestroy {

  public tabs: Array<Tab>;
  public currentTab: Tab;

  constructor(
    private _tabsService: TabsService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _cdr: ChangeDetectorRef
  ) {
    this.tabs = [];
    this.currentTab = new Tab();

    // subscribes to the external tabs changes
    this._tabsService.tabsUpdates$.subscribe(t => {
      this.tabs = t.length ? t : Array.of(new Tab());
      this.currentTab = this.tabs?.filter(t => t.path === this._router.url.split('?')[0])[0] || new Tab();
      this._cdr.detectChanges();
    });
  }

  ngOnInit(): void {
    this._updateTabs(this._router.url.split('?')[0], this._route.snapshot.queryParams);
    this._updateTabsOnRouteChange();
  }

  ngOnDestroy(): void {
  }



  //---
  /**
   * 
   */
  private _updateTabsOnRouteChange(): void {
    // Subscribe to route changes
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {

      const route     = (event as NavigationEnd).url.split('?')[0];
      const qryParams = this._route.snapshot.queryParams;

      // update tabs
      if(route.split('/').indexOf('abas') >= 0) this._updateTabs(route, qryParams);
    });
  }

  //---
  /**
   * 
   * @param currRoute 
   */
  private _updateTabs(currRoute: string, qryParams: Params): void {
    this._tabsService.addTab(new Tab(currRoute, qryParams, currRoute, null), false);
    this.tabs = this._tabsService.getTabs();
    this.currentTab = this.tabs.filter(t => t.path === currRoute)[0];
  }

  //---
  /**
   * 
   * @param tab 
   * @returns 
   */
  public removeTab(tab: Tab): void {
    const tabIndex = this.tabs.indexOf(tab); // tab index for redirection

    // remove tab
    const newTabs = this._tabsService.removeTab(tab);
    this.tabs = newTabs; // save new tabs after deletion

    this.currentTab = tabIndex >= this.tabs.length ? this.tabs[tabIndex-1] : this.tabs[tabIndex]; // get new current tab
  }

  //--- Redirect to Tab
  public redirectToTab(tab: Tab): void {
    this._tabsService.redirectToTab(tab);
  }
}
