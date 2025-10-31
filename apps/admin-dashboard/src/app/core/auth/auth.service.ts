import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient
            .post<LoginResponse>(
                `${environment.apiUrl}/api/identity/login`,
                credentials
            )
            .pipe(map((response) => this._handleAuthentication(response)));
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Sign in using the token
        return this._httpClient
            .get<UserResponse>(`${environment.apiUrl}/api/identity/me`)
            .pipe(
                map((response) => this._mapToUser(response)),
                tap((user) => {
                    this._authenticated = true;
                    this._userService.user = user;
                }),
                map(() => true),
                catchError(() => of(false))
            );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        return throwError(() => new Error('Sign up not implemented.'));
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return throwError(() => new Error('Unlock session not implemented.'));
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists, and it didn't expire, sign in using it
        return this.signInUsingToken();
    }

    private _handleAuthentication(response: LoginResponse): LoginResponse {
        this.accessToken = response.accessToken;
        this._authenticated = true;

        const user = this._mapToUser(response.user);
        this._userService.user = user;

        return response;
    }

    private _mapToUser(user: UserResponse): User {
        const displayName = user.displayName?.trim();

        return {
            id: user.id,
            email: user.email,
            name:
                displayName && displayName.length
                    ? displayName
                    : `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles,
        };
    }
}

interface LoginResponse {
    accessToken: string;
    user: UserResponse;
}

interface UserResponse {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    roles: string[];
}
