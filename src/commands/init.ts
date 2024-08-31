import * as path from "path";
import * as fs from "fs";
import simpleGit from "simple-git";
import { runShellCommand } from "../helpers/runShellCommand";

export async function init(projectName: string) {
  const projectPath = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    console.error(`Error: Directory ${projectName} already exists.`);
    process.exit(1);
  }

  // Clone the repository using simple-git
  const git = simpleGit();

  try {
    console.log(`Cloning the repository into ${projectPath}...`);
    await git.clone(
      "https://github.com/AnsellMaximilian/neon-max-starter-kit.git",
      projectPath
    );

    // Change directory to the newly cloned repository
    console.log(`Installing dependencies in ${projectPath}...`);
    runShellCommand("npm install", { cwd: projectPath });

    console.log(`Project ${projectName} initialized successfully!`);
    console.log(`\nTo get started:\n`);
    console.log(`cd ${projectName}`);
    console.log(`npm run dev`);
  } catch (error) {
    console.error("Error initializing the project:", error);
    process.exit(1);
  }
}
