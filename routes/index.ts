/**
 *
 */
import logger from '../logging';
import * as config from 'config';
import * as _ from 'lodash';
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
            let isPlaygroundDbConnected = BasicService.testPlaygroundDataSource();

            res.render('index', {
                timeStamp: timeStamp,
                dbStatus: isPlaygroundDbConnected
            });
        });

        this.app.get('/person', function(req, res) {
            let isPromise = BasicService.getPersonCount();
            if(isPromise) {
                isPromise.then((count) => {
                    if(_.isNumber(count)) {
                        logger.info("GET person count success, count = " + count);
                        res.render('person', {
                            personCount: count
                        });
                    } else {
                        let message = "Could not retrieve person count.";
                        logger.error(message);
                        res.status(500).send(message);
                    }
                }).catch((err) => {
                    let message = "Could not retrieve person count - " + err.message;
                    logger.error(message);
                    res.status(err.status || 500).send(message);
                });
            } else {
                res.status(500).send("Could not find data source");
            }
        });

    }
}