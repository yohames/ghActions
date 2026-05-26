import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as path from 'path';
import * as fs from 'fs';

async function run(): Promise<void> {
  try {
    const targetDir = core.getInput("target-dir", { required: true });
    // Resolve the absolute path cleanly
    const workspacePath = process.env.GITHUB_WORKSPACE || process.cwd();
    const executionPath = path.isAbsolute(targetDir) 
      ? targetDir 
      : path.resolve(workspacePath, targetDir);

    core.info(`📍 Workspace Root: ${workspacePath}`);
    core.info(`📁 Forcing execution context to: ${executionPath}`);

    // Verification check to see if package.json actually exists here
    const manifestPath = path.join(executionPath, 'package.json');
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`CRITICAL: package.json not found at ${manifestPath}. Current directory contents: ${fs.readdirSync(executionPath).join(', ')}`);
    }

    const options = { cwd: executionPath };
    // Step 1: Quality Check (Linting)
    core.info('🚀 Running linting script via pnpm...');
    await exec.exec("npx", ["oxlint", "--", targetDir]);

    // Step 2: Style Check (Formatting)
    core.info('✨ Running formatting check via pnpm...');
    await exec.exec("npx", ["oxfmt", "--", targetDir]);

    // Step 3: Compilation (Compilation happens ONLY if style/lint pass)
    core.info('📦 Building TypeScript project via pnpm...');
    await exec.exec("pnpm", ["run", "build"], options);
    core.info('✅ Pipeline passed! Code is clean, formatted, and successfully built.');
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();
