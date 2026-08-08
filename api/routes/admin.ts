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

    const isNewRegistration = !existingUser || req.body.isSignup === true;

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

    // Send welcome email if new registration and email service credentials exist
    if (isNewRegistration) {
      const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
      const emailPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

      if (emailUser && emailPass) {
        try {
          const nodemailer = await import('nodemailer');
          const transporter = process.env.SMTP_HOST
            ? nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 587,
                secure: process.env.SMTP_SECURE === 'true',
                auth: { user: emailUser, pass: emailPass },
              })
            : nodemailer.createTransport({
                service: 'gmail',
                auth: { user: emailUser, pass: emailPass },
              });

          const userName = fullName || cleanEmail.split('@')[0];

          await transporter.sendMail({
            from: `"FlowTrack Team" <${emailUser}>`,
            to: cleanEmail,
            subject: '🎉 Welcome to FlowTrack - Account Created Successfully!',
            text: `Hi ${userName},\n\nWelcome to FlowTrack! Your account (${cleanEmail}) has been successfully created.\n\nThank you for joining FlowTrack!`,
            html: `<div style="font-family: Arial, sans-serif; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 12px; max-width: 520px; margin: 0 auto; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
              <div style="text-align: center; padding-bottom: 16px; border-bottom: 1px solid #334155;">
                <h1 style="color: #3b82f6; margin: 0; font-size: 24px; letter-spacing: -0.5px;">FlowTrack</h1>
                <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Smart Work & Organization Management</p>
              </div>
              <div style="padding: 20px 0;">
                <h2 style="color: #38bdf8; font-size: 20px; margin-top: 0;">🎉 Welcome, ${userName}!</h2>
                <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">Thank you for registering with <strong>FlowTrack</strong>! Your account has been successfully created and configured.</p>
                <div style="background: #1e293b; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
                  <p style="margin: 0; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Registered Account Email</p>
                  <p style="margin: 6px 0 0 0; font-size: 15px; color: #38bdf8; font-family: monospace; font-weight: bold;">${cleanEmail}</p>
                </div>
                <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">You can now log in anytime to track tasks, organize projects, and collaborate seamlessly.</p>
              </div>
              <div style="border-top: 1px solid #334155; padding-top: 16px; text-align: center;">
                <p style="color: #64748b; font-size: 11px; margin: 0;">&copy; ${new Date().getFullYear()} FlowTrack Inc. All rights reserved.</p>
              </div>
            </div>`,
          });
          console.log(`[FlowTrack Welcome Mail] Welcome email sent to ${cleanEmail}`);
        } catch (mailErr) {
          console.error('[FlowTrack Welcome Mail Error]:', mailErr);
        }
      }
    }

    res.status(200).json({ success: true, isNewUser: isNewRegistration, data: updatedUser });
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

// Store active OTPs in memory with timestamp
const otpStore: Record<string, { code: string; expiresAt: number }> = {};

// POST /api/admin/request-otp - Generate and send OTP to admin email
router.post('/request-otp', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: 'Email is required' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
      return;
    }

    // Generate random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[cleanEmail] = {
      code: generatedOtp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes validity
    };

    // Attempt to send via Nodemailer using EMAIL_USER & EMAIL_PASS (Gmail App Password) or SMTP credentials
    const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
    const emailPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

    if (emailUser && emailPass) {
      try {
        const nodemailer = await import('nodemailer');
        
        const transporter = process.env.SMTP_HOST
          ? nodemailer.createTransport({
              host: process.env.SMTP_HOST,
              port: Number(process.env.SMTP_PORT) || 587,
              secure: process.env.SMTP_SECURE === 'true',
              auth: { user: emailUser, pass: emailPass },
            })
          : nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: emailUser,
                pass: emailPass,
              },
            });

        await transporter.sendMail({
          from: `"FlowTrack Admin Security" <${emailUser}>`,
          to: cleanEmail,
          subject: 'Admin Password Recovery OTP Code - FlowTrack',
          text: `Your Admin Panel Security OTP Code is: ${generatedOtp}. This code expires in 10 minutes.`,
          html: `<div style="font-family: Arial, sans-serif; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 12px; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #3b82f6; margin-top: 0;">FlowTrack Admin Security</h2>
            <p style="font-size: 14px; color: #cbd5e1;">Your 6-digit password recovery OTP code is:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #38bdf8; background: #1e293b; padding: 16px 24px; border-radius: 8px; text-align: center; margin: 16px 0;">
              ${generatedOtp}
            </div>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 16px;">This security code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
          </div>`,
        });
        console.log(`[FlowTrack Security] OTP email successfully dispatched to ${cleanEmail}`);
      } catch (mailErr: any) {
        console.error('[Nodemailer Error] Failed to send OTP email:', mailErr);
      }
    } else {
      console.log(`[FlowTrack Security] EMAIL_USER/EMAIL_PASS environment variables not set. Generated OTP for ${cleanEmail}: ${generatedOtp}`);
    }

    res.status(200).json({
      success: true,
      message: `Security OTP code generated and sent to ${cleanEmail}. Please check your mail inbox!`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to generate OTP code', error: error.message });
  }
});

