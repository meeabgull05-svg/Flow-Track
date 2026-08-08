import { Router, Request, Response } from 'express';
import connectDB from '../../lib/db.js';
import User from '../../models/User.js';

const router = Router();

// POST /api/admin/log - Record signup or login details
router.post('/log', async (req: Request, res: Response): Promise<void> => {
  try {
    await connectDB();
    const { fullName, email, password, photoURL, accountType, orgName, orgType, orgCode } = req.body;

    if (!email) {
      res.status(400).json({ success: false, message: 'Email is required' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user is suspended
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser && existingUser.isSuspended) {
      res.status(403).json({
        success: false,
        isSuspended: true,
        message: 'Your account has been suspended by an administrator. Access denied.',
      });
      return;
    }

    // Upsert user by email or create new record so we always have latest details and lastLoginAt
    const updatedUser = await User.findOneAndUpdate(
      { email: cleanEmail },
      {
        $set: {
          fullName: fullName || cleanEmail.split('@')[0],
          password: password || '[Firebase Google Auth]',
          photoURL: photoURL || undefined,
          accountType: accountType || 'Individual',
          orgName: orgName || undefined,
          orgType: orgType || undefined,
          orgCode: orgCode || undefined,
          lastLoginAt: new Date(),
        }
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error logging user info', error: error.message });
  }
});

// GET /api/admin/users - Get all logged user credentials
router.get('/users', async (req: Request, res: Response): Promise<void> => {
  try {
    await connectDB();
    const users = await User.find({}).sort({ lastLoginAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching logged users', error: error.message });
  }
});

// GET /api/admin/status - Check suspension status of a single user by email
router.get('/status', async (req: Request, res: Response): Promise<void> => {
  try {
    await connectDB();
    const email = (req.query.email as string || '').toLowerCase().trim();
    if (!email) {
      res.status(200).json({ success: true, isSuspended: false });
      return;
    }
    const userRecord = await User.findOne({ email }).select('isSuspended');
    res.status(200).json({
      success: true,
      isSuspended: !!(userRecord && userRecord.isSuspended),
    });
  } catch (error: any) {
    res.status(200).json({ success: false, isSuspended: false });
  }
});

// PATCH /api/admin/users/:id/suspend - Toggle or set suspension status of a user
router.patch('/users/:id/suspend', async (req: Request, res: Response): Promise<void> => {
  try {
    await connectDB();
    const { id } = req.params;
    const { isSuspended } = req.body;

    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      res.status(404).json({ success: false, message: 'User record not found' });
      return;
    }

    const targetStatus = typeof isSuspended === 'boolean' ? isSuspended : !userToUpdate.isSuspended;
    userToUpdate.isSuspended = targetStatus;
    await userToUpdate.save();

    res.status(200).json({
      success: true,
      message: `User ${targetStatus ? 'suspended' : 'activated'} successfully`,
      data: userToUpdate,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error updating user suspension status', error: error.message });
  }
});

// DELETE /api/admin/users/:id - Delete a user record from logs
router.delete('/users/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    await connectDB();
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'User record not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'User log deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error deleting user log', error: error.message });
  }
});

// DELETE /api/admin/users - Clear all logs
router.delete('/users', async (req: Request, res: Response): Promise<void> => {
  try {
    await connectDB();
    await User.deleteMany({});
    res.status(200).json({ success: true, message: 'All user credentials and organization logs cleared successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error clearing logs', error: error.message });
  }
});

export default router;
