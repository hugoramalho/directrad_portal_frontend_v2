/**
    Created by: Hugo Ramalho <ramalho.hg@gmail.com>

    Created at: 12/05/2024
**/

import {AppEventType} from "./app.event.enum";

export class AppEvent {
    id: number;
    data: any;
    trace: Function[];
    type: AppEventType;

    constructor(id: number, data: any, type: AppEventType) {
        this.id = id;
        this.data = data;
        this.trace = [];
        this.type = type;
    }
}
