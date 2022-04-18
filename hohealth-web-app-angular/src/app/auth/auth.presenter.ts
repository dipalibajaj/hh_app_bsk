// importing fireAuth and Firebase
import { AuthService } from "./service/auth.service";
import { UserService } from "../user/service/user.service";
import { Router } from "@angular/router";
import { User } from "../user/model/user.model";
import { NGXLogger } from "ngx-logger";
import { Injectable } from "@angular/core";

// importing toaster for notifications
import { ToastrService } from "ngx-toastr";
import { SpinnerService } from "../loading-spinner/spinner.service";
import { Subject } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class AuthPresenter {
	logTag = "AuthPresenter";
	loggedIn: Subject<boolean>;
	userDetails: Subject<User | null>;

	constructor(
		public authservice: AuthService,
		private router: Router,
		private userService: UserService,
		private logger: NGXLogger,
		private toastr: ToastrService,
		private spinner: SpinnerService
	) {
		this.loggedIn = this.authservice.isLoggedIn;
		this.userDetails = this.userService.userDetails;
	}

	/**
	 * Checks if the user is signed in and if signed in redirects to the {@link onSuccess} page.
	 * Checks if the user details is available and if not, redirects to the {@link signUp} page.
	 * @param onSuccess - The page to redirect to if the user is signed in.
	 * @param signUp - The page to redirect to if the user details is not available.
	 */
	async redirectIfSignedIn(onSuccess: string, signUp: string | null = null) {
		if (this.authservice.getIsLoggedInImmediate()) {
			if ((await this.userService.getUserDetails()) == null && signUp)
				this.router.navigate([signUp]);
			else this.router.navigate([onSuccess]);
		}
	}

	/**
	 * Signs in the user with Google Sign In auth Provider.
	 * @param onSuccess - The page to redirect to if the user is successfully signed in.
	 * @param signUp - The page to redirect to if the user details is not available.
	 */
	async signIn(onSuccess: string, signUp: string | null = null) {
		try {
			const result = await this.authservice.signIn();
			this.spinner.requestStarted();
			if (!result[0]) {
				this.spinner.requestEnded();
				this.logger.error(this.logTag, "Failed to Sign In = ", result[1]);
				const error = result[1];
				if (error.code !== "auth/popup-closed-by-user")
					this.toastr.error(error.message, "Failed to SignIn");
				return;
			}

			const user = await this.userService.fetchUserDetails();

			if (user) {
				this.logger.info(
					this.logTag,
					`User details available. Navigating to ${onSuccess}...`
				);
				this.router.navigate([onSuccess]);
				this.toastr.success(`Welcome ${user.name}`, "Signed In", {
					closeButton: true,
				});
			} else if (signUp) {
				this.logger.info(this.logTag, `Navigating to ${signUp}...`);
				this.router.navigate([signUp]);
			} else {
				this.logger.error(this.logTag, "signUp redirection is not provided!");
				this.toastr.error("A technical error occured while sign In", "Error");
			}
		} catch (error: any) {
			this.logger.error(this.logTag, "Failed to Sign In = ", error);
			this.toastr.error(error.message ?? "Error", "Failed to Sign In");
		} finally {
			this.spinner.requestEnded();
		}
	}

	/**
	 * Save the default user details from Firebase to the cloud.
	 * @returns {Promise<User | null>} - The user details if saved successfully.
	 */
	async saveDefaultUserDetails(): Promise<User | null> {
		const newUser = await this.getDefaultUserDetails();
		if (!newUser.email) return null;
		const user = await this.userService.saveUserDetails(newUser);
		this.logger.info(this.logTag, "Default User Details saved.");
		return user;
	}

	/**
	 * Gets the user details from Firebase and sets the default values available.
	 * @returns {Promise<User>} - The default user details.
	 */
	async getDefaultUserDetails(): Promise<User> {
		const firebaseUser = await this.authservice.getFirebaseUser();
		const email = firebaseUser?.email ?? null;
		const name = firebaseUser?.displayName ?? "User";
		const photoUrl = firebaseUser?.photoURL;
		const user = new User();
		user.email = email;
		user.name = name;
		user.profile_image = photoUrl ? photoUrl : null;
		user.uid = firebaseUser?.uid ? firebaseUser.uid : null;
		return user;
	}

	/**
	 * Signs out the user.
	 * @param onSuccess - The page to redirect to if the user is successfully signed out.
	 */
	async signOut(onSuccess: string) {
		this.spinner.requestStarted();
		await this.authservice.signOut();
		await this.userService.onSignOut();
		this.router.navigate([onSuccess]);
		this.spinner.requestEnded();
		this.toastr.success("Have am Amazing day!", "Sign Out", {
			closeButton: true,
		});
	}

	/**
	 * Signup the user; Add the {@link userDetail} into the cloud.
	 * @param userDetail - The user details to be added.
	 * @param onSuccess - The page to redirect to if the user is successfully signed up.
	 */
	async signUp(userDetail: User, onSuccess: string) {
		try {
			this.spinner.requestStarted();
			const user = await this.userService.fetchUserDetails();

			if (user) {
				this.logger.info(this.logTag, "User details available!");
				this.router.navigate([onSuccess]);
				this.toastr.success(`Welcome ${user.name}`, "Signed In");
				return;
			}
			const firebaseUser = await this.authservice.getFirebaseUser();
			const photoUrl = firebaseUser?.photoURL;
			userDetail.profile_image = photoUrl ?? null;
			userDetail.uid = firebaseUser?.uid ?? null;

			const result = await this.userService.saveUserDetails(userDetail);
			if (!result) throw new Error("Failed to save user details");
			this.logger.info(
				this.logTag,
				`New User Details saved. Taking user to ${onSuccess}...`
			);
			this.router.navigate([onSuccess]);
		} catch (error: any) {
			this.logger.error(this.logTag, "Failed to Sign Up = ", error);
			this.toastr.error(error.message, "Failed to Sign Up");
		} finally {
			this.spinner.requestEnded();
		}
	}
}
