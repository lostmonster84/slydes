#!/usr/bin/env node

// #region agent log
const LOG_PATH = '/Users/james/Projects/slydes/.cursor/debug.log';
const log = (location, message, data, hypothesisId) => {
  try {
    const logEntry = JSON.stringify({
      location,
      message,
      data,
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId
    }) + '\n';
    fs.appendFileSync(LOG_PATH, logEntry, 'utf8');
  } catch (e) {
    // Silently fail if logging fails
  }
};
// #endregion

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// #region agent log
log('dev-debug.js:start', 'Dev script wrapper started', { pid: process.pid }, 'A,B,C,D,E');
// #endregion

// Check what's using port 3000
function checkPort3000() {
  try {
    // #region agent log
    log('dev-debug.js:checkPort3000', 'Checking port 3000 before startup', {}, 'A,B,D');
    // #endregion
    
    const result = execSync('lsof -ti:3000 2>/dev/null || echo ""', { encoding: 'utf-8' }).trim();
    const pids = result ? result.split('\n').filter(Boolean) : [];
    
    // #region agent log
    log('dev-debug.js:checkPort3000', 'Port 3000 check result', { pids, count: pids.length }, 'A,B,D');
    // #endregion
    
    if (pids.length > 0) {
      // Get process details
      const processDetails = [];
      for (const pid of pids) {
        try {
          const psResult = execSync(`ps -p ${pid} -o pid,comm,args 2>/dev/null || echo ""`, { encoding: 'utf-8' }).trim();
          processDetails.push({ pid, details: psResult });
          
          // #region agent log
          log('dev-debug.js:checkPort3000', 'Process using port 3000', { pid, details: psResult }, 'A,B,D');
          // #endregion
        } catch (e) {
          // #region agent log
          log('dev-debug.js:checkPort3000', 'Failed to get process details', { pid, error: e.message }, 'A,B,D');
          // #endregion
        }
      }
      return { inUse: true, pids, processDetails };
    }
    
    return { inUse: false, pids: [], processDetails: [] };
  } catch (error) {
    // #region agent log
    log('dev-debug.js:checkPort3000', 'Error checking port', { error: error.message }, 'A,B,D');
    // #endregion
    return { inUse: false, pids: [], processDetails: [], error: error.message };
  }
}

// Check for lock file
function checkLockFile() {
  const lockPath = path.join(__dirname, '.next', 'dev', 'lock');
  const exists = fs.existsSync(lockPath);
  
  // #region agent log
  log('dev-debug.js:checkLockFile', 'Lock file check', { path: lockPath, exists }, 'E');
  // #endregion
  
  return { exists, path: lockPath };
}

// Create a process lock to prevent race conditions
function acquireProcessLock() {
  const lockPath = path.join(__dirname, '.dev-lock');
  const lockContent = `${process.pid}\n${Date.now()}\n`;
  
  try {
    // Try to create lock file exclusively
    const fd = fs.openSync(lockPath, 'wx');
    fs.writeSync(fd, lockContent);
    fs.closeSync(fd);
    
    // #region agent log
    log('dev-debug.js:acquireProcessLock', 'Lock acquired', { pid: process.pid, lockPath }, 'C');
    // #endregion
    
    // Cleanup on exit
    process.on('exit', () => {
      try {
        if (fs.existsSync(lockPath)) {
          fs.unlinkSync(lockPath);
        }
      } catch (e) {
        // Ignore cleanup errors
      }
    });
    
    return true;
  } catch (error) {
    if (error.code === 'EEXIST') {
      // Lock exists, check if process is still alive
      try {
        const existingLock = fs.readFileSync(lockPath, 'utf8');
        const existingPid = parseInt(existingLock.split('\n')[0]);
        
        // Check if process is still running
        try {
          process.kill(existingPid, 0); // Signal 0 checks if process exists
          // Process exists, lock is valid
          // #region agent log
          log('dev-debug.js:acquireProcessLock', 'Lock held by active process', { existingPid, lockPath }, 'C');
          // #endregion
          return false;
        } catch (e) {
          // Process doesn't exist, remove stale lock
          fs.unlinkSync(lockPath);
          // Retry acquiring lock
          return acquireProcessLock();
        }
      } catch (e) {
        // Can't read lock file, try to remove and retry
        try {
          fs.unlinkSync(lockPath);
          return acquireProcessLock();
        } catch (e2) {
          // #region agent log
          log('dev-debug.js:acquireProcessLock', 'Failed to acquire lock', { error: e2.message }, 'C');
          // #endregion
          return false;
        }
      }
    }
    
    // #region agent log
    log('dev-debug.js:acquireProcessLock', 'Error acquiring lock', { error: error.message, code: error.code }, 'C');
    // #endregion
    return false;
  }
}

