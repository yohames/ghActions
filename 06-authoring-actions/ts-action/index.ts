import * as core from "@actions/core";
import * as exec from "@actions/exec";

async function run(): Promise<void> {
  try {
    const targetDir = core.getInput("target-dir", { required: true });
    // Step 1: Quality Check (Linting)
    core.info('🚀 Running linting script via pnpm...');
    await exec.exec("npx", ["oxlint", "--", targetDir]);

    // Step 2: Style Check (Formatting)
    core.info('✨ Running formatting check via pnpm...');
    await exec.exec("npx", ["oxfmt", "--", targetDir]);

    // Step 3: Compilation (Compilation happens ONLY if style/lint pass)
    core.info('📦 Building TypeScript project via pnpm...');
    await exec.exec("pnpm", ["run", "build"]);
    core.info('✅ Pipeline passed! Code is clean, formatted, and successfully built.');
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();
