import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { createWidget } from "@typeform/embed";
import { NGXLogger } from "ngx-logger";
import { ConfigurationService } from "src/app/common/config.service";
import { RoutingMap } from "src/app/routing-map";

@Component({
	selector: "app-user-wizard",
	templateUrl: "./user-wizard.component.html",
	styleUrls: ["./user-wizard.component.css"],
})
export class UserWizardComponent implements OnInit {
	constructor(
		private router: Router,
		private logger: NGXLogger,
		private configService: ConfigurationService
	) {}

	ngOnInit(): void {
		const typeformId = this.configService.urls?.typeform ?? null;
		if (typeformId == null) {
			this.logger.error("No Typeform Id found in the configuration");
			this.router.navigate([RoutingMap.DASHBOARD]);
			return;
		}
		createWidget(typeformId, {
			container: document.querySelector("#form")!,
			onSubmit: data => {
				this.logger.log("typeform Submited with Id:", data.responseId); // this will be used while getting the form response from the server
				this.router.navigate([RoutingMap.DASHBOARD]);
			},
		});
	}
}
