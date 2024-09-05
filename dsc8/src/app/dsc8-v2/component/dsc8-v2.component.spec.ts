import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldDesignComponent } from './dsc8-v2.component';

describe('OldDesignComponent', () => {
  let component: OldDesignComponent;
  let fixture: ComponentFixture<OldDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OldDesignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OldDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
