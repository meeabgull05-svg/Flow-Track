import React from 'react';
import { X, ShieldCheck, UserCheck, Key, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (newUser: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
}) => {
  if (!isOpen) return null;

  const handleToggleSignIn = () => {
    if (user.isSignedIn) {
      onUpdateUser({
        id: 'guest',
        name: 'Guest User',
        email: 'guest@flowtrack.io',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'Guest',
        isSignedIn: false,
      });
    } else {
      onUpdateUser({
        id: 'usr_clerk_flowtrack_001',
        name: 'Meeab Gull',
        email: 'meeabgull05@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: 'Pro Developer',
        isSignedIn: true,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">Clerk Authentication & Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Status Card */}
        <div className="p-5 space-y-4">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full ring-2 ring-indigo-500/50 object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white truncate">{user.name}</h3>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-indigo-950 text-indigo-300 font-mono border border-indigo-800">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{user.isSignedIn ? 'Clerk OAuth Session Active' : 'Guest Local Mode'}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>User Sub ID:</span>
              <span className="font-mono text-slate-200">{user.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Auth Provider:</span>
              <span className="font-mono text-indigo-400">Clerk Auth / Google OAuth</span>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={handleToggleSignIn}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              user.isSignedIn
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25'
            }`}
          >
            {user.isSignedIn ? (
              <>
                <span>Switch to Guest Local Mode</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>Sign In as Pro Developer</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
