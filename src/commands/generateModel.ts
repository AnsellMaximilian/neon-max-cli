import * as fs from "fs";
import * as path from "path";
import { snakeCase, camelCase, upperFirst } from "lodash";

// Helper function to convert to snake_case plural
function toSnakeCasePlural(modelName: string): string {
  return snakeCase(modelName) + "s";
}

// Helper function to generate Prisma model content
function generatePrismaModelContent(modelName: string): string {
  const snakeCasePlural = toSnakeCasePlural(modelName);
  return `model ${modelName} {
  @@map("${snakeCasePlural}")

  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Add your fields here
}`;
}

// Function to generate a camelCase file in actions/
function generateActionFile(modelName: string) {
  const camelCaseName = camelCase(modelName);
  const actionFilePath = path.join(
    process.cwd(),
    `actions/${camelCaseName}.ts`
  );

  const actionFileContent = `import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new ${modelName}
export async function create${modelName}(data: any) {
  return prisma.${camelCaseName}.create({
    data,
  });
}

// Get all ${modelName}s
export async function getAll${modelName}s() {
  return prisma.${camelCaseName}.findMany();
}

// Get a single ${modelName} by ID
export async function get${modelName}ById(id: string) {
  return prisma.${camelCaseName}.findUnique({
    where: { id },
  });
}

// Update a ${modelName}
export async function update${modelName}(id: string, data: any) {
  return prisma.${camelCaseName}.update({
    where: { id },
    data,
  });
}

// Delete a ${modelName}
export async function delete${modelName}(id: string) {
  return prisma.${camelCaseName}.delete({
    where: { id },
  });
}
`;

  // Create actions directory if it doesn't exist
  const actionsDirPath = path.join(process.cwd(), "actions");
  if (!fs.existsSync(actionsDirPath)) {
    fs.mkdirSync(actionsDirPath);
    console.log(`Actions directory created at ${actionsDirPath}`);
  }

  // Write the action file content to the specified path
  fs.writeFileSync(actionFilePath, actionFileContent, { encoding: "utf-8" });
  console.log(`Action file created at ${actionFilePath}`);
}

// Function to create the prisma/schema.prisma file with default content
function createPrismaSchemaFile(prismaSchemaPath: string) {
  const defaultSchemaContent = `
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
  `;

  fs.writeFileSync(prismaSchemaPath, defaultSchemaContent, {
    encoding: "utf-8",
  });
  console.log(`Prisma schema file created at ${prismaSchemaPath}`);
}

// Main function to generate the model
export function generateModel(
  modelName: string,
  options: { action?: boolean }
) {
  // Ensure modelName starts with an uppercase letter
  const capitalizedModelName = upperFirst(camelCase(modelName));

  // Check if the prisma directory exists, create it if not
  const prismaDirPath = path.join(process.cwd(), "prisma");
  if (!fs.existsSync(prismaDirPath)) {
    fs.mkdirSync(prismaDirPath);
    console.log(`Prisma directory created at ${prismaDirPath}`);
  }

  // Define the Prisma schema file path
  const prismaSchemaPath = path.join(prismaDirPath, "schema.prisma");

  // Check if the schema.prisma file exists
  if (!fs.existsSync(prismaSchemaPath)) {
    // Create the schema.prisma file with default content if it doesn't exist
    createPrismaSchemaFile(prismaSchemaPath);
  }

  // Generate Prisma model file content
  const prismaModelContent = generatePrismaModelContent(capitalizedModelName);

  // Append the new model to the Prisma schema
  fs.appendFileSync(prismaSchemaPath, `\n${prismaModelContent}\n`, {
    encoding: "utf-8",
  });
  console.log(
    `Prisma model for ${capitalizedModelName} added to ${prismaSchemaPath}`
  );

  // Generate additional file in actions/ if -a flag is present
  if (options.action) {
    generateActionFile(capitalizedModelName);
  }
}
