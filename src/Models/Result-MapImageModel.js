import { Schema, model } from "mongoose";

const disinfectedObjectSchema = new Schema({ 
  objectName: { type: String },
  elapsedTime: {type: Number,min: 0,default: 0}, 
  status: { type: String },
},{ _id: false });
const disinfectionRecordSchema = new Schema(
  {
    emailId: { type: String, required: true },
    robotId: { type: String, required: true },
    mapName: { type: String, required: true },
    resultMapImage: { type: String, required: true },  
    disinfectedObjects: [disinfectedObjectSchema], 
    disinfectionTime: {type: Date, default: Date.now  },
  },
  { timestamps: true }
);
const resultAndMapImage = model('resultAndMapImage', disinfectionRecordSchema);
export default resultAndMapImage;