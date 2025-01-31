// routes/feetDataRoutes.js
import { Router } from 'express';
import { getAllFeetData } from '../Controllers/disinfectionTimeController.js';

const router = Router();

// Route to get all feet data
router.get('/get-feed-data', getAllFeetData);



export default router;