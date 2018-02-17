'use strict';

/**
 *
 */

import logger from '../logging';
import * as config from 'config';
import * as _ from 'lodash';
import * as validator from 'validator';

export class BasicService {

    private static CONSTANT: number = 100;
    private data: string[];

    public static getCurrentTimeStamp(): string {
        var date = new Date();
        var timeStamp = date.toLocaleDateString() + "::" + date.toLocaleTimeString();
        return timeStamp;
    }

    public static getConstant(): number {
        return this.CONSTANT;
    }

    public getData(): string[] {
        return this.data;
    }

    public setData(data: string[]): void {
        this.data = data;
    }


}