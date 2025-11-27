import User from "../models/User.model.js";

let cleanerInterval = null;

export function startForgotPasswordExpiryCleaner(intervalMs = 60_000) {
  if (cleanerInterval) return; // already running
  // run immediately once, then every intervalMs
  const run = async () => {
    try {
      await User.clearExpiredForgotPasswordFlags();
    } catch (err) {
      // optional: log error
      // console.error('Expired flag cleaner error:', err);
    }
  };
  run();
  cleanerInterval = setInterval(run, intervalMs);
}

export function stopForgotPasswordExpiryCleaner() {
  if (!cleanerInterval) return;
  clearInterval(cleanerInterval);
  cleanerInterval = null;
}
