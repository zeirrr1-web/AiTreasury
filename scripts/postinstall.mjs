import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const binDir = join(process.cwd(), "node_modules", ".bin");
mkdirSync(binDir, { recursive: true });

const distShim = join(binDir, "dist");
writeFileSync(
  distShim,
  `#!/usr/bin/env sh\n# Vercel compatibility shim when Build Command is set to \"dist\"\nexec next build \"$@\"\n`,
  "utf8"
);
chmodSync(distShim, 0o755);
