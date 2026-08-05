import { Router, Request, Response } from 'express';
import connectDB from '../../lib/db.js';
import Track from '../../models/Track.js';

const router = Router();

// GET all tracking records
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    await connectDB();
    const records = await Track.find({}).sort({ createdAt: -1 }).limit(100);
    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error fetching tracks", error: error.message });
  }
});

// GET specific tracking record
router.get('/:trackingId', async (req: Request, res: Response): Promise<void> => {
  try {
    await connectDB();
    const { trackingId } = req.params;
    const record = await Track.findOne({ trackingId });
    if (!record) {
      res.status(404).json({ success: false, message: `Tracking record with ID '${trackingId}' not found` });
      return;
    }
    res.status(200).json({ success: true, data: record });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error fetching record", error: error.message });
  }
});

// POST new tracking record
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    await connectDB();
    const { trackingId, title, itemName, status, currentLocation, senderInfo, receiverInfo } = req.body;
    const finalTitle = title || itemName;
    if (!finalTitle) {
      res.status(400).json({ success: false, message: 'Field "title" or "itemName" is required.' });
      return;
    }
    const finalTrackingId = trackingId || `TRK-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTrack = await Track.create({
      trackingId: finalTrackingId,
      title: finalTitle,
      status: status || "Pending",
      currentLocation,
      senderInfo,
      receiverInfo
    });
    res.status(201).json({ success: true, message: "Tracking record created successfully", data: newTrack });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: "Duplicate trackingId. A record with this ID already exists." });
      return;
    }
    res.status(500).json({ success: false, message: "Error creating tracking record", error: error.message });
  }
});

// Update logic
const handleUpdate = async (req: Request, res: Response): Promise<void> => {
  try {
    await connectDB();
    const trackingIdParam = req.params.trackingId || req.body.trackingId;
    if (!trackingIdParam) {
      res.status(400).json({ success: false, message: "trackingId parameter is required for update." });
      return;
    }
    const { title, itemName, status, currentLocation, senderInfo, receiverInfo } = req.body;
    const updateData: any = {};
    if (title || itemName) updateData.title = title || itemName;
    if (status) updateData.status = status;
    if (currentLocation) updateData.currentLocation = currentLocation;
    if (senderInfo) updateData.senderInfo = senderInfo;
    if (receiverInfo) updateData.receiverInfo = receiverInfo;
    const updatedRecord = await Track.findOneAndUpdate(
      { trackingId: trackingIdParam },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!updatedRecord) {
      res.status(404).json({ success: false, message: `No tracking record found with ID '${trackingIdParam}'` });
      return;
    }
    res.status(200).json({ success: true, message: "Record updated successfully", data: updatedRecord });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error updating tracking record", error: error.message });
  }
};

router.put('/:trackingId', handleUpdate);
router.patch('/:trackingId', handleUpdate);
router.put('/', handleUpdate);
router.patch('/', handleUpdate);

// DELETE tracking record
router.delete('/:trackingId', async (req: Request, res: Response): Promise<void> => {
  try {
    await connectDB();
    const trackingIdParam = req.params.trackingId || req.query.trackingId;
    if (!trackingIdParam) {
      res.status(400).json({ success: false, message: "trackingId is required for deletion." });
      return;
    }
    const deleted = await Track.findOneAndDelete({ trackingId: String(trackingIdParam) });
    if (!deleted) {
      res.status(404).json({ success: false, message: `Record with trackingId '${trackingIdParam}' not found.` });
      return;
    }
    res.status(200).json({ success: true, message: "Tracking record deleted successfully", data: deleted });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error deleting tracking record", error: error.message });
  }
});

export default router;
