const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  setupFilesAfterEnv: ["<rootDir>/tests/setup.test.ts"],

  roots: ["<rootDir>/tests"],

  moduleFileExtensions: ["ts", "js"],

  testMatch: ["**/*.test.ts"],

  clearMocks: true,
};
