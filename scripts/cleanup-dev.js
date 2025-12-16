#!/usr/bin/env node

/**
 * Cleanup script for dev environment issues
 * Automatically kills stale processes, removes lock files, and frees ports
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORTS = [3000, 3001]; // Marketing and Studio ports
const LOCK_FILES = [
  'apps/marketing/.dev-lock',
  'apps/marketing/.next/dev/lock',
  'apps/studio/.next/dev/lock',
];

function killProcessesOnPort(port) {
  try {
    const result = execSync(`lsof -ti:${port} 2>/dev/null || echo ""`, { encoding: 'utf-8' }).trim();
    const pids = result ? result.split('\n').filter(Boolean) : [];
    
    if (pids.length > 0) {
      console.log(`🔪 Killing ${pids.length} process(es) on port ${port}...`);
      pids.forEach(pid => {
        try {
          execSync(`kill -9 ${pid} 2>/dev/null`, { encoding: 'utf-8' });
          console.log(`   ✓ Killed PID ${pid}`);
        } catch (e) {
          console.log(`   ⚠ Failed to kill PID ${pid}: ${e.message}`);
        }
      });
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

function killDevProcesses() {
  try {
    // Kill Next.js dev processes
    const nextProcesses = execSync(
      `ps aux | grep -E "(next dev|node.*dev-debug)" | grep -v grep | awk '{print $2}' || echo ""`,
      { encoding: 'utf-8' }
    ).trim();
    
    const pids = nextProcesses ? nextProcesses.split('\n').filter(Boolean) : [];
    
    if (pids.length > 0) {
      console.log(`🔪 Killing ${pids.length} dev process(es)...`);
      pids.forEach(pid => {
        try {
          execSync(`kill -9 ${pid} 2>/dev/null`, { encoding: 'utf-8' });
          console.log(`   ✓ Killed PID ${pid}`);
        } catch (e) {
          // Process might already be dead
        }
      });
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

function removeLockFiles() {
  const rootDir = path.resolve(__dirname, '..');
  let removed = 0;
  
  LOCK_FILES.forEach(lockFile => {
    const fullPath = path.join(rootDir, lockFile);
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
        console.log(`🗑️  Removed: ${lockFile}`);
        removed++;
      } catch (e) {
        console.log(`   ⚠ Failed to remove ${lockFile}: ${e.message}`);
      }
    }
  });
  
  return removed > 0;
}

function main() {
  console.log('🧹 Cleaning up dev environment...\n');
  
  let cleaned = false;
  
  // Kill processes on ports
  PORTS.forEach(port => {
    if (killProcessesOnPort(port)) {
      cleaned = true;
    }
  });
  
  // Kill dev processes
  if (killDevProcesses()) {
    cleaned = true;
  }
  
  // Remove lock files
  if (removeLockFiles()) {
    cleaned = true;
  }
  
  console.log('');
  if (cleaned) {
    console.log('✅ Cleanup complete! You can now run `pnpm dev` safely.');
  } else {
    console.log('✨ No cleanup needed - everything looks good!');
  }
}

main();

