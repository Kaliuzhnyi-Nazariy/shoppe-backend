// import { ensureExists, errorHandler } from "../../helpers";
import { IUser, UpdateUser } from "../../interfaces/user";
import { prisma } from "../../lib/prisma";
import service from "../../service/users";
import bcrypt from "bcryptjs";

jest.mock("../../lib/prisma.ts", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

// jest.mock("../../helpers", () => ({
//   errorHandler: jest.fn(),
//   getUserData: jest.fn(),
//   ensureExists: jest.fn(),
// }));

const user: IUser = {
  id: "user123",
  email: "test@mail.com",
  role: "customer",
  addresses: [],
  cart: [],
  displayName: "test_user",
  firstName: "test",
  lastName: "user",
  orders: [],
  password: "Passw0rd",
};

describe("service.getUser", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return a user", async () => {
    // const user: IUser = {
    //   id: "user123",
    //   email: "test@mail.com",
    //   role: "customer",
    //   addresses: [],
    //   cart: [],
    //   displayName: "test_user",
    //   firstName: "test",
    //   lastName: "user",
    //   orders: [],
    //   password: "Passw0rd",
    // };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);

    await service.getUser("user123");

    expect(prisma.user.findUnique).toHaveBeenCalled();
  });

  it("should return an error no user found", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.getUser("user213")).rejects.toThrow(
      "User is not found",
    );
  });
});

describe("service.updateUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const updBody = {
    firstName: "name",
    lastName: "lastttt",
    displayName: "1234",
    email: "test_email_unit@mail.com",
    password: "hashed_password",
  };

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

  it("should return new user", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");
    (prisma.user.update as jest.Mock).mockResolvedValue(newUser);

    const res = await service.updateUser({ ...updBody, id: "user123" });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "user123" },
    });
    expect(bcrypt.hash).toHaveBeenCalledWith(updBody.password, 10);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user123" },
      data: updBody,
    });

    expect(res).toEqual(newUser);
  });

  it("should return an error no user found", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      service.updateUser({ ...updBody, id: "user444" }),
    ).rejects.toThrow("User is not found");
  });
});

describe("service.deleteUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete user", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
    (prisma.user.delete as jest.Mock).mockResolvedValue(null);

    await service.deleteUser("user123");

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "user123" },
    });
    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { id: "user123" },
    });
  });

  it("should return an error as user is not found", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.deleteUser("user123")).rejects.toThrow(
      "User is not found",
    );

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "user123" },
    });
    expect(prisma.user.delete).not.toHaveBeenCalled();
  });
});
