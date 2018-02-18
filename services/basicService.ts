'use strict';

/**
 *
 */

import logger from '../logging';
import * as config from 'config';
import * as _ from 'lodash';
import * as validator from 'validator';
import * as dataSources from '../datasources';
import {Person} from "../models/person";

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

    public static testPlaygroundDataSource(): boolean {
        let isConnected = false;
        let dataSource = dataSources.getPlaygroundDataSource();
        if (dataSource) {
            isConnected = true;
        }
        return isConnected;
    }

    public static getPersonCount() {
        let dataSource = dataSources.getPlaygroundDataSource();
        if(dataSource) {
            dataSource.addModels([Person]);
            let query = {
                //where: {}
            };
            return Person.count(query);
        } else {
            return null;
        }
    }

    public getData(): string[] {
        return this.data;
    }

    public setData(data: string[]): void {
        this.data = data;
    }


}