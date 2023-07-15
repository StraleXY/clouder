import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyMemberVerificationComponent } from './family-member-verification.component';

describe('FamilyMemberVerificationComponent', () => {
  let component: FamilyMemberVerificationComponent;
  let fixture: ComponentFixture<FamilyMemberVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilyMemberVerificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilyMemberVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
