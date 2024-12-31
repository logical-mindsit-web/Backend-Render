import { Router } from 'express';
import { createRobotmsg} from '../Controllers/emergencymsgController.js';

const router = Router();

// create new robot message
router.post('/robotmsgs', createRobotmsg); 



export default router;