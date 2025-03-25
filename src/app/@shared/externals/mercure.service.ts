import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MercureService {
    private mercureUrl = 'http://localhost/.well-known/mercure';

    // subscribeToTopic(topic: string): Observable<any> {
    //     return new Observable((observer) => {
    //         const eventSource = new EventSource(
    //             `${this.mercureUrl}?topic=${encodeURIComponent(topic)}`
    //         );
    //
    //         eventSource.onmessage = (event) => {
    //             observer.next(JSON.parse(event.data));
    //         };
    //
    //         eventSource.onerror = (error) => {
    //             observer.error(error);
    //         };
    //
    //         return () => eventSource.close();
    //     });
    // }
}
