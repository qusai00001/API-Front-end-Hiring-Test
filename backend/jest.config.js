module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.js", "!src/**/openapi.*"],
  coverageReporters: ["text", "lcov", "html"]
};