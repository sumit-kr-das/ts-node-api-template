import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';
import { config } from './src/config';
import errorHandler from './src/middleware/errorHandeler';
import connect from './src/utils/connection';
import logger from './src/utils/logger';

/* routes */
import testRoutes from './src/routes/healthCheck';
import userRoutes from './src/routes/user';
import userAuthRoutes from './src/routes/userAuth';

const app: Application = express();

/* middlewares */
  app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

/* all routes */
app.use('/', testRoutes);
app.use('/api/user/auth', userAuthRoutes);
app.use('/api/user', userRoutes);

/* custom error handler */
app.use(errorHandler);
app.use(express.static(__dirname));

app.listen(config.PORT, async () => {
    logger.info(`Running on port no ${config.PORT}`);
    await connect();
});
