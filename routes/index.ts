/**
 *
 */
import logger from '../logging';
import * as config from 'config';
import * as validator from 'validator';
import {Application} from "express";
import {BasicService} from '../services/basicService';


export class DefaultResource {

    constructor(public app: Application) {
        this.setupRoutes();
    }

    private setupRoutes() {

        this.app.get('/index', function(req, res) {
            let timeStamp = BasicService.getCurrentTimeStamp();
            logger.info(timeStamp);
            res.render('index', { timeStamp: timeStamp });
        });

    }
}