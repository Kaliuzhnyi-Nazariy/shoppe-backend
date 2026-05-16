jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

jest.mock("jose", () => ({
  jwtVerify: jest.fn(),
}));

jest.mock("node-mailjet", () => ({
  apiConnect: jest.fn(),
}));

jest.mock("../utils/sendEmail.ts", () => ({
  sendEmail: jest.fn(),
}));

jest.mock("../helpers/cloudinary", () => ({
  cloudinaryUpload: jest.fn(),
  cloudinaryDelete: jest.fn(),
}));

jest.mock("../helpers/ensureExists.ts", () => ({
  ensureExists: jest.fn(),
}));

jest.mock("../helpers/ensureProductExists.ts", () => ({
  ensureProductExists: jest.fn(),
  getProductWithPhotos: jest.fn(),
}));
