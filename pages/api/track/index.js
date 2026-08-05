import connectDB from '../../../lib/db.js';
import Track from '../../../models/Track.js';

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { trackingId, status } = req.query;
        const query = {};
        if (trackingId) query.trackingId = { $regex: String(trackingId), $options: 'i' };
        if (status) query.status = String(status);

        const tracks = await Track.find(query).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, count: tracks.length, data: tracks });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

    case 'POST':
      try {
        const { trackingId, title, itemName, status, currentLocation, senderInfo, receiverInfo } = req.body;
        const finalTitle = title || itemName;

        if (!finalTitle) {
          return res.status(400).json({ success: false, message: 'Title or itemName is required.' });
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

        return res.status(201).json({ success: true, message: 'Created successfully', data: newTrack });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

    case 'PUT':
    case 'PATCH':
      try {
        const { trackingId, title, itemName, status, currentLocation, senderInfo, receiverInfo } = req.body;
        if (!trackingId) {
          return res.status(400).json({ success: false, message: 'trackingId is required for update.' });
        }

        const updateData = {};
        if (title || itemName) updateData.title = title || itemName;
        if (status) updateData.status = status;
        if (currentLocation) updateData.currentLocation = currentLocation;
        if (senderInfo) updateData.senderInfo = senderInfo;
        if (receiverInfo) updateData.receiverInfo = receiverInfo;

        const updatedTrack = await Track.findOneAndUpdate(
          { trackingId },
          { $set: updateData },
          { new: true, runValidators: true }
        );

        if (!updatedTrack) {
          return res.status(404).json({ success: false, message: 'Track not found.' });
        }

        return res.status(200).json({ success: true, message: 'Updated successfully', data: updatedTrack });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

    case 'DELETE':
      try {
        const { trackingId } = req.query;
        if (!trackingId) {
          return res.status(400).json({ success: false, message: 'trackingId parameter is required.' });
        }

        const deletedTrack = await Track.findOneAndDelete({ trackingId: String(trackingId) });
        if (!deletedTrack) {
          return res.status(404).json({ success: false, message: 'Track not found.' });
        }

        return res.status(200).json({ success: true, message: 'Deleted successfully', data: deletedTrack });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
      return res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
  }
}
