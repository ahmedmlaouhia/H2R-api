/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"], // Look for test files
  moduleFileExtensions: ["ts", "js"],
  roots: ["<rootDir>/src"], // Point Jest to the `src` folder
}
