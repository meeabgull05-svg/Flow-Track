import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICurrentLocation {
  latitude?: number;
  longitude?: number;
  address?: string;
}

export interface IPersonInfo {
  name?: string;
  contact?: string;
}

export interface ITrack extends Document {
  trackingId: string;
  title: string;
  itemName?: string;
  status: 'Pending' | 'In-Transit' | 'Delivered' | 'Cancelled';
  currentLocation?: ICurrentLocation;
  senderInfo?: IPersonInfo;
  receiverInfo?: IPersonInfo;
  createdAt: Date;
  updatedAt: Date;
}

const TrackSchema = new Schema<ITrack>(
  {
    trackingId: {
      type: String,
      required: [true, 'trackingId is required'],
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'title or itemName is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'In-Transit', 'Delivered', 'Cancelled'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Pending',
    },
    currentLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
      address: { type: String, trim: true },
    },
    senderInfo: {
      name: { type: String, trim: true },
      contact: { type: String, trim: true },
    },
    receiverInfo: {
      name: { type: String, trim: true },
      contact: { type: String, trim: true },
    },
  },
  {
    timestamps: true,
  }
);

// Reuse compiled model if already defined in hot-reloading/serverless environment
const Track: Model<ITrack> = mongoose.models.Track || mongoose.model<ITrack>('Track', TrackSchema);

export default Track;
