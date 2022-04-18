import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { SpinnerService } from "./spinner.service";

@Component({
	selector: "app-loading-spinner",
	templateUrl: "./loading-spinner.component.html",
	styleUrls: ["./loading-spinner.component.css"],
})
export class LoadingSpinnerComponent implements OnInit {
	showSpinner = true;

	constructor(
		private spinner: SpinnerService,
		private cdRef: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.init();
	}

	init() {
		this.spinner.getSpinnerObserver().subscribe(status => {
			this.showSpinner = status === "start";
			this.cdRef.detectChanges();
		});
	}
}
