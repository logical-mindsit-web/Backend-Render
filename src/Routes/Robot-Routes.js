import { Router } from 'express';
import { getRobotsByEmail} from '../Controllers/robotController.js';


const router = Router();

//get robots
router.get('/robots',  getRobotsByEmail);

export default router;
