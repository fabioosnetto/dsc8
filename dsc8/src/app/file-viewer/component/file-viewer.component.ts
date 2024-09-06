import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TabsService } from '../../layout/tabs/tabs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tab } from '../../layout/tabs/tab.class';
import { ConverterService } from '../../converter/service/converter.service';
import { FileClass } from '../../converter/classes/files/file.class';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrl: './file-viewer.component.css'
})
export class FileViewerComponent implements OnInit, OnDestroy {
  private _tab: Tab;

  private _originalFile: FileClass | null;
  private _modifiedFile: FileClass | null;
  public originalFile: { name: string, content: string } | null;
  public modifiedFile: { name: string, content: string } | null;

  private _subscriptions: Array<Subscription>;

  constructor(
    private _tabsService: TabsService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _converterService: ConverterService,
    private _cdr: ChangeDetectorRef
  ) {
    // load page tab
    const tabPath = this._router.url.split('?')[0];
    const tabName = this._router.url
    .split('?')[0]
    .split('/')
    .filter(v => v)
    .slice(-2).join('.');

    this._tabsService.addTab(new Tab(tabPath, this._route.snapshot.queryParams, tabName));
    this._tab = this._tabsService.getTabByPath(tabPath);

    // get files of the current tab
    this._originalFile = null;
    this._modifiedFile = null;
    this.originalFile = null;
    this.modifiedFile = null;
    this._updateAllFiles();

    // listen to file changes
    this._subscriptions = new Array();
    this._subscriptions.push(this._converterService.modifiedFiles$.subscribe(fg => {
      this._updateAllFiles();
      this._cdr.detectChanges();
    }));
  }


  ngOnInit(): void {
    if(!this._originalFile && !this._modifiedFile) this._tabsService.removeTab(this._tab);
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(s => s.unsubscribe());
  }


  private _updateAllFiles(): void {
    // get files of the current tab
    this._originalFile = this._converterService.getFileByName(this._tab.name);
    this._modifiedFile = this._converterService.getFileByName(this._tab.name, 'modified');
    this.originalFile = null;
    this.modifiedFile = null;
    if(this._originalFile) {
      const ofName = Object.keys(this._originalFile)[0];
      this.originalFile = { name: ofName, content: this._originalFile[ofName].content };
    }
    if(this._modifiedFile) {
      const mfName = Object.keys(this._modifiedFile)[0];
      this.modifiedFile = { name: mfName, content: this._modifiedFile[mfName].content };
    }
  }
}
