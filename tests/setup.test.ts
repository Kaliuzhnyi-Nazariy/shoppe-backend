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
  uploadImages: jest.fn(),
  deleteImage: jest.fn(),
}));
