import express, { Request, Response } from 'express';
import healthCheckController from '../controller/healthCheckController';

const router = express.Router();

router
    .get('/', (req: Request, res: Response) => {
        res.json({
            title: 'project_title',
            msg: 'project_description',
            lisence: 'MIT',
            gitHub: 'github_url',
            releases: 'v1',
        });
    })
    .get('/healthcheck', healthCheckController.healthCheck);

export default router;
