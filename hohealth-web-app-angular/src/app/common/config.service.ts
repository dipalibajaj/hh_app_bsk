import { Injectable } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { plainToClass } from "class-transformer";
import { environment } from "../../environments/environment";

@Injectable({
	providedIn: "root",
})
export class ConfigurationService {
	private logTag = "ConfigurationService";
	urls: RemoteUrl | null = null;

	constructor(private logger: NGXLogger, private db: AngularFireDatabase) {
		const localConfigString = localStorage.getItem("v1/url_configurations");
		if (localConfigString) {
			this.urls = plainToClass(RemoteUrl, JSON.parse(localConfigString));
		}
		this.fetchConfigs().then();
	}

	async fetchConfigs() {
		this.logger.info(this.logTag, "Fetchig Configurations");
		if (environment.useLocalConfig) {
			this.urls = plainToClass(RemoteUrl, environment.urlConfig);
			localStorage.setItem("v1/url_configurations", JSON.stringify(this.urls));
			return;
		}
		this.db.database
			.ref("web_app/v1/")
			.once("value")
			.then(snapshot => {
				const configs = snapshot.val();
				if (configs) {
					this.urls = plainToClass(RemoteUrl, configs.url_configurations);
					this.logger.debug(this.logTag, "URL Configs - ", this.urls);
					localStorage.setItem(
						"v1/url_configurations",
						JSON.stringify(this.urls)
					);
				}
			});
	}
}

class RemoteUrl {
	user: string | null = null;
	typeform: string | null = null;
}
