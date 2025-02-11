import RobotAnalytics from "../Models/Analytics-Model2.js";
import Robot from "../Models/Robot-Model.js"

export const saveRobotAnalytics2 = async (req, res) => {
  try {
    const {
      robotId,
      emailId,
      model,
      date,
      mode,
      status,
      disinfectionStartTime,
      disinfectionEndTime,
      disinfectionTimeTakenSeconds,
      batteryStartPercentage,
      batteryEndPercentage,
      batteryUsageInPercentage,
      uvLightUsageInSeconds,
      motorRuntimeInSeconds,
      distanceTravelledInMeters,
      uvLightTimes,
      motionDetectionTimes,
      objectDetection,
    } = req.body;

    // Validate motionDetectionTimes structure to allow either resumeTime or abortedTime
    if (motionDetectionTimes) {
      for (const entry of motionDetectionTimes) {
        if (entry.resumeTime && entry.abortedTime) {
          return res.status(400).json({
            message:
              "Each motion detection entry must have either 'resumeTime' or 'abortedTime', but not both.",
          });
        }
      }
    }
    // Validate objectDetection structure
    if (objectDetection) {
      for (const entry of objectDetection) {
        if (
          !entry.objectName ||
          !entry.objectCoordinate ||
          typeof entry.distance !== "number" ||
          typeof entry.accuracyPercentage !== "number"
        ) {
          return res.status(400).json({
            message:
              "Each object detection entry must include objectName, objectCoordinate, distance (number), and accuracyPercentage (number).",
          });
        }

        // Validate objectCoordinate structure
        const { objectCoordinate } = entry;
        if (
          typeof objectCoordinate.x !== "number" ||
          typeof objectCoordinate.y !== "number"
        ) {
          return res.status(400).json({
            message:
              "ObjectCoordinate must include valid x and y values (numbers).",
          });
        }
      }
    }
    // Create a new instance of RobotAnalytics
    const robotAnalytics = new RobotAnalytics({
      robotId,
      emailId,
      model,
      date,
      mode,
      status,
      disinfectionStartTime,
      disinfectionEndTime,
      disinfectionTimeTakenSeconds,
      batteryStartPercentage,
      batteryEndPercentage,
      batteryUsageInPercentage,
      uvLightUsageInSeconds,
      motorRuntimeInSeconds,
      distanceTravelledInMeters,
      uvLightTimes,
      motionDetectionTimes,
      objectDetection,
    });

    // Save the data to the database
    const savedData = await robotAnalytics.save();

    res.status(201).json({
      message: "Robot Analytics data saved successfully",
      data: savedData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error saving Robot Analytics data",
      error: error.message,
    });
  }
};

// GET Robot Analytics Data by robotId (for test purpose)
export const getRobotAnalyticsByRobotId = async (req, res) => {
  try {
    // Extract robotId from query params or request body
    const { robotId } = req.query;

    // Check if robotId is provided
    if (!robotId) {
      return res.status(400).json({ message: "robotId is required" });
    }

    // Find the robot by robotId and fetch only the 'amps' field
    const robot = await Robot.findOne({ robotId }).select("amps");

    if (!robot) {
      return res.status(404).json({ message: `No robot found for robotId: ${robotId}` });
    }
    // Find all robot analytics records with the provided robotId
    const robotAnalyticsData = await RobotAnalytics.find({ robotId });

    // Check if data exists for the given robotId
    if (robotAnalyticsData.length === 0) {
      return res
        .status(404)
        .json({ message: `No analytics data found for robotId: ${robotId}` });
    }

    // Return the fetched data
    res.status(200).json({
      message: "Robot Analytics data fetched successfully",
      data: robotAnalyticsData,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      message: "Error fetching Robot Analytics data",
      error: error.message,
    });
  }
};
