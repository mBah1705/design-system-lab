import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DsCore } from './ds-core';

describe('DsCore', () => {
  let component: DsCore;
  let fixture: ComponentFixture<DsCore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsCore],
    }).compileComponents();

    fixture = TestBed.createComponent(DsCore);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
