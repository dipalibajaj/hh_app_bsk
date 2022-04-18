import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import firebase from "firebase/compat/app";
import { BehaviorSubject, Subject } from "rxjs";
import { NGXLogger } from "ngx-logger";

@Injectable({
	providedIn: "root",
})
export class AuthService {
	private logTag = "AuthService:";
	isLoggedIn: Subject<boolean> = new BehaviorSubject<boolean>(false);

	constructor(private auth: AngularFireAuth, private logger: NGXLogger) {
		this.auth.authState.subscribe(firebaseUser => {
			const isLoggedIn = firebaseUser != null;
			this.logger.debug(this.logTag, "Auth State Changed! = ", isLoggedIn);
			localStorage.setItem("isLoggedIn", isLoggedIn ? "true" : "false");
			this.isLoggedIn.next(isLoggedIn);
		});
	}

	/**
	 * Method to get the locally available state of isLoggedIn
	 * @returns
	 */
	getIsLoggedInImmediate(): boolean {
		const loggedIn = localStorage.getItem("isLoggedIn");
		if (loggedIn) return loggedIn.toLowerCase() == "true";
		else return false;
	}

	/**
	 * Used to Sign In to the app using GoogleAuth
	 * @returns {[boolean, string]} where boolean is is the operation was success or failure; if failure then the message
	 */
	async signIn(): Promise<[boolean, any]> {
		try {
			this.logger.debug(this.logTag, "Attempting Sign In with Google");
			await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
			this.logger.debug(this.logTag, "Sign In Successful");
			return [true, "Signed in Successfully"];
		} catch (e) {
			this.logger.debug(this.logTag, "Sign In Failed", e);
			return [false, e];
		}
	}

	/**
	 * Used to Sign Out the user from the app.
	 * @returns {boolean} that indicates if the sign out was successful or not.
	 */
	async signOut(): Promise<boolean> {
		this.logger.debug(this.logTag, "Attempting Sign Out user");
		await this.auth.signOut();
		return true;
	}

	async getFirebaseUser(): Promise<firebase.User | undefined | null> {
		this.logger.debug(this.logTag, "Getting Firebase User");
		return this.auth.currentUser;
	}

	async getIdToken(): Promise<string | undefined> {
		return (await this.getFirebaseUser())?.getIdToken();
	}
}
