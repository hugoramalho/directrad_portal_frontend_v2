/**
    Created by: Hugo Ramalho <ramalho.hg@gmail.com>

    Created at: 12/05/2024
**/

import { Injectable } from '@angular/core';
import {AppEvent} from "./app.event";

@Injectable({
    providedIn: 'root'
})
export class MdwObserverService {
    private eventIdCounter = 0;
    private observers: Function[] = [];
    private ids: Record<number, boolean> = {};

    private createEvent(data: any): AppEvent {
        if (data instanceof Event) return data;

        return new Event(++this.eventIdCounter, data);
    }

    addObserver(fn: Function): () => void {
        if (typeof fn !== 'function') throw new Error('Observers must be valid functions');

        const unbindIndex = this.observers.length;
        this.observers.push(fn);

        return () => {
            this.observers[unbindIndex] = null;
        };
    }

    unshiftObserver(fn: Function): void {
        this.observers.unshift(fn);
    }

    notifyObservers(data: any): void {
        const event = this.createEvent(data);
        if (this.ids[event.id]) return;

        this.ids[event.id] = true;

        this.observers.forEach((observer, index) => {
            if (observer && event.trace.indexOf(observer) === -1) {
                event.trace.push(observer);
                observer.call(window, event);
            }
        });
    }
}
