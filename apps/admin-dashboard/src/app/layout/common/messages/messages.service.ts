import { Injectable } from '@angular/core';
import { messages as initialMessages } from 'app/mock-api/common/messages/data';
import { Message } from 'app/layout/common/messages/messages.types';
import { Observable, of, ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessagesService {
    private _messages: ReplaySubject<Message[]> =
        new ReplaySubject<Message[]>(1);
    private _store: Message[] = initialMessages.map((message) => ({
        ...message,
    }));

    constructor() {
        this._emit();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for messages
     */
    get messages$(): Observable<Message[]> {
        return this._messages.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all messages
     */
    getAll(): Observable<Message[]> {
        this._emit();
        return of(this._clone(this._store));
    }

    /**
     * Create a message
     *
     * @param message
     */
    create(message: Message): Observable<Message> {
        const newMessage: Message = {
            ...message,
            id: message.id ?? this._createId(),
            time: message.time ?? new Date().toISOString(),
            read: message.read ?? false,
        };

        this._store = [...this._store, newMessage];
        this._emit();

        return of({ ...newMessage });
    }

    /**
     * Update the message
     *
     * @param id
     * @param message
     */
    update(id: string, message: Message): Observable<Message> {
        const index = this._store.findIndex((item) => item.id === id);

        if (index === -1) {
            return of({ ...message, id });
        }

        const updated: Message = {
            ...this._store[index],
            ...message,
            id,
        };
        this._store[index] = updated;
        this._emit();

        return of({ ...updated });
    }

    /**
     * Delete the message
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
     * Mark all messages as read
     */
    markAllAsRead(): Observable<boolean> {
        this._store = this._store.map((message) => ({
            ...message,
            read: true,
        }));
        this._emit();

        return of(true);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private _emit(): void {
        this._messages.next(this._clone(this._store));
    }

    private _clone(messages: Message[]): Message[] {
        return messages.map((message) => ({ ...message }));
    }

    private _createId(): string {
        if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
            return crypto.randomUUID();
        }

        return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }
}
