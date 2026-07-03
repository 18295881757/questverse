import { rm } from "node:fs/promises";
import { join, resolve } from "node:path";

const projectRoot = resolve(process.cwd());
const nextDir = resolve(join(projectRoot, ".next"));

if (!nextDir.startsWith(projectRoot)) {
  throw new Error("Refusing to remove a path outside the project root.");
}

await rm(nextDir, { recursive: true, force: true });
