import { IUser, SignIn, SignUp } from "../../interfaces/user";
import service from "../../service/auth";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

jest.mock("../../lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

jest.mock("jose", () => ({
  jwtVerify: jest.fn(),
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;

// sign up

describe("authService.signUp", () => {
  const signUpData: SignUp = {
    firstName: "Jhon",
    lastName: "Doe",
    displayName: "sth",
    email: "test@test.com",
    password: "password123",
    role: "customer",
  };

  const mockUser = {
    id: "123",
    role: "customer",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a user and return token", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");
    (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
    (jwt.sign as jest.Mock).mockReturnValue("mock_token");

    const result = await service.signUp(signUpData);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: signUpData.email },
    });

    expect(bcrypt.hash).toHaveBeenCalledWith(signUpData.password, 10);

    expect(prisma.user.create).toHaveBeenCalled();

    expect(jwt.sign).toHaveBeenCalled();

    expect(result).toEqual({ token: "mock_token" });
  });

  it("should throw error if email exists", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    await expect(service.signUp(signUpData)).rejects.toThrow();
    expect(prisma.user.create).not.toHaveBeenCalled();
  });
});

// sign in

describe("authService.signIn", () => {
  const userData = {
    firstName: "Jhon",
    lastName: "Doe",
    displayName: "sth",
    email: "test@test.com",
    password: "password123",
    role: "customer",
    id: "123",
  };

  const signInData: SignIn = {
    email: "test@mail.com",
    password: "password123",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return token if user exists and credentials are valid", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(userData);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mock_token");

    const result = await service.signIn(signInData);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: signInData.email },
    });

    expect(bcrypt.compare).toHaveBeenCalledWith(
      signInData.password,
      userData.password,
    );

    expect(jwt.sign).toHaveBeenCalled();

    expect(result).toEqual({ token: "mock_token" });
  });

  it("should throw error because user is not exist", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(service.signIn(signInData)).rejects.toThrow();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it("should throw error because user password is not match with comming one", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(userData);
    (bcrypt.compare as jest.Mock).mockReturnValue(false);

    await expect(service.signIn(signInData)).rejects.toThrow();
    expect(jwt.sign).not.toHaveBeenCalled();
  });
});

// reset password

describe("authService.resetPassword", () => {
  // const forgetPasswordValue = {
  //   token: "token",
  //   password: "password",
  //   confirmPassword: "password",
  // };

  const token = "token";
  const password = "password";
  const confirmPassword = "password";

  const tokenPayload = {
    payload: { id: "123", role: "customer" },
  };

  const userData = {
    firstName: "Jhon",
    lastName: "Doe",
    displayName: "sth",
    email: "test@test.com",
    password: "hashed_password",
    role: "customer",
    id: "123",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update user password", async () => {
    (jwtVerify as jest.Mock).mockResolvedValue(tokenPayload);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password2");
    (prisma.user.update as jest.Mock).mockResolvedValue(userData);

    await service.resetPassword(token, password, confirmPassword);

    expect(jwtVerify).toHaveBeenCalledWith(token, expect.any(Uint8Array));

    expect(bcrypt.hash).toHaveBeenCalledWith(confirmPassword, 10);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: tokenPayload.payload.id },
      data: { password: "hashed_password2" },
    });
  });

  it("should return an error because token is not valid", async () => {
    (jwtVerify as jest.Mock).mockRejectedValue(new Error("Token is not valid"));

    await expect(
      service.resetPassword(token, password, confirmPassword),
    ).rejects.toThrow("Token is not valid");

    expect(prisma.user.update).not.toHaveBeenCalled();
  });
});
