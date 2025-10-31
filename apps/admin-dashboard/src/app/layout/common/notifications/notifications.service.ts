import { Injectable } from '@angular/core';
import { notifications as initialNotifications } from 'app/mock-api/common/notifications/data';
import { Notification } from 'app/layout/common/notifications/notifications.types';
import { Observable, of, ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
    private _notifications: ReplaySubject<Notification[]> =
        new ReplaySubject<Notification[]>(1);
    private _store: Notification[] = initialNotifications.map(
        (notification) => ({ ...notification })
    );

    /**
     * Constructor
     */
    constructor() {
        this._emit();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for notifications
     */
    get notifications$(): Observable<Notification[]> {
        return this._notifications.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all notifications
     */
    getAll(): Observable<Notification[]> {
        this._emit();
        return of(this._clone(this._store));
    }

    /**
     * Create a notification
     *
     * @param notification
     */
    create(notification: Notification): Observable<Notification> {
        const newNotification: Notification = {
            ...notification,
            id: notification.id ?? this._createId(),
            time: notification.time ?? new Date().toISOString(),
            read: notification.read ?? false,
        };

        this._store = [...this._store, newNotification];
        this._emit();

        return of({ ...newNotification });
    }

    /**
     * Update the notification
     *
     * @param id
     * @param notification
     */
    update(id: string, notification: Notification): Observable<Notification> {
        const index = this._store.findIndex((item) => item.id === id);

        if (index === -1) {
            return of({ ...notification, id });
        }

        const updated: Notification = {
            ...this._store[index],
            ...notification,
            id,
        };

        this._store[index] = updated;
        this._emit();

        return of({ ...updated });
    }

    /**
     * Delete the notification
     *
     * @param id
     */
    delete(id: string): Observable<boolean> {
        const initialLength = this._store.length;
        this._store = this._store.filter((item) => item.id !== id);
        const isDeleted = this._store.length < initialLength;
        this._emit();

        return of(isDeleted);
    }

    /**
     * Mark all notifications as read
     */
    markAllAsRead(): Observable<boolean> {
        this._store = this._store.map((notification) => ({
            ...notification,
            read: true,
        }));
        this._emit();

        return of(true);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private _emit(): void {
        this._notifications.next(this._clone(this._store));
    }

    private _clone(notifications: Notification[]): Notification[] {
        return notifications.map((notification) => ({ ...notification }));
    }

    private _createId(): string {
        if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
            return crypto.randomUUID();
        }

        return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }
}
