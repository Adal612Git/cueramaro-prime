module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  transform: { "^.+\\.(t|j)s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }] },
  moduleFileExtensions: ["ts","js","json"],
};
