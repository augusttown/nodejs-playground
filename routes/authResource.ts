/**
 * @ngdoc route
 * @name authResource
 * @description
 * A RESTful Web Service endpoint for user authentication requests.
 */
import {AuthService} from '../services/authService';
import {BaseResource} from "./baseResource";

export class AuthResource extends BaseResource {
    protected setupRoutes() {

        let keycloak = AuthService.getKeyCloakInstance();

        /**
         * Endpoint to display the login screen.  If enabled, this is a local login screen.
         */
        this.router.get('/login', keycloak.protect(), function(req, res) {
            res.set('Content-Type', 'text/html');
            res.redirect("http://localhost/nodejs-playground-web/index.html");
        });

        // All routes after this point require a valid session to be invoked.
        this.router.all('*', keycloak.protect(), function (req, res, next) {
            next();
        });
    }
}