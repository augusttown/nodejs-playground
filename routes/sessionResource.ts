/**
 * SessionResource
 */
import logger from '../logging';
import {BaseResource} from "./baseResource";
import {UserAccess} from "../services/security/userAccess";

export class SessionResource  extends BaseResource {

    protected setupRoutes() {
        /**
         * Endpoint to get the login details based on an active user Qlik Sense session ID.
         */
        this.router.get('/session', function(req, res) {
            let userAccess = new UserAccess(req);
            if (userAccess) {
                let userAccessJson = JSON.stringify(userAccess);
                res.send(userAccessJson);
            } else {
                res.send();
            }
        });
    }

}