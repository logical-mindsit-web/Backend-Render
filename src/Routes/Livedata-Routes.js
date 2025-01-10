import { Router } from "express";
import { singleFiveModeApi,getModeRobotId} from "../Controllers/livedataController.js"

const router = Router();
//save history
router.post("/livedata/save", singleFiveModeApi);

//get history
router.get("/livedata/get", getModeRobotId);


export default router;