// POST /api/admin/verify-otp - Verify admin OTP code
router.post('/verify-otp', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(400).json({ success: false, message: 'Email and OTP code are required' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();
    const record = otpStore[cleanEmail];

    if (!record) {
      res.status(400).json({ success: false, message: 'No OTP request found. Please request a new code.' });
      return;
    }

    if (Date.now() > record.expiresAt) {
      delete otpStore[cleanEmail];
      res.status(400).json({ success: false, message: 'OTP code has expired. Please request a new code.' });
      return;
    }

    if (record.code !== cleanOtp) {
      res.status(400).json({ success: false, message: 'Invalid OTP code. Please check your email and try again.' });
      return;
    }

    // OTP Verified! Clear used OTP
    delete otpStore[cleanEmail];

    res.status(200).json({
      success: true,
      message: 'OTP code verified successfully!',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error verifying OTP code', error: error.message });
  }
});

// POST /api/admin/send-invite - Send invitation email to team member
router.post('/send-invite', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, role, orgName, orgCode, inviterName } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: 'Email address is required' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name || cleanEmail.split('@')[0];
    const cleanOrgCode = orgCode || 'APEX-8921';
    const cleanOrgName = orgName || 'Apex Tech & Education Academy';
    const cleanInviter = inviterName || 'Organization Admin';

    // Protocol & Host for generated link
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol || 'https';
    const inviteUrl = `${protocol}://${host}/?inviteEmail=${encodeURIComponent(cleanEmail)}&inviteName=${encodeURIComponent(cleanName)}&inviteOrgCode=${encodeURIComponent(cleanOrgCode)}`;

    const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
    const emailPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

    if (emailUser && emailPass) {
      try {
        const nodemailer = await import('nodemailer');
        const transporter = process.env.SMTP_HOST
          ? nodemailer.createTransport({
              host: process.env.SMTP_HOST,
              port: Number(process.env.SMTP_PORT) || 587,
              secure: process.env.SMTP_SECURE === 'true',
              auth: { user: emailUser, pass: emailPass },
            })
          : nodemailer.createTransport({
              service: 'gmail',
              auth: { user: emailUser, pass: emailPass },
            });

        await transporter.sendMail({
          from: `"FlowTrack Invitations" <${emailUser}>`,
          to: cleanEmail,
          subject: `📩 You are invited to join ${cleanOrgName} on FlowTrack!`,
          text: `Hi ${cleanName},\n\n${cleanInviter} has invited you to join ${cleanOrgName} on FlowTrack as a ${role || 'Team Member'}.\n\nClick the link below to accept the invitation and set up your account:\n${inviteUrl}\n\nOrganization Code: ${cleanOrgCode}`,
          html: `<div style="font-family: Arial, sans-serif; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 12px; max-width: 540px; margin: 0 auto; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
            <div style="text-align: center; padding-bottom: 16px; border-bottom: 1px solid #334155;">
              <h1 style="color: #3b82f6; margin: 0; font-size: 24px; letter-spacing: -0.5px;">FlowTrack</h1>
              <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Team Workspace Invitation</p>
            </div>
            <div style="padding: 24px 0;">
              <h2 style="color: #38bdf8; font-size: 20px; margin-top: 0;">👋 You're Invited to Join ${cleanOrgName}!</h2>
              <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
                <strong>${cleanInviter}</strong> has invited you (<strong>${cleanEmail}</strong>) to join their workspace on <strong>FlowTrack</strong> as <strong>${role || 'Team Member'}</strong>.
              </p>
              
              <div style="background: #1e293b; padding: 18px; border-radius: 12px; margin: 20px 0; border: 1px solid #334155;">
                <p style="margin: 0 0 6px 0; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Organization Code</p>
                <p style="margin: 0; font-size: 18px; color: #38bdf8; font-family: monospace; font-weight: bold; letter-spacing: 2px;">${cleanOrgCode}</p>
              </div>

              <div style="text-align: center; margin: 28px 0;">
                <a href="${inviteUrl}" target="_blank" style="display: inline-block; background: #3b82f6; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: bold; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);">
                  Accept Invitation & Join Team &rarr;
                </a>
              </div>

              <p style="font-size: 12px; color: #64748b; line-height: 1.5; text-align: center;">
                Clicking the button above will automatically fill your account details and Organization Code.
              </p>
            </div>
            <div style="border-top: 1px solid #334155; padding-top: 16px; text-align: center;">
              <p style="color: #64748b; font-size: 11px; margin: 0;">&copy; ${new Date().getFullYear()} FlowTrack Inc. All rights reserved.</p>
            </div>
          </div>`,
        });
        console.log(`[FlowTrack Invite] Sent invitation email to ${cleanEmail}`);
      } catch (mailErr) {
        console.error('[FlowTrack Invite Mail Error]:', mailErr);
      }
    }

    res.status(200).json({
      success: true,
      message: `Invitation processed for ${cleanEmail}`,
      inviteUrl,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error sending invite', error: error.message });
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
