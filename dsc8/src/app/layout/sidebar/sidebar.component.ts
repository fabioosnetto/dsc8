import { CommonModule } from '@angular/common';
import { Component, ComponentRef, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FileGroupClass } from '../../converter/classes/files/file-group.class';
import { ConverterService } from '../../converter/service/converter.service';
import { ContextMenuComponent } from '../../context-menu/context-menu.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class SidebarComponent {

  @ViewChild('choose_files', { static: false }) chooseFiles!: ElementRef<HTMLInputElement>;
  private _contextMenu!: ComponentRef<ContextMenuComponent>;
  
  public fileGroups: FileGroupClass | null;
  private _selectedFileGroup: FileGroupClass | null;

  constructor(
    private _router: Router,
    private _converterService: ConverterService,
    private _viewContainerRef: ViewContainerRef
  ) {
    this.fileGroups = null;
    this._selectedFileGroup = null;
  }

  // Add Files
  public addFiles() {
    this.chooseFiles.nativeElement.click();
  }
  // On Choose Files Input
  public async onChooseFilesInput() {
    const files = this.chooseFiles.nativeElement.files;
    if(!files) return;

    // assign inputed files to global file groups
    this.fileGroups = await FileGroupClass.fileListToFileGroup(files);
    this._converterService.files = this.fileGroups;
  }

  // See File
  public async seeFile(fileName: string): Promise<void> {
    const name = fileName.split('.').slice(0,-1).join('');
    const extension = fileName.split('.').pop();

    await this._router.navigateByUrl('/', { skipLocationChange: true }).then(async () => {
      await this._router.navigateByUrl(`/tab/${name}/${extension}`);
    });
  }


  public selectFileGroup(groupKey: string): void {
    if(!this.fileGroups) return;

    const fileGroup: FileGroupClass = {...this.fileGroups};
    Object.keys(fileGroup).forEach(k => { if(k !== groupKey) delete fileGroup[k]; })
    this._selectedFileGroup = fileGroup;
  }

  onFilesContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.toggleContextMenu(event.clientX, event.clientY);
  }

  // Toggle Options
  public toggleContextMenu(xPos: number, yPos: number): void {
    // close current context menu
    if(this._contextMenu) {
      this._contextMenu.instance.optionClicked$.unsubscribe();
      this._contextMenu.destroy(); 
    }

    // create the context menu
    this._contextMenu = this._viewContainerRef.createComponent(ContextMenuComponent);
    this._contextMenu.instance.xPos = xPos;
    this._contextMenu.instance.yPos = yPos;

    // set context menu options and listen to selected option
    this._contextMenu.instance.options = ['Convert', 'Download'];
    this._contextMenu.instance.optionClicked$.subscribe((v) => {
      const opt = v.toLowerCase();
      if(opt !== 'convert' && opt !== 'download') return;
      this._handleContextMenuClick(opt);
    });

    // close context menu after any click
    const closeCtxMenu = () => {
      this._contextMenu.instance.optionClicked$.unsubscribe();
      if(this._contextMenu) this._contextMenu.destroy();
      document.removeEventListener('click', closeCtxMenu);
    };
    document.addEventListener('click', closeCtxMenu);
  }

  private async _handleContextMenuClick(option: 'convert' | 'download'): Promise<void> {
    if(!this._selectedFileGroup) return;
    
    await this._converterService.executeFileAction(this._selectedFileGroup, option);
    if(option === 'convert') this._converterService.toggleConverter(this._viewContainerRef, this._selectedFileGroup);
    
    // open modified selected files after action
    for (const gk in this._selectedFileGroup) {
      if (Object.prototype.hasOwnProperty.call(this._selectedFileGroup, gk)) {
        for (const fk in this._selectedFileGroup[gk]) {
          if (Object.prototype.hasOwnProperty.call(this._selectedFileGroup[gk], fk)) {

            await this.seeFile(fk);

          }
        }   
      }
    }

  }
}
