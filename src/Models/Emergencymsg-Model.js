import { Schema as MongooseSchema, model } from 'mongoose';

const robotmsgSchema = new MongooseSchema({
  robotId: {
    type: String,
    required: true
  },
  emailId: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  ErrorCode: {
    type: String,
    enum: ['Layoutchanged', 'Faultoccurance'], // Enum for ErrorCode
    required: true
  },
  Fault: {
    type: String,
    enum: ['Embedded', 'ROS'], // Enum for Fault
    // Conditionally required based on ErrorCode
    required: function () {
      return this.ErrorCode === 'Faultoccurance';
    }
  },
  FaultDetails: {
    type: String,
    // Conditionally required based on ErrorCode
    required: function () {
      return this.ErrorCode === 'Faultoccurance';
    }
  },
  MapName: {
    type: String,
    // Conditionally required based on ErrorCode
    required: function () {
      return this.ErrorCode === 'Layoutchanged';
    }
  },
  camera_images: [{ 
    type: String, 
    required: true 
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Robotmsg = model('RobotMsg', robotmsgSchema);

export default Robotmsg;