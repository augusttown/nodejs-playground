import {Application, Router} from "express";

export abstract class BaseResource {

    constructor(protected app: Application, protected router: Router) {
        this.setupRoutes();
    }

    protected abstract setupRoutes();
}