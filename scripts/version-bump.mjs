#!/usr/bin/env node

/**
 * Version Bump Script
 *
 * Usage: pnpm version:bump 0.2.0
 *
 * Updates version in all package.json files, version.ts, commits, and creates a git tag.
 */

import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// All package.json files to update
const PACKAGE_FILES = [
  'package.json',
  'apps/studio/package.json',
  'apps/marketing/package.json',
  'packages/ui/package.json',
  'packages/database/package.json',
  'packages/types/package.json',
  'packages/media/package.json',
  'packages/config/package.json',
]

// Version.ts file location
const VERSION_FILE = 'apps/studio/src/lib/version.ts'

function validateSemver(version) {
  const semverRegex = /^\d+\.\d+\.\d+$/
  if (!semverRegex.test(version)) {
    console.error(`❌ Invalid version format: "${version}"`)
    console.error('   Expected format: X.Y.Z (e.g., 1.0.0, 0.2.0)')
    process.exit(1)
  }
}

function updatePackageJson(filePath, newVersion) {
  const fullPath = join(ROOT, filePath)
  try {
    const content = JSON.parse(readFileSync(fullPath, 'utf-8'))
    const oldVersion = content.version
    content.version = newVersion
    writeFileSync(fullPath, JSON.stringify(content, null, 2) + '\n')
    console.log(`   ✓ ${filePath}: ${oldVersion} → ${newVersion}`)
  } catch (error) {
    console.error(`   ✗ Failed to update ${filePath}: ${error.message}`)
    process.exit(1)
  }
}

function updateVersionTs(newVersion) {
  const fullPath = join(ROOT, VERSION_FILE)
  try {
    const content = `export const APP_VERSION = '${newVersion}'
export const BUILD_TIME = process.env.NEXT_PUBLIC_BUILD_TIME || 'development'
export const GIT_COMMIT = process.env.NEXT_PUBLIC_GIT_COMMIT || 'local'
`
    writeFileSync(fullPath, content)
    console.log(`   ✓ ${VERSION_FILE}: updated to ${newVersion}`)
  } catch (error) {
    console.error(`   ✗ Failed to update ${VERSION_FILE}: ${error.message}`)
    process.exit(1)
  }
}

function gitCommitAndTag(version) {
  try {
    // Stage all changed files
    execSync('git add .', { cwd: ROOT, stdio: 'pipe' })

    // Commit
    execSync(`git commit -m "chore: bump version to ${version}"`, { cwd: ROOT, stdio: 'pipe' })
    console.log(`   ✓ Created commit: "chore: bump version to ${version}"`)

    // Create tag
    execSync(`git tag v${version}`, { cwd: ROOT, stdio: 'pipe' })
    console.log(`   ✓ Created tag: v${version}`)

  } catch (error) {
    console.error(`   ✗ Git operation failed: ${error.message}`)
    process.exit(1)
  }
}

// Main
const newVersion = process.argv[2]

if (!newVersion) {
  console.error('❌ No version specified')
  console.error('   Usage: pnpm version:bump 0.2.0')
  process.exit(1)
}

validateSemver(newVersion)

console.log(`\n🚀 Bumping version to ${newVersion}\n`)

console.log('📦 Updating package.json files:')
for (const file of PACKAGE_FILES) {
  updatePackageJson(file, newVersion)
}

console.log('\n📄 Updating version.ts:')
updateVersionTs(newVersion)

console.log('\n🔖 Creating git commit and tag:')
gitCommitAndTag(newVersion)

console.log(`\n✅ Done! Version bumped to ${newVersion}`)
console.log(`\n💡 Next steps:`)
console.log(`   git push origin main --tags`)
console.log('')
