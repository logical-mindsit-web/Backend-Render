import { Router } from 'express';

import { createSwapTest ,getAllSwapTests} from '../Controllers/swapController.js';

const router = Router();

// Route to create a new Swap Test
router.post("/createswap", createSwapTest);

// Route to get all Swap Tests
router.get("/getswap", getAllSwapTests);


export default router;
