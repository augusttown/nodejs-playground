import * as express from 'express';
import * as path from 'path';
import * as morgan from 'morgan';
import * as fs from 'fs';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as config from 'config';
import * as rfs from 'rotating-file-stream';
import * as http from 'http';
//import * as validator from 'validator';

// application logger
import logger from './logging';

class App {

    private app;
    private port;
    private server;

    constructor() {
        delete process.env["DEBUG_FD"]; // TODO: what's this for?
        this.configureApp();
        this.setupRoutes();
    }

    private configureApp() {
        delete process.env["DEBUG_FD"]; // TODO: what's this for?
        this.app = express();

        // Configure the access logging mechanism
        let accessLogFileName : any = config.get('logging.accessLogs.filename');
        let accessLogConfig : any = config.get('logging.accessLogs.config');

        // Ensure log directory exists
        let accessLogPath = "logs";
        if(!fs.existsSync(accessLogPath)) {
            fs.mkdirSync(accessLogPath);
        }

        let accessLogStream = rfs(accessLogFileName, accessLogConfig);
        this.app.use(morgan('combined', {stream: accessLogStream}));
        this.app.use(morgan('dev'));

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cookieParser());

        // view engine setup
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'pug');
    }

    private setupRoutes() {
        /**
         * Define the routes for the app
         **/
    }

    public startAppServer() {
        /**
         * Get port from the env parameter - otherwise, get from configuration and store in Express.
         */
        this.port = process.env.NDJS_PLYGRND_PORT;
        if(!this.port) {
            this.port = config.get('server.port');
        }
        this.app.set('port', this.port);

        /**
         * Create HTTP server.
         */
        this.server = http.createServer(this.app);

        /**
         * Listen on provided port, on all network interfaces.
         */
        this.server.listen(this.port);
        /**
         * Event listener for HTTP server "error" event.
         */
        this.server.on('error', (error) =>  {
            if (error.syscall !== 'listen') {
                throw error;
            }

            let bind = typeof this.port === 'string'
                ? 'Pipe ' + this.port
                : 'Port ' + this.port;

            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    console.error(bind + ' requires elevated privileges');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(bind + ' is already in use');
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        });
        /**
         * Event listener for HTTP server "listening" event.
         */
        this.server.on('listening', () => {
            let debug = require('debug')('nodjs-playground:server');
            let addr = this.server.address();
            let bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
            logger.info(bind);
            debug('Listening on ' + bind);
        });
    }
}

// Convenience function to create a new app and start it.
export function startApp() {
    let app = new App();
    app.startAppServer();
}