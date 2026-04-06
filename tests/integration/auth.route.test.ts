import request from "supertest";
import app from "../../app";
import authService from "../../service/auth";

import errorHandler from "../../helpers/errorHandler";
import { jwtVerify } from "jose";

jest.mock("../../service/auth");
jest.mock("jsonwebtoken");
jest.mock("jose", () => ({
  jwtVerify: jest.fn(),
}));

describe("POST /auth/signup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockedResolvedValueForAuth = {
    token: "mocked_token",
  };

  it("should create user", async () => {
    const signUpData = {
      firstName: "Jhon",
      lastName: "Doe",
      displayName: "sth",
      email: "test@test.com",
      password: "password123",
      confirmPassword: "password123",
      role: "customer",
    };

    (authService.signUp as jest.Mock).mockResolvedValue(
      mockedResolvedValueForAuth,
    );

    const res = await request(app).post("/api/auth/signup").send(signUpData);

    expect(authService.signUp).toHaveBeenCalledWith(signUpData);

    expect(res.body).toEqual(mockedResolvedValueForAuth);
    expect(res.status).toBe(201);
    // expect(res.headers["set-cookie"][0]).toContain("token=");
  });

  it("should return an error as no password", async () => {
    const signUpDataNoConfirmationPassword = {
      firstName: "Jhon",
      lastName: "Doe",
      displayName: "sth",
      email: "test@test.com",
      password: "password123",
    };

    const res = await request(app)
      .post("/api/auth/signup")
      .send(signUpDataNoConfirmationPassword);

    expect(res.status).toBe(400);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "confirmPassword" }),
      ]),
    );
  });

  it("should return an error as user already exists", async () => {
    const data = {
      firstName: "Jhon",
      lastName: "Doe",
      displayName: "sth",
      email: "test@test.com",
      password: "password123",
      confirmPassword: "password123",
    };

    (authService.signUp as jest.Mock).mockRejectedValue(
      errorHandler(409, "User already exists"),
    );

    const res = await request(app).post("/api/auth/signup").send(data);

    expect(res.status).toBe(409);
  });
});

describe("POST /auth/signin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const data = {
    email: "test@test.com",
    password: "password123",
  };

  // const mockData = {
  //   id: "user123",
  //   role: "customer",
  // };
  const mockedResolvedValueForAuth = {
    token: "mocked_token",
  };

  it("should set token", async () => {
    (authService.signIn as jest.Mock).mockResolvedValue(
      mockedResolvedValueForAuth,
    );

    const res = await request(app).post("/api/auth/signin").send(data);

    expect(authService.signIn).toHaveBeenCalledWith(data);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockedResolvedValueForAuth);
    // expect(res.headers["set-cookie"][0]).toContain("token=");
  });

  it("should return an error as no user", async () => {
    (authService.signIn as jest.Mock).mockRejectedValue(
      errorHandler(401, "User not found"),
    );

    const res = await request(app).post("/api/auth/signin").send(data);

    expect(authService.signIn).toHaveBeenCalledWith(data);
    expect(res.status).toBe(401);
    expect(res.headers["set-cookie"]).not.toBeDefined();
  });

  it("should return an error as no email field", async () => {
    const res = await request(app)
      .post("/api/auth/signin")
      .send({ email: "", password: data.password });

    expect(res.status).toBe(400);
    expect(res.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "email" })]),
    );
  });
});

// describe("POST /auth/signout", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   const token = "token_123";
//   const token_data = {
//     id: "user123",
//     role: "customer",
//   };

//   it("should remove token", async () => {
//     (jwtVerify as jest.Mock).mockResolvedValue({ payload: token_data });

//     const res = await request(app)
//       .post("/api/auth/signout")
//       .set("Cookie", [`token=${token}`]);

//     expect(res.status).toBe(204);
//     expect(res.headers["set-cookie"]).toBeDefined();
//     expect(res.headers["set-cookie"][0]).toContain("token=");
//   });

//   it("should return an error as no token", async () => {
//     (jwtVerify as jest.Mock).mockRejectedValue(errorHandler(401));

//     const res = await request(app)
//       .post("/api/auth/signout")
//       .set("Cookie", [`token = ${token}`]);

//     expect(res.status).toBe(401);
//   });

//   it("should return an error as token invalid", async () => {
//     (jwtVerify as jest.Mock).mockRejectedValue(errorHandler(401));

//     const res = await request(app)
//       .post("/api/auth/signout")
//       .set("Cookie", [`token=${token}`]);

//     expect(res.status).toBe(401);
//     expect(res.headers["set-cookie"]).toBeUndefined();
//   });
// });

describe("POST /auth/password/forget", () => {
  it("should send token", async () => {
    (authService.forgetPassword as jest.Mock).mockResolvedValue({
      token: "token",
    });

    const res = await request(app)
      .post("/api/auth/password/forget")
      .send({ email: "test@mail.com" });

    expect(authService.forgetPassword).toHaveBeenCalledWith("test@mail.com");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ token: "token" });
  });

  it("should return an error as no email found", async () => {
    (authService.forgetPassword as jest.Mock).mockRejectedValue(
      errorHandler(404, "If the email exists, we sent a reset link."),
    );

    const res = await request(app)
      .post("/api/auth/password/forget")
      .send({ email: "esrse@mail.com" });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: "If the email exists, we sent a reset link.",
    });
  });

  it("should return an error as no email sent", async () => {
    const res = await request(app)
      .post("/api/auth/password/forget")
      .send({ email: "" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "email" })]),
    );

    expect(authService.forgetPassword).not.toHaveBeenCalled();
  });
});

describe("PATCH /api/auth/password/reset/:tokenId", () => {
  const tokenId = "user_change_token";
  const reqBody = {
    password: "password132",
    confirmPassword: "password132",
  };

  it("should update password and return status 204", async () => {
    (authService.resetPassword as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .patch("/api/auth/password/reset/" + tokenId)
      .send(reqBody);

    expect(authService.resetPassword).toHaveBeenCalledWith(
      tokenId,
      reqBody.password,
      reqBody.confirmPassword,
    );

    expect(res.status).toBe(204);
  });

  it("should return error as confirmPassword is not match password", async () => {
    const res = await request(app)
      .patch("/api/auth/password/reset/" + tokenId)
      .send({ password: reqBody.password, confirmPassword: "password" });

    expect(res.status).toBe(400);
  });

  it("should return error when token invalid", async () => {
    (authService.resetPassword as jest.Mock).mockRejectedValue(
      errorHandler(400, "Token is not valid"),
    );

    const res = await request(app)
      .patch(`/api/auth/password/reset/${tokenId}`)
      .send(reqBody);

    expect(res.status).toBe(400);
  });
});
