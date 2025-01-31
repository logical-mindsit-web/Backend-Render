// models/FeetData.js
import { Schema, model } from 'mongoose';

const FeetDataSchema = new Schema({
    feet: { type: String, required: true },
    seconds: { type: String, required: true },
});

export default model('DisinfectionTime', FeetDataSchema);