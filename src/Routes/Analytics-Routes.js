import { Router } from 'express';

import{saveRobotAnalytics } from "../Controllers/analyticsController.js"

import{saveRobotAnalytics2,getRobotAnalyticsByRobotId  } from "../Controllers/analyticsController2.js"

const router = Router();

// robot analytics1
router.post('/robotanalytics', saveRobotAnalytics);

// robot analytics2
router.post('/robotanalytics2', saveRobotAnalytics2);

// get robot analytics2 (for test purpose)
router.get("/analytics2", getRobotAnalyticsByRobotId);

export default router;

