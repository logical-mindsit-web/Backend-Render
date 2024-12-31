// import { Schema, model } from "mongoose";

// const coordinateSchema = new Schema({
//   objectname: { type: String, required: true },
//   object_coordinate: {
//     x: { type: Number, required: true },
//     y: { type: Number, required: true },
//     angle: { type: Number, default: 0.0 }
//   }
// });

// const dataSchema = new Schema({
//   emailId:{type:String ,required:true},
//   robotId:{type:String,required:true},
//   coordinates: { type: [coordinateSchema], required: true },
//   map_name: { type: String, required: true },
//   map_image: { type: Buffer, required: true },
//   date: { type: Date, default: Date.now },
// },{
//   timestamps: true,
// });

// const Mode = model("Map", dataSchema);
// export default Mode;

import { Schema, model } from "mongoose";

const coordinateSchema = new Schema({
  objectname: { type: String }, // removed required: true
  object_coordinate: {
    x: { type: Number },
    y: { type: Number },
    angle: { type: Number, default: 0.0 }
  }
});

const dataSchema = new Schema({
  emailId: { type: String, required: true },
  robotId: { type: String, required: true },
  coordinates: { type: [coordinateSchema], required: false  },
  map_name: { type: String, required: true },
  map_image: { type: Buffer, required: true },
  date: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

const Mode = model("Map", dataSchema);
export default Mode;
