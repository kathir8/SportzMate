import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IonicVirtualScrollComponent } from './ionic-virtual-scroll.component';

describe('IonicVirtualScrollComponent', () => {
  let component: IonicVirtualScrollComponent;
  let fixture: ComponentFixture<IonicVirtualScrollComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicVirtualScrollComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IonicVirtualScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
