import App from './app';
import SysLog from './modules/SysLog';
import toobusy_js from 'toobusy-js';
import SysEnv from './modules/SysEnv';
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'dotenv/config'; // loads the .env environment
import validateEnv from './utils/validateEnv';
import { TokenModel } from './server/models/token.model';
import { blacklist_tokens_schema_table, tokens_schema_table } from './schemas/tokens.schema';
import cron = require('node-cron');

// validate that all required environment variable is present
SysEnv.init();
validateEnv();


// const port = SysEnv.PORT;

const blacklistTokens = new TokenModel(blacklist_tokens_schema_table);

const tokens = new TokenModel(tokens_schema_table);



SysLog.info('Cron setup to purge expired blacklistTokens every minute')

const cronTasks: cron.ScheduledTask[] = [
  cron.schedule('* 3 5 * * *', () => {
    SysLog.info('cron run at 5.03am to purge expired blacklist token');
    blacklistTokens.purgeExpired();
  }),
  cron.schedule('* */15 * * * * *', () => {
    // SysLog.info('cron run every 15 minutes to purge expired tokens');
    tokens.purgeExpired();
  })
];

const expressApp = new App ([],SysEnv.PORT);

cronTasks.forEach((task) => {
  task.start();
});

expressApp.listen();

process.on('SIGINT', function() {
  // app.close();
  // calling .shutdown allows your process to exit normally
  toobusy_js.shutdown();
  process.exit();
});

