import { Component } from '@angular/core';
import { TabsService } from '../../layout/tabs/tabs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tab } from '../../layout/tabs/tab.class';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private _tab: Tab;

  constructor(
    private _tabsService: TabsService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    // load page tab
    const tabPath = this._router.url.split('?')[0];
    const tabName = 'Home';

    this._tabsService.addTab(new Tab(tabPath, this._route.snapshot.queryParams, tabName));
    this._tab = this._tabsService.getTabByPath(tabPath);
  }
}
