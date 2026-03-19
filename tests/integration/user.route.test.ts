import { jwtVerify } from "jose";
import service from "../../service/users";
import { IUser } from "../../interfaces/user";
import request from "supertest";
import app from "../../app";
import { errorHandler } from "../../helpers";

jest.mock("../../service/users.ts");
jest.mock("jose", () => ({
  jwtVerify: jest.fn(),
}));

const token = "user_token";
const token_data = {
  id: "user123",
  role: "customer",
};

const verifyToken = () => {
  (jwtVerify as jest.Mock).mockResolvedValue({ payload: token_data });
};

const user: IUser = {
  addresses: [],
  cart: [],
  displayName: "user_display_name",
  email: "testing@mail.com",
  firstName: "user_first_name",
  id: "user123",
  lastName: "user_last_name",
  orders: [],
  password: "passw0rd",
  role: "customer",
};

describe("GET /user/me", () => {
  beforeEach(() => jest.clearAllMocks());

  const token = "user_token";
  const token_data = {
    id: "user123",
    role: "customer",
  };

  const verifyToken = () => {
    (jwtVerify as jest.Mock).mockResolvedValue({ payload: token_data });
  };

  const user: IUser = {
    addresses: [],
    cart: [],
    displayName: "user_display_name",
    email: "testing@mail.com",
    firstName: "user_first_name",
    id: "user123",
    lastName: "user_last_name",
    orders: [],
    password: "passw0rd",
    role: "customer",
  };

  it("should return a user", async () => {
    verifyToken();
    (service.getUser as jest.Mock).mockResolvedValue(user);

    const res = await request(app)
      .get("/api/users/me")
      .set("Cookie", `token=${token}`);

    expect(service.getUser).toHaveBeenCalledWith("user123");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(user);
  });

  it("should return an error because token is not sent", async () => {
    const res = await request(app).get("/api/users/me");

    expect(res.status).toBe(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      }),
    );
    expect(service.getUser).not.toHaveBeenCalled();
  });

  it("should return an error as user is not found", async () => {
    verifyToken();
    (service.getUser as jest.Mock).mockRejectedValue(
      errorHandler(404, "User is not found"),
    );

    const res = await request(app)
      .get("/api/users/me")
      .set("Cookie", `token=${token}`);

    expect(service.getUser).toHaveBeenCalledWith("user123");

    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "User is not found",
      }),
    );
  });
});

describe("PUT /api/users/update", () => {
  beforeEach(() => jest.clearAllMocks());

  const newUser: IUser = {
    id: "user123",
    email: "testt_updatemail.com",
    role: "customer",
    addresses: [],
    cart: [],
    displayName: "test_updated_user",
    firstName: "test",
    lastName: "user",
    orders: [],
    password: "hashed_password",
  };

  const updBody = {
    firstName: "name",
    lastName: "lastttt",
    displayName: "1234",
    email: "test_email_unit@mail.com",
    password: "Passw0rd",
    confirmPassword: "Passw0rd",
  };

  it("should return a new updated user", async () => {
    verifyToken();
    (service.updateUser as jest.Mock).mockResolvedValue(newUser);

    const res = await request(app)
      .put("/api/users/update")
      .send(updBody)
      .set("Cookie", `token=${token}`);

    expect(service.updateUser).toHaveBeenCalledWith({
      ...updBody,
      id: "user123",
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual(newUser);
  });

  it("should return an error because token is not sent", async () => {
    (jwtVerify as jest.Mock).mockRejectedValue(errorHandler(401));

    const res = await request(app).put("/api/users/update").send(updBody);

    expect(res.status).toBe(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      }),
    );
    expect(service.updateUser).not.toHaveBeenCalled();
  });

  it("should return an error because password is not sent", async () => {
    const wrongUpdBody = {
      firstName: "name",
      lastName: "lastttt",
      displayName: "1234",
      email: "test_email_unit@mail.com",
    };

    verifyToken();

    const res = await request(app)
      .put("/api/users/update")
      .send(wrongUpdBody)
      .set("Cookie", `token=${token}`);

    expect(res.status).toBe(400);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "password",
        }),
      ]),
    );
  });

  it("should return an error as user is not found", async () => {
    verifyToken();
    (service.updateUser as jest.Mock).mockRejectedValue(
      errorHandler(404, "User is not found"),
    );

    const res = await request(app)
      .put("/api/users/update")
      .set("Cookie", `token=${token}`)
      .send(updBody);

    expect(service.updateUser).toHaveBeenCalledWith({
      ...updBody,
      id: "user123",
    });
    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "User is not found",
      }),
    );
  });

  it("should return a conflict error as that email is already in use", async () => {
    verifyToken();
    (service.updateUser as jest.Mock).mockRejectedValue(
      errorHandler(409, "Email already in use"),
    );

    const res = await request(app)
      .put("/api/users/update")
      .send(updBody)
      .set("Cookie", `token=${token}`);

    expect(service.updateUser).toHaveBeenCalledWith({
      ...updBody,
      id: "user123",
    });
    expect(res.status).toBe(409);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Email already in use",
      }),
    );
  });
});

describe("DELETE /users/delete", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should delete user", async () => {
    verifyToken();
    (service.deleteUser as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .delete("/api/users/delete")
      .set("Cookie", `token=${token}`);

    expect(service.deleteUser).toHaveBeenCalledWith("user123");
    expect(res.status).toBe(204);
  });

  it("should return an error as user is not found", async () => {
    verifyToken();
    (service.deleteUser as jest.Mock).mockRejectedValue(
      errorHandler(404, "User is not found"),
    );

    const res = await request(app)
      .delete("/api/users/delete")
      .set("Cookie", `token=${token}`);

    expect(service.deleteUser).toHaveBeenCalledWith("user123");
    expect(res.status).toBe(404);
    expect(
      expect.objectContaining({
        message: "User is not found",
      }),
    );
  });

  it("should return an error as token is not sent", async () => {
    const res = await request(app).delete("/api/users/delete");

    expect(res.status).toBe(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      }),
    );
    expect(service.deleteUser).not.toHaveBeenCalled();
  });
});
