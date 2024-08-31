import { execSync } from "child_process";

export function runShellCommand(command: string, options: { cwd: string }) {
  execSync(command, { stdio: "inherit", ...options });
}
