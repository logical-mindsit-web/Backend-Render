import SwapTest from '../Models/Swap-Model.js';

// Create a new Swap Test
export const createSwapTest = async (req, res) => {
  try {
    const { emailId, robotId, location, subLocation, mapName, swapTestLocations } = req.body;

    const newSwapTest = new SwapTest({
      emailId,
      robotId,
      location,
      subLocation,
      mapName,
      swapTestLocations,
    });

    const savedSwapTest = await newSwapTest.save();
    res.status(201).json(savedSwapTest);
  } catch (error) {
    res.status(500).json({ message: 'Error creating swap test', error });
  }
};

// Get all Swap Tests
export const getAllSwapTests = async (req, res) => {
    try {
      const swapTests = await SwapTest.find(); // Use the SwapTest model's find method
      res.status(200).json(swapTests); // Respond with the data
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving swap tests', error });
    }
  };
