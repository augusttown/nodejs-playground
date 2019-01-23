/**
 * SessionResource
 */
import logger from '../logging';
import * as config from 'config';
import {BaseResource} from "./baseResource";
import {UserAccess} from "../services/security/userAccess";
import {SecurityService} from "../services/security/securityService";

export class SessionResource  extends BaseResource {

    protected setupRoutes() {
        //
        this.router.get('/session', function(req, res) {
            try {
                let userAccess = new UserAccess(req);
                let session = {
                    user: userAccess.userId,
                    trackId: config.get('app.trackId')
                };
                let message = "Successfully retrieved user session.";
                SecurityService.sendResult(res, session, null, message);
            } catch(error) {
                let message = "An error occurred while retrieving the user's session - %s";
                SecurityService.sendError(res, message, 500, message, error.message);
            }
        });
    }
}