// Check for multiple turbo processes
function checkTurboProcesses() {
  try {
    // #region agent log
    log('dev-debug.js:checkTurboProcesses', 'Checking for multiple turbo processes', {}, 'C');
    // #endregion
    
    const result = execSync('ps aux | grep -i "turbo dev" | grep -v grep || echo ""', { encoding: 'utf-8' }).trim();
    const processes = result ? result.split('\n').filter(Boolean) : [];
    
    // #region agent log
    log('dev-debug.js:checkTurboProcesses', 'Turbo processes found', { count: processes.length, processes }, 'C');
    // #endregion
    
    return { count: processes.length, processes };
  } catch (error) {
    // #region agent log
    log('dev-debug.js:checkTurboProcesses', 'Error checking turbo processes', { error: error.message }, 'C');
    // #endregion
    return { count: 0, processes: [], error: error.message };
  }
}

// Main execution
async function main() {
  // #region agent log
  log('dev-debug.js:main', 'Starting diagnostic checks', { cwd: process.cwd(), pid: process.pid }, 'A,B,C,D,E');
  // #endregion
  
  // Acquire process lock first to prevent race conditions
  if (!acquireProcessLock()) {
    console.error('⚠️  Another dev server instance is already starting or running.');
    console.error('   Please wait a moment and try again, or kill any existing processes.');
    // #region agent log
    log('dev-debug.js:main', 'Failed to acquire process lock, exiting', { pid: process.pid }, 'C');
    // #endregion
    process.exit(1);
  }
  
  const portCheck = checkPort3000();
  const lockCheck = checkLockFile();
  const turboCheck = checkTurboProcesses();
  
  // #region agent log
  log('dev-debug.js:main', 'All checks completed', { portCheck, lockCheck, turboCheck }, 'A,B,C,D,E');
  // #endregion
  
  // If port is in use, log details but don't start
  if (portCheck.inUse) {
    console.error('⚠️  Port 3000 is already in use by:');
    portCheck.processDetails.forEach(({ pid, details }) => {
      console.error(`   PID ${pid}: ${details}`);
    });
    console.error('\n💡 Suggestion: Kill the process(es) above or use a different port.');
    // #region agent log
    log('dev-debug.js:main', 'Port 3000 in use, exiting', { pids: portCheck.pids }, 'A,B,D');
    // #endregion
    process.exit(1);
  }
  
  // If lock file exists, warn but continue (Next.js will handle it)
  if (lockCheck.exists) {
    console.warn('⚠️  Lock file exists at:', lockCheck.path);
    console.warn('   Next.js will attempt to handle this automatically.');
  }
  
  // Start Next.js dev server
  // #region agent log
  log('dev-debug.js:main', 'Starting Next.js dev server', { command: 'next dev --port 3000' }, 'A,B,C,D,E');
  // #endregion
  
  const { spawn } = require('child_process');
  const nextProcess = spawn('npx', ['next', 'dev', '--port', '3000'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });
  
  // #region agent log
  log('dev-debug.js:main', 'Next.js process spawned', { pid: nextProcess.pid }, 'A,B,C,D,E');
  // #endregion
  
  nextProcess.on('error', (error) => {
    // #region agent log
    log('dev-debug.js:main', 'Next.js process error', { error: error.message, code: error.code }, 'A,B,C,D,E');
    // #endregion
    console.error('Failed to start Next.js:', error);
    process.exit(1);
  });
  
  nextProcess.on('exit', (code) => {
    // #region agent log
    log('dev-debug.js:main', 'Next.js process exited', { code }, 'A,B,C,D,E');
    // #endregion
    process.exit(code || 0);
  });
}

main().catch((error) => {
  // #region agent log
  log('dev-debug.js:main', 'Fatal error in main', { error: error.message, stack: error.stack }, 'A,B,C,D,E');
  // #endregion
  console.error('Fatal error:', error);
  process.exit(1);
});
