/**
 *
 */
import logger from '../logging';
import * as config from 'config';
import * as validator from 'validator';
import {Application} from "express";


export class DefaultResource {

    constructor(public app: Application) {
        this.setupRoutes();
    }

    private setupRoutes() {

        this.app.get('/index', function(req, res) {
            res.render('index', {});
        });

    }
}