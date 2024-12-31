import { Schema, model } from 'mongoose';

const SwapTestLocationSchema = new Schema({
  swapTestLocation: {
    type: String,
    required: true,
  },
  beforeSwap: {
    type: String,
    required: true,
  },
  afterSwap: {
    type: String,
    required: true,
  },
});

const SwapTestSchema = new Schema({
  emailId: {
    type: String,
    required: true,
  },
  robotId: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  subLocation: {
    type: String,
    required: true,
  },
  mapName: {
    type: String,
    required: true,
  },
  swapTestLocations: [SwapTestLocationSchema],
}, { timestamps: true });

const SwapTest = model('SwapTest', SwapTestSchema);

export default SwapTest;
