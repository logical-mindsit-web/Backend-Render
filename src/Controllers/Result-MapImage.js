import resultAndMapImageStore from "../Models/Result-MapImageModel.js";

// POST API for creating a new disinfection record
export const postDisinfectionRecord = async (req, res) => {
  try {
    const {
      emailId,
      robotId,
      mapName,
      resultMapImage,
      disinfectionTime,
      disinfectedObjects,
    } = req.body;
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

// GET API for retrieving disinfection records by exact datetime
export const getDisinfectionRecordsByDateTime = async (req, res) => {
  try {
    const { datetime } = req.query;

    // Check if datetime parameter is provided
    if (!datetime) {
      return res.status(400).json({
        success: false,
        message: "Datetime parameter is required. Use ISO 8601 UTC format (e.g., 2025-01-30T09:04:00Z).",
      });
    }

    // Validate datetime format (ISO 8601 UTC)
    const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
    if (!isoPattern.test(datetime)) {
      return res.status(400).json({
        success: false,
        message: "Invalid datetime format. Use ISO 8601 UTC (e.g., 2025-01-30T09:04:00Z).",
      });
    }

    // Parse datetime into a Date object
    const targetDate = new Date(datetime);
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid datetime value.",
      });
    }

    // Calculate start and end of the target second (1-second range)
    const startDateTime = new Date(targetDate);
    const endDateTime = new Date(targetDate.getTime() + 999); // Add 999ms

    // Query records within the 1-second window
    const records = await resultAndMapImageStore.find({
      disinfectionTime: {
        $gte: startDateTime,
        $lte: endDateTime,
      },
    });

    if (records.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No records found for the specified datetime.",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Records retrieved successfully.",
      data: records,
    });

  } catch (error) {
    console.error("Error fetching disinfection records:", error);
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
export const getDisinfectionRecordsInTimeRange = async (req, res) => {
  try {
    const { startTime, endTime, robotId } = req.query;

    // Validate required parameters
    const missingFields = ["startTime", "endTime", "robotId"].filter(field => !req.query[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters.",
        missingFields,
      });
    }

    // Convert to Date objects
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    // Validate date format
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use ISO strings (e.g., '2024-05-20T06:00:00Z').",
      });
    }

    // Ensure startTime is not greater than endTime
    if (startDate > endDate) {
      return res.status(400).json({
        success: false,
        message: "startTime must be before or equal to endTime.",
      });
    }

    // Query database with optimized performance
    const records = await resultAndMapImageStore.find(
      {
        disinfectionTime: { $gte: startDate, $lte: endDate },
        robotId: robotId.trim(),
      }
    ).lean(); // Improves query performance by returning plain objects

    if (!records.length) {
      return res.status(404).json({
        success: false,
        message: "No disinfection records found for the specified time range.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Disinfection results retrieved successfully.",
      data: records,
    });
  } catch (error) {
    console.error("Error fetching disinfection records:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};