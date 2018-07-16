/**
 *
 */
import * as config from 'config';
import * as Keycloak from 'keycloak-connect';

// Service for access auth capabilities
export class AuthService {

    private static keycloak;

    /**
     * Setup the authentication mechanism for Keyclaok
     */
    public static setupKeyCloakInstance(store) {
        let authConfig = config.get('auth');
        AuthService.keycloak = new Keycloak( { store: store }, authConfig );
        return AuthService.keycloak;
    }

    /**
     * Get the authentication mechanism for Keyclaok
     */
    public static getKeyCloakInstance() {
        return AuthService.keycloak;
    }

}
