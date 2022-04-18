import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UserWizardComponent } from "./user-wizard.component";

describe("TypeformPageComponent", () => {
	let component: UserWizardComponent;
	let fixture: ComponentFixture<UserWizardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UserWizardComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UserWizardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
