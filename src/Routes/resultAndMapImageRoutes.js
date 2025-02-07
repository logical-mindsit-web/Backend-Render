import express from 'express';
import { postDisinfectionRecord,getDisinfectionRecordsByDateTime,getDisinfectionRecordsInTimeRange} from "../Controllers/Result-MapImage.js"
const router = express.Router();
router.post('/disinfection-result', postDisinfectionRecord);
router.get("/disinfection-result",getDisinfectionRecordsByDateTime)
router.get('/disinfection-result', getDisinfectionRecordsInTimeRange)

//router.get('/disinfection-record',getDisinfectionRecords)
export default router;