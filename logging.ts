import * as winston from 'winston';
import * as config from 'config';
import 'winston-daily-rotate-file';

class Logging {
    private logger;

    constructor() {
        let defaultLoggingLevel = (process.env.ENV === 'qa') ? 'debug' : 'info';
        let loggerTransports = [];
        let logFileConfig = config.get('logging.appLogs.file');
        if(!logFileConfig['level']) {
            logFileConfig['level'] = defaultLoggingLevel;
        }
        loggerTransports.push(new winston.transports.DailyRotateFile(logFileConfig));
        if(process.env.NODE_ENV === 'qa') {
            let logConsoleConfig = config.get('logging.appLogs.console');
            if(!logConsoleConfig['level']) {
                logConsoleConfig['level'] = defaultLoggingLevel;
            }
            loggerTransports.push(new winston.transports.Console(logConsoleConfig));
        }

        this.logger = new winston.Logger({
            transports: loggerTransports,
            exitOnError: false
        });
    }

    public getLogger(){
        return this.logger;
    }
}

export default new Logging().getLogger();