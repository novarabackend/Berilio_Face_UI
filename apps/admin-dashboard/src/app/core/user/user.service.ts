import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { map, Observable, of, ReplaySubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
    private _httpClient = inject(HttpClient);
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User) {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current signed-in user data
     */
    get(): Observable<User> {
        return this._httpClient
            .get<UserResponse>(`${environment.apiUrl}/api/identity/me`)
            .pipe(
                map((response) => this._toUser(response)),
                tap((user) => {
                    this._user.next(user);
                })
            );
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any> {
        this._user.next({ ...user });

        return of(user);
    }

    private _toUser(response: UserResponse): User {
        const displayName = response.displayName?.trim();

        return {
            id: response.id,
            email: response.email,
            name:
                displayName && displayName.length
                    ? displayName
                    : `${response.firstName ?? ''} ${response.lastName ?? ''}`.trim(),
            firstName: response.firstName,
            lastName: response.lastName,
            roles: response.roles,
        };
    }
}

interface UserResponse {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    roles: string[];
}
