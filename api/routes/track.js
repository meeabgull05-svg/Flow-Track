import { Router } from 'express';
import connectDB from '../../lib/db.js';
import Track from '../../models/Track.js';

const router = Router();

// GET /api/track - Fetch all tracking records or search by ?trackingId=...
router.get('/', async (req, res) => {
  try {
    await connectDB();
    const { trackingId, status } = req.query;

    const query = {};
    if (trackingId) {
      query.trackingId = { $regex: String(trackingId), $options: 'i' };
    }
    if (status) {
      query.status = String(status);
    }

    const records = await Track.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching tracks', error: error.message });
  }
});

// GET /api/track/:trackingId - Fetch single tracking record
router.get('/:trackingId', async (req, res) => {
  try {
    await connectDB();
    const { trackingId } = req.params;

    const record = await Track.findOne({ trackingId });
    if (!record) {
      return res.status(404).json({ success: false, message: `Tracking record with ID '${trackingId}' not found` });
    }

    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching record', error: error.message });
  }
});

// POST /api/track - Create a new tracking item
router.post('/', async (req, res) => {
  try {
    await connectDB();
    const { trackingId, title, itemName, status, currentLocation, senderInfo, receiverInfo } = req.body;

    const finalTitle = title || itemName;
    if (!finalTitle) {
      return res.status(400).json({ success: false, message: 'Field "title" or "itemName" is required.' });
    }

    const finalTrackingId = trackingId || `TRK-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTrack = await Track.create({
      trackingId: finalTrackingId,
      title: finalTitle,
      status: status || 'Pending',
      currentLocation,
      senderInfo,
      receiverInfo,
    });

    res.status(201).json({ success: true, message: 'Tracking record created successfully', data: newTrack });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Duplicate trackingId. A record with this ID already exists.' });
    }
    res.status(500).json({ success: false, message: 'Error creating tracking record', error: error.message });
  }
});

// PUT/PATCH /api/track/:trackingId - Update status and location
const handleUpdate = async (req, res) => {
  try {
    await connectDB();
    const trackingIdParam = req.params.trackingId || req.body.trackingId;

    if (!trackingIdParam) {
      return res.status(400).json({ success: false, message: 'trackingId parameter is required for update.' });
    }

    const { title, itemName, status, currentLocation, senderInfo, receiverInfo } = req.body;
    const updateData = {};

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
      return res.status(404).json({ success: false, message: `No tracking record found with ID '${trackingIdParam}'` });
    }

    res.status(200).json({ success: true, message: 'Record updated successfully', data: updatedRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating tracking record', error: error.message });
  }
};

router.put('/:trackingId', handleUpdate);
router.patch('/:trackingId', handleUpdate);
router.put('/', handleUpdate);
router.patch('/', handleUpdate);

// DELETE /api/track/:trackingId - Remove a tracking record
router.delete('/:trackingId', async (req, res) => {
  try {
    await connectDB();
    const trackingIdParam = req.params.trackingId || req.query.trackingId;

    if (!trackingIdParam) {
      return res.status(400).json({ success: false, message: 'trackingId is required for deletion.' });
    }

    const deleted = await Track.findOneAndDelete({ trackingId: String(trackingIdParam) });
    if (!deleted) {
      return res.status(404).json({ success: false, message: `Record with trackingId '${trackingIdParam}' not found.` });
    }

    res.status(200).json({ success: true, message: 'Tracking record deleted successfully', data: deleted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting tracking record', error: error.message });
  }
});

export default router;
