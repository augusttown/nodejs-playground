/**
 * @ngdoc security class
 * @name userAccess
 * @description
 * Business logic related to a user's access across the apps and tenants
 */
import * as _ from "lodash";

// Class used to hold the details for a user's access to an app
export class AppAccess {
    constructor(public id : string, public roles : Array<string>) {
    }

    hasRole(roleToCheck : string) {
        return _.includes(this.roles, roleToCheck);
    }
}

// Class used to hold the details of a user's access
export class UserAccess {
    static RESOURCE_SUFFIX_APP = '-playground-web';
    static ROLE_PREFIX_CLIENT = 'tenant_access_';
    static ROLE_ADMIN = 'Admin';
    static ROLE_USER = 'User';

    userId : string;
    apps : Array<AppAccess> = [];
    clients : Array<string> = [];

    /**
     * Constructor will process the roles to determine user access to app, clients, and roles.
     */
    constructor(req) {
        if(req && req.kauth && req.kauth.grant) {
            let grant = req.kauth.grant;

            // Set the user ID
            if(grant.id_token && grant.id_token.content) {
                this.userId = grant.id_token.content.preferred_username;
            }

            if(grant.access_token && grant.access_token.content) {
                // Parse the realm roles to determine the clients for which the user has access
                let realmAccess = grant.access_token.content.realm_access;
                if(realmAccess) {
                    for (let role of realmAccess.roles) {
                        if (role.startsWith(UserAccess.ROLE_PREFIX_CLIENT)) {
                            // Determine client access
                            this.clients.push(role.replace(UserAccess.ROLE_PREFIX_CLIENT, ''));
                        }
                    }
                }

                // Parse the resources to determine the apps & corresponding roles for which the user has access
                let resourceAccess = grant.access_token.content.resource_access;
                if(resourceAccess) {
                    for (let resource of _.keys(resourceAccess)) {
                        if (resource.endsWith(UserAccess.RESOURCE_SUFFIX_APP)) {
                            // Determine app access
                            let appName = resource.replace(UserAccess.RESOURCE_SUFFIX_APP, '');
                            this.apps.push(new AppAccess(appName, resourceAccess[resource].roles));
                        }
                    }
                }

                // Sort the app and client access alphabetically.
                this.apps = _.sortBy(this.apps, ['id']);
                this.clients = this.clients.sort();
            }
        }
    }

    /**
     * Get all the app IDs for which the user has access.
     * @returns {string[]}
     */
    getAppIds() {
        return _.map(this.apps, 'id');
    }

    /**
     * Get the app access for a user via the app ID
     * @param {string} appId
     */
    getAppAccess(appId : string) {
        return _.find(this.apps, (app) => { return app.id === appId; });
    }

    /**
     * Determine if a user has access.  If not parameters are passed, just check if the user has any access at all.
     * @param clientToCheck - Check if the user has access to this client's data
     * @param appToCheck - Check if the user has access to this app for a client.
     * @param roleToCheck - Check the role of the user
     * @returns {boolean} - true if the user has access, and false otherwise
     */
    hasAccess(clientToCheck?, appToCheck?, roleToCheck?) : boolean {
        let appAccess = appToCheck ? this.getAppAccess(appToCheck) : null;
        return (
            ((clientToCheck && _.includes(this.clients, clientToCheck)) || (!clientToCheck && this.clients.length > 0)) &&
            ((appToCheck && appAccess) || (!appToCheck && this.apps.length > 0)) &&
            ((roleToCheck && appAccess && appAccess.hasRole(roleToCheck)) || !roleToCheck)
        );
    }

    /**
     * Determine if this user has admin rights.
     * @returns {boolean}
     */
    isAdmin(clientToCheck, appToCheck?) : boolean {
        if(appToCheck) {
            return this.hasAccess(clientToCheck, appToCheck, UserAccess.ROLE_ADMIN);
        } else {
            return _.some(this.apps, (app) => {
                return this.hasAccess(clientToCheck, app.id, UserAccess.ROLE_ADMIN);
            });
        }
    }
}