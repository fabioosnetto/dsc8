import { ChangeDetectorRef, Injectable, OnDestroy } from '@angular/core';
import { Tab, ITabCache } from './tab.class';
import { Subject } from 'rxjs';
import { Router, UrlTree } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class TabsService implements OnDestroy {

  private readonly _tabsItemKey = 'dsc8-content-tabs-cache'; // tabs item key name

  public tabsUpdates$: Subject<Array<Tab>>;

  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object,
    private _router: Router
  ) {
    this.tabsUpdates$ = new Subject<Array<Tab>>();
  }

  ngOnDestroy(): void {
  }


  //--- Add Tab
  public addTab(tab: Tab, editWhenExistent: boolean = true): Array<Tab> {
    if(!isPlatformBrowser(this._platformId)) return []; // adds browser platform checking before using browser components

    const tabsCache = localStorage.getItem(this._tabsItemKey); // current tabs cache

    const tabs: Array<Tab> = tabsCache ? 
    (JSON.parse(tabsCache) as Array<any>)
    ?.filter(t => t)
    ?.map(t => new Tab(t as ITabCache))
    ?.filter(t => t) : [];
    if(tabs.filter(t => t.path === tab.path).length) return (editWhenExistent ? this.editTab(tab) : tabs); // if tab is existent on tabs, dont add
    
    // current tabs + tab to new tabs
    let newTabs: Array<Tab> = tabs;
    newTabs.push(tab);

    // save tabs cache
    localStorage.setItem(this._tabsItemKey, JSON.stringify(newTabs.map(t => t.tabCache)));
    this.tabsUpdates$.next(newTabs);
    return newTabs;
  }

  //--- Edit Tab
  public editTab(tab: Tab): Array<Tab> {
    if(!isPlatformBrowser(this._platformId)) return []; // adds browser platform checking before using browser components

    const tabsCache = localStorage.getItem(this._tabsItemKey); // current tabs cache

    const tabs: Array<Tab> = tabsCache ? 
    (JSON.parse(tabsCache) as Array<any>)
    ?.filter(t => t)
    ?.map(t => new Tab(t as ITabCache))
    ?.filter(t => t) : [];

    // require tab index to update
    const tabIndex = tabs.map((t, i) => {
      if(t.path === tab.path) return i;
      return null;
    }).filter(i => i !== null)[0];

    if(!tabIndex && tabIndex !== 0) return tabs; // if tab was not found on tabs, dont update anything

    // current tabs + tab to new tabs

    let newTabs: Array<Tab> = tabs;
    newTabs[tabIndex] = tab;

    // save tabs cache
    localStorage.setItem(this._tabsItemKey, JSON.stringify(newTabs.map(t => t.tabCache)));
    this.tabsUpdates$.next(newTabs);
    return newTabs;
  }

  //--- Get Tabs
  public getTabs(): Array<Tab> {
    if(!isPlatformBrowser(this._platformId)) return []; // adds browser platform checking before using browser components

    const tabsCache = localStorage.getItem(this._tabsItemKey); // current tabs cache
    const tabs: Array<Tab> = tabsCache ? 
    (JSON.parse(tabsCache) as Array<any>)
    ?.filter(t => t)
    ?.map(t => new Tab(t as ITabCache))
    ?.filter(t => t) : [];

    return tabs;
  }

  //--- Get Tab By Path
  public getTabByPath(url: UrlTree | string): Tab {
    if(!isPlatformBrowser(this._platformId)) return new Tab(); // adds browser platform checking before using browser components

    const tabsCache = localStorage.getItem(this._tabsItemKey); // current tabs cache
    const tabs: Array<Tab> = tabsCache ? 
    (JSON.parse(tabsCache) as Array<any>)
    ?.filter(t => t)
    ?.map(t => new Tab(t as ITabCache))
    ?.filter(t => t) : [];

    const path = typeof url == 'string' ? url : url.root.children['primary'].segments.map(segment => segment.path).join('/');
    return tabs.filter(t => t.path === path)?.[0] || new Tab();
  }

  //--- Remove Tab
  public removeTab(tab: Tab): Array<Tab> {
    if(!isPlatformBrowser(this._platformId)) return []; // adds browser platform checking before using browser components
    
    const tabsCache = localStorage.getItem(this._tabsItemKey); // current tabs cache

    const tabs: Array<Tab> = tabsCache ? 
    (JSON.parse(tabsCache) as Array<any>)
    ?.filter(t => t)
    ?.map(t => new Tab(t as ITabCache))
    ?.filter(t => t) : [];
    if(!tabs.filter(t => t.path === tab.path).length) return tabs; // if tab is existent on tabs, dont add

    // current tabs + tab to new tabs
    const tabIndex = tabs.findIndex(t => JSON.stringify(t) === JSON.stringify(tab)); // tab index for redirection
    let newTabs: Array<Tab> = tabs.filter(t => t.path !== tab.path);

    // save tabs cache
    localStorage.setItem(this._tabsItemKey, JSON.stringify(newTabs.map(t => t.tabCache)));

    // redirect to an existent tab
    if(!tabs.length) this._router.navigateByUrl('/tab');
    else {
      const currentTab = tabIndex >= newTabs.length ? newTabs[tabIndex-1] : newTabs[tabIndex]; // get new current tab
      this.redirectToTab(currentTab); // redirect to new current tab
    }

    this.tabsUpdates$.next(newTabs);
    return newTabs;
  }

  //--- Redirect to Tab
  public redirectToTab(tab: Tab): void {
    this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this._router.navigate([tab.path], { queryParams: tab.qryParams })
    });
  }
}
