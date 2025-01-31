// controllers/feetDataController.js
import FeetData from "../Models/DisinfectionTime-Model.js";

export const getAllFeetData = async (req, res) => {
  try {
    // Fetch all documents from the FeetData collection
    const feetData = await FeetData.find();

    // Transform the data into the desired format
    const formattedData = feetData.reduce((acc, item) => {
      acc[`${item.feet} feet`] = item.seconds.toString(); // Convert value to string
      return acc;
    }, {});

    // Respond with the formatted data
    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while fetching the feet data.',
      error: error.message,
    });
  }
};