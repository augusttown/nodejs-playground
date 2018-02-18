
import {Sequelize, DataType} from 'sequelize-typescript';
import * as config from 'config';
import * as _ from 'lodash';

let dataSources = [];

let dbConfig = config.get('database');
let dbConnectionConfig = _.extend(dbConfig['connection'], {});

export function getPlaygroundDataSource() {
    if(!dataSources['playground']) {
        dataSources['playground'] = new Sequelize(dbConnectionConfig);
    }
    return dataSources['playground'];
}