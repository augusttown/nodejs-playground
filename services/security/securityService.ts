/**
 * @ngdoc service
 * @name securityServices
 * @description
 * Business logic related to securing connections with the RI Web App
 */
import * as csrf from 'csurf';
import * as validator from 'validator';
import {Request, Response} from 'express';
import * as xssFilters from 'xss-filters';
import logger from '../../logging';
import * as _ from "lodash";
import * as util from 'util';

export class SecurityService {
    private static CSRF_TOKEN_NAME = '_csrf';

    /**
     * Setup CSRF to use cookies instead of session
     */
    public static setupCsrf() {
        return csrf();
    }

    /**
     * Adds the CSRF token to an object
     * This is a private method called from the public addCsrfToken method below.
     */
    private static addCsrfTokenToObject(responseObject : any, csrfToken : string) {
        if(responseObject.dataValues) {
            responseObject.dataValues[SecurityService.CSRF_TOKEN_NAME] = csrfToken;
        } else {
            responseObject[SecurityService.CSRF_TOKEN_NAME] = csrfToken;
        }
    }

    /**
     * Adds the CSRF token to a Web Service response
     */
    public static addCsrfToken(responseData : any, csrfToken : string) {
        if(csrfToken) {
            // If the result is an array, add the token to each item in the array.
            if(_.isArrayLike(responseData)) {
                _.each(responseData, (responseDataItem) => {
                    SecurityService.addCsrfTokenToObject(responseDataItem, csrfToken);
                });
            } else {
                SecurityService.addCsrfTokenToObject(responseData, csrfToken);
            }
        }
        return responseData;
    }


    /**
     * Get a valid CSRF token
     */
    public static getCsrfToken(req : Request) : string {
        let csrfToken : string = req.csrfToken();
        if(csrfToken && !validator.matches(csrfToken, /[^a-zA-Z0-9_-]/)) {
            return csrfToken;
        }
        return null;
    }

    /**
     * Format the message to be used.  Ensure the parameters are processed to avoid XSS attacks
     * This is a private method called from the public sendError and sendResult methods below.
     */
    public static formatMessage(msg: string, params : Array<any>) {
        let formattedMsg = msg;
        if(params && params.length > 0 && _.includes(msg, '%')) {
            // Ensure all the parameters to be included in the message are properly escaped.
            let processedParams = _.map(params, (param) => {
                if(_.isNil(param)) {
                    return 'null';
                } else if(_.isNumber(param) || _.isBoolean(param)) {
                    return param;
                } else {
                    return validator.escape(param.toString());
                }
            });

            let callParams = _.concat([msg], processedParams);
            formattedMsg = util.format.apply(util, callParams);
        }
        return formattedMsg;
    }

    /**
     * Function to safely log an error and send the response back to the client.
     */
    public static sendError(res: Response, msg: string, status: number, logMsg: string, ...params: Array<any>) {
        // Create the log entry for the error.
        let formattedLogMsg = SecurityService.formatMessage(logMsg, params);
        logger.error(formattedLogMsg);

        // Send the response
        let formattedMsg = SecurityService.formatMessage(msg, params);
        res.status(status).send(xssFilters.inHTMLData(formattedMsg));
    }

    /**
     * Function to safely log an error and display a page in the Web browser.
     */
    public static displayPage(res: Response, page: string, msg: string, logMsg: string, ...params: Array<any>) {
        // Create the log entry for the error.
        let formattedLogMsg = SecurityService.formatMessage(logMsg, params);
        logger.error(formattedLogMsg);

        // Display the error page
        let formattedMsg = SecurityService.formatMessage(msg, params);
        res.render(page, { error: xssFilters.inHTMLData(formattedMsg) });
    }

    /**
     * Function to safely log an error and display the error page in the Web browser.
     */
    public static displayError(res: Response, msg: string, logMsg: string, ...params: Array<any>) {
        SecurityService.displayPage(res, 'error', msg, logMsg, params);
    }

    /**
     * Function to safely send a successful response to the client
     */
    public static sendResult(res: Response, value: any, csrfToken: string, logMsg: string, ...params: Array<any>) {
        // Create the log entry for the error.
        let formattedLogMsg = SecurityService.formatMessage(logMsg, params);
        logger.info(formattedLogMsg);

        // If we need to add the CSRF token to the response, do it here.
        if(csrfToken) {
            SecurityService.addCsrfToken(value, csrfToken);
        }

        if(value) {
            // Format the response value and then send it.
            let responseValue = xssFilters.inHTMLData(JSON.stringify(value));
            res.send(responseValue);
        } else {
            res.send();
        }
    }
}