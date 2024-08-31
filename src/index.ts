#!/usr/bin/env node

import { Command } from "commander";
import { generateModel } from "./commands/generateModel";
import { init } from "./commands/init";

const program = new Command();

program
  .name("neonmax")
  .description("CLI for Neon Max Next.js OSS Starter Kit")
  .version("1.0.0");

// Define the generate:model command
program
  .command("generate:model <modelName>")
  .description("Generate a Prisma model")
  .option("-a, --action", "Generate a camelCase file under actions/ directory")
  .action((modelName, options) => {
    generateModel(modelName, options);
  });

// Initialize NeonMax Starter Kit
program
  .command("init <project-name>")
  .description("Initialize a new project by cloning the Neon Max starter kit")
  .action((projectName) => {
    init(projectName);
  });

program.parse(process.argv);
