import { AuthService } from "../../auth/service/auth.service";
import { User } from "../model/user.model";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { NGXLogger } from "ngx-logger";
import { plainToClass } from "class-transformer";
import { ConfigurationService } from "src/app/common/config.service";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
	providedIn: "root",
})
export class UserService {
	private logTag = "UserService";
	userDetails: Subject<User | null> = new BehaviorSubject<User | null>(null);

	constructor(
		private authService: AuthService,
		private logger: NGXLogger,
		private configs: ConfigurationService,
		private http: HttpClient
	) {
		this.authService.isLoggedIn.subscribe(async isLoggedIn => {
			const user = isLoggedIn ? await this.getUserDetails() : null;
			this.logger.info(this.logTag, "Auth State Changed! User= ", user);
			this.userDetails.next(user);
		});
	}

	async fetchUserDetails(): Promise<User | null> {
		this.logger.debug(this.logTag, "Fetching User Details...");
		//get the firebase user
		const firebaseUser = await this.authService.getFirebaseUser();
		if (!firebaseUser) {
			this.logger.error(this.logTag, "User is not Signed In");
			return null;
		}

		const userDetails = await this.getUserFromRemote(firebaseUser.uid);
		if (!userDetails) {
			this.logger.warn(this.logTag, "User Detail does not exist in remote.");
			return null;
		}

		const userId = firebaseUser.uid;
		localStorage.setItem(userId, JSON.stringify(userDetails));
		return userDetails;
	}

	async getUserDetails(): Promise<User | null> {
		this.logger.debug(this.logTag, "Getting Local User Details...");
		const firebaseUid = (await this.authService.getFirebaseUser())?.uid;
		if (!firebaseUid) {
			this.logger.error(this.logTag, "User is not signed in");
			return null;
		}
		//load value from local storage.
		const detailsInLocalStorage = localStorage.getItem(firebaseUid);
		if (!detailsInLocalStorage) {
			this.logger.warn(
				this.logTag,
				"User Details not available in localStore!"
			);
			return this.fetchUserDetails();
		}
		const userDetails = plainToClass(User, JSON.parse(detailsInLocalStorage));
		this.logger.debug(this.logTag, "User Detail In Storage= ", userDetails);
		return userDetails;
	}

	async saveUserDetails(user: User): Promise<User | null> {
		this.logger.info(this.logTag, "Saving User Details...", user);
		const firebaseUser = await this.authService.getFirebaseUser();
		if (!firebaseUser) {
			this.logger.debug(this.logTag, "User is not Signed In");
			return null;
		}
		const userId = firebaseUser.uid;
		const newUser = await this.saveUserInRemote(user);
		if (!newUser) return null;

		localStorage.setItem(userId, JSON.stringify(newUser));
		this.logger.info(this.logTag, "User Details saved in localStore!");
		this.userDetails.next(user);
		return user;
	}

	async onSignOut() {
		this.logger.info(this.logTag, "onSignOut called... clearing states.");
		const firebaseUser = await this.authService.getFirebaseUser();
		if (!firebaseUser) {
			this.logger.debug(this.logTag, "User is not Signed In");
			return;
		}
		const userId = firebaseUser.uid;
		localStorage.removeItem(userId);
	}

	//#region Remote Operations
	async getUserFromRemote(uid: string): Promise<User | null> {
		const url = this.configs.urls?.user;
		if (!url) {
			this.logger.error(
				this.logTag,
				"Could not fetch user from remote! Url in config is empty."
			);
			return null;
		}

		const params = new HttpParams().set("uid", uid);
		try {
			const result = await this.http
				.get(url, {
					params: params,
				})
				.toPromise();
			const user = plainToClass(User, result);
			this.logger.info(this.logTag, result, user);
			return user;
		} catch (e) {
			this.logger.error(this.logTag, "Failed to getUserFromRemote", e);
			return null;
		}
	}

	async saveUserInRemote(user: User): Promise<User | null> {
		const url = this.configs.urls?.user;
		if (!url) {
			this.logger.error(
				this.logTag,
				"Could not save user to remote! Url in config is empty."
			);
			return null;
		}

		try {
			const newUser = plainToClass(
				User,
				await this.http.post(url, user).toPromise()
			);
			this.logger.info(this.logTag, newUser);
			return newUser;
		} catch (e) {
			this.logger.error(this.logTag, "Failed to saveUserInRemote", e);
			return null;
		}
	}
	//#endregion
}
