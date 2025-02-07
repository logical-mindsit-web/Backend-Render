import resultAndMapImageStore from "../Models/Result-MapImageModel.js";

// POST API for creating a new disinfection record
export const postDisinfectionRecord = async (req, res) => {
  try {
    const {emailId,robotId,mapName,resultMapImage,disinfectionTime,disinfectedObjects} = req.body;
    
    const requiredFields = ['emailId', 'robotId', 'mapName', 'resultMapImage', 'disinfectionTime', 'disinfectedObjects'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
        missingFields,
      });
    }
     
    // Validate Base64 format
    const base64Pattern = /^data:image\/(png|jpeg|jpg);base64,/;
    if (!base64Pattern.test(resultMapImage)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid image format. Expected Base64 string with data:image/jpeg or png.",
      });
    }
    const newDisinfectionRecord = new resultAndMapImageStore({
      emailId,
      robotId,
      mapName,
      resultMapImage,
      disinfectionTime,
      disinfectedObjects,
    });
    await newDisinfectionRecord.save();
    console.log("result save data :",newDisinfectionRecord)

    return res.status(201).json({
      succes: true,
      message: "Disinfection record created successfully.",
      data: newDisinfectionRecord,
    });
  } catch (error) {
    console.error("Error saving disinfection record:", error);
    return res.status(500).json({
      error: "Internal server error. Please try again later.",
      message: error.message,
    });
  }
};





//time range call old
//GET API to fetch disinfection records within a time range
export const getDisinfectionRecordsInTimeRange = async (req, res) => {
  try {
    const {  startTime, endTime ,robotId} = req.query;
   // console.log("req is ",req.body)

     const requiredFields = ["startTime", "endTime", "robotId"];
     const getmissingFields = requiredFields.filter(field => !req.query[field]);
 
     if (getmissingFields.length > 0) {
       return res.status(400).json({
         success: false,
         message: "Missing required parameters.",
         getmissingFields,
       });
     }

    if ( !startTime || !endTime || !robotId) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters:  startTime, endTime ,robotId.",
      });
    }

    // Parse dates from ISO strings
    const startDate = new Date(startTime);
    //console.log("start date is",startDate)
    const endDate = new Date(endTime);
    //console.log("end date is",endDate)

    // Check if dates are valid
    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use ISO strings (e.g., '2024-05-20T06:00:00Z').",
      });
    }

    // Ensure startTime <= endTime
    if (startDate > endDate) {
      return res.status(400).json({
        success: false,
        message: "startTime must be before or equal to endTime.",
      });
    }

    // Fetch records from MongoDB
    const records = await resultAndMapImageStore.find({
      disinfectionTime: { $gte: startDate, $lte: endDate },
      robotId:robotId.trim(),
    });
   console.log("res fethd is ",records)
    if (records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No disinfection records found for the specified time range.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Disinfection result retrieved successfully.",
      data: records,
    });
  } catch (error) {
    //console.error("Error fetching disinfection records:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};


//GET API to fetch disinfection records within a time range
// export const getDisinfectionRecordsInTimeRange = async (req, res) => {
//   try {
//     const {  startTime, endTime } = req.query;

//     // Validate required parameters
//     if ( !startTime || !endTime) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required parameters:  startTime, endTime.",
//       });
//     }

//     // Parse dates from ISO strings
//     const startDate = new Date(startTime);
//     const endDate = new Date(endTime);

//     // Check if dates are valid
//     if (isNaN(startDate) || isNaN(endDate)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid date format. Use ISO strings (e.g., '2024-05-20T06:00:00Z').",
//       });
//     }

//     // Ensure startTime <= endTime
//     if (startDate > endDate) {
//       return res.status(400).json({
//         success: false,
//         message: "startTime must be before or equal to endTime.",
//       });
//     }

//     // Fetch records from MongoDB
//     const records = await resultAndMapImageStore.find({
//       disinfectionTime: { $gte: startDate, $lte: endDate },
//     });
//     if (records.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No disinfection records found for the specified time range.",
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       message: "Disinfection records retrieved successfully.",
//       data: records,
//     });
//   } catch (error) {
//     console.error("Error fetching disinfection records:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error.",
//       error: error.message,
//     });
//   }
// };
