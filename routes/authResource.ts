/**
 * @ngdoc route
 * @name authResource
 * @description
 * A RESTful Web Service endpoint for user authentication requests.
 */
import logger from '../logging';
import {AuthService} from '../services/authService';
import {BaseResource} from "./baseResource";
import {UserAccess} from "../services/security/userAccess";

export class AuthResource extends BaseResource {
    protected setupRoutes() {

        let keycloak = AuthService.getKeyCloakInstance();

        // All routes after this point require a valid session to be invoked.
        this.router.all('*', keycloak.protect(), function (req, res, next) {
            next();
        });

        /**
         * Endpoint to display the login screen.  If enabled, this is a local login screen.
         */
        this.router.get('/login', keycloak.protect(), function(req, res) {
            // Determine what access an authenticated user has
            let userAccess = new UserAccess(req);
            //
            res.set('Content-Type', 'text/html');
            res.redirect(req.query.target);
        });

        /**
         * Endpoint to logout
         */
        this.router.get('/logout', function(req:any, res) {
            let logoutUrl = keycloak.logoutUrl(req.query.target);
            // Cleanup the NodeJS persistent session
            req.session.destroy((error) => {
                // End the Keycloak session.  Return the Keycloak URL to which the browser will be directed.
                logger.info("NodeJS persistent session ended");
                if (req.kauth.grant) {
                    delete req.kauth.grant;
                    logger.info("Keycloak session ended");
                }
                res.redirect(logoutUrl);
            });
        });
    }
}