import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.css',
  standalone: true,
  imports: [CommonModule]
})
export class ContextMenuComponent {
  @Input('xPos') xPos: number;
  @Input('yPos') yPos: number;
  @Input('options') options: Array<string>;

  public optionClicked$: Subject<string>;

  constructor() {
    this.xPos = 0;
    this.yPos = 0;
    this.options = new Array();

    this.optionClicked$ = new Subject<string>();
  }


  public onClickOption(option: string): void { this.optionClicked$.next(option); }
}
