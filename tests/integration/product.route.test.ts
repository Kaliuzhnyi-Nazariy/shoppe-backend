import request from "supertest";
import app from "../../app";
import service from "../../service/products";

import errorHandler from "../../helpers/errorHandler";
import { IProduct } from "../../interfaces/products";
import { jwtVerify } from "jose";
import { error } from "node:console";

jest.mock("../../service/products");
jest.mock("jsonwebtoken");
jest.mock("jose", () => ({
  jwtVerify: jest.fn(),
}));

const product = {
  id: "product123",
  title: "product1",
  description: "some description added",
  additionalInformation: "",
  amount: 50,
  isArchived: false,
  photos: [],
  price: 115.0,
  rate: 0,
  reviews: [],
};

const token = "token_123";

const token_data = {
  id: "user123",
  role: "admin",
};

const token_data_with_another_role = {
  id: "uesr123",
  role: "customer",
};

const verifyToken = () =>
  (jwtVerify as jest.Mock).mockResolvedValue({
    payload: token_data,
  });

const verifyTokenForbidden = () =>
  (jwtVerify as jest.Mock).mockResolvedValue({
    payload: token_data_with_another_role,
  });

describe("GET /products", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an array of products", async () => {
    // const product = {
    //   title: "product1",
    //   description: "some description added",
    //   additionalInformation: "",
    //   amount: 50,
    //   isArchived: false,
    //   photos: [],
    //   price: 115.0,
    //   rate: 0,
    //   reviews: [],
    // };

    (service.getProducts as jest.Mock).mockResolvedValue([{ product }]);

    const res = await request(app).get("/api/products");

    expect(service.getProducts).toHaveBeenCalled();

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ product }]);
  });
});

describe("GET /products/:productId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get product by id", async () => {
    (service.getProductById as jest.Mock).mockResolvedValue(product);

    const res = await request(app).get("/api/products/product123");

    expect(service.getProductById).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual(product);
  });

  it("should return an error as product is not found", async () => {
    (service.getProductById as jest.Mock).mockRejectedValue(
      errorHandler(404, "Product is not found"),
    );

    const res = await request(app).get("/api/products/123213");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: "Product is not found",
    });
  });
});

describe("POST /products", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const postProduct = {
    title: "product1",
    description: "some description added",
    additionalInformation: "",
    amount: 50,
    photos: [],
    price: 115.0,
  };

  const token = "token_123";

  const token_data = {
    id: "user123",
    role: "admin",
  };

  it("should add product", async () => {
    (jwtVerify as jest.Mock).mockResolvedValue({ payload: token_data });

    (service.addProducts as jest.Mock).mockResolvedValue(product);

    const res = await request(app)
      .post("/api/products")
      .send(postProduct)
      .set("authorization", `Bearer ${token}`);

    expect(service.addProducts).toHaveBeenCalledWith(postProduct);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(product);
  });

  it("should return 401 error as no token sent", async () => {
    const res = await request(app).post("/api/products").send(postProduct);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Unauthorized" });

    expect(service.addProducts).not.toHaveBeenCalled();
  });

  it("should return an error as price field not sent", async () => {
    (jwtVerify as jest.Mock).mockResolvedValue({ payload: token_data });

    const wrongPostBody = {
      title: "product1",
      description: "some description added",
      photos: [],
    };

    const res = await request(app)
      .post("/api/products")
      .send(wrongPostBody)
      .set("authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "price" })]),
    ),
      expect(service.addProducts).not.toHaveBeenCalled();
  });

  it("should return forbidden error", async () => {
    const token_data_with_another_role = {
      id: "uesr123",
      role: "customer",
    };

    (jwtVerify as jest.Mock).mockResolvedValue({
      payload: token_data_with_another_role,
    });

    const res = await request(app)
      .post("/api/products")
      .send(postProduct)
      .set("authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body).toEqual({ message: "Forbidden" });

    expect(service.addProducts).not.toHaveBeenCalled();
  });
});

describe("PUT /products/:productId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const updProduct = {
    title: "product_2",
    description: "some description added",
    additionalInformation: "",
    photos: [],
    price: 789.99,
  };

  const newProduct = {
    title: "product_2",
    description: "some description added",
    additionalInformation: "",
    amount: 0,
    isArchived: false,
    photos: [],
    price: 789.99,
    rate: 0,
    reviews: [],
  };

  const token = "token_123";

  const token_data = {
    id: "user123",
    role: "admin",
  };

  it("should update product", async () => {
    (jwtVerify as jest.Mock).mockResolvedValue({ payload: token_data });

    (service.updateProduct as jest.Mock).mockResolvedValue(newProduct);

    const res = await request(app)
      .put("/api/products/123")
      .send(updProduct)
      .set("authorization", `Bearer ${token}`);

    expect(service.updateProduct).toHaveBeenCalledWith({
      productId: "123",
      data: updProduct,
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(newProduct);
  });

  it("should return 401 error as no token sent", async () => {
    const res = await request(app).put("/api/products/123").send(updProduct);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Unauthorized" });

    expect(service.updateProduct).not.toHaveBeenCalled();
  });

  it("should return an error as title field not sent", async () => {
    (jwtVerify as jest.Mock).mockResolvedValue({ payload: token_data });

    const wrongPostBody = {
      price: 15.0,
      description: "some description added",
      photos: [],
    };

    const res = await request(app)
      .put("/api/products/123")
      .send(wrongPostBody)
      .set("authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "title" })]),
    );

    expect(service.updateProduct).not.toHaveBeenCalled();
  });

  it("should return forbidden error", async () => {
    (jwtVerify as jest.Mock).mockResolvedValue({
      payload: token_data_with_another_role,
    });

    const res = await request(app)
      .put("/api/products/123")
      .send(updProduct)
      .set("authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body).toEqual({ message: "Forbidden" });

    expect(service.updateProduct).not.toHaveBeenCalled();
  });

  it("should return not found error", async () => {
    (jwtVerify as jest.Mock).mockResolvedValue({ payload: token_data });
    (service.updateProduct as jest.Mock).mockRejectedValue(
      errorHandler(404, "Product is not found"),
    );

    const res = await request(app)
      .put("/api/products/13")
      .set("authorization", `Bearer ${token}`)
      .send(product);

    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({ message: "Product is not found" }),
    );
  });
});

describe("PATCH /products/archive/:productId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return status 204", async () => {
    (jwtVerify as jest.Mock).mockResolvedValue({ payload: token_data });
    (service.archiveProduct as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .patch("/api/products/archive/132")
      .set("authorization", `Bearer ${token}`);

    expect(service.archiveProduct).toHaveBeenCalledWith("132");
    expect(res.status).toBe(204);
  });

  it("should return an error as no token", async () => {
    (jwtVerify as jest.Mock).mockRejectedValue(errorHandler(401));

    const res = await request(app)
      .patch("/api/products/archive/123")
      .set("authorization", `Bearer ${token}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual(
      expect.objectContaining({ message: "Unauthorized" }),
    );
    expect(service.archiveProduct).not.toHaveBeenCalled();
  });

  it("should return an error as product not found", async () => {
    (jwtVerify as jest.Mock).mockResolvedValue({ payload: token_data });
    (service.archiveProduct as jest.Mock).mockRejectedValue(
      errorHandler(404, "Product is not found"),
    );

    const res = await request(app)
      .patch("/api/products/archive/123")
      .set("authorization", `Bearer ${token}`);

    expect(service.archiveProduct).toHaveBeenCalledWith("123");

    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({ message: "Product is not found" }),
    );
  });

  it("should return a forbidden error", async () => {
    (jwtVerify as jest.Mock).mockResolvedValue({
      payload: token_data_with_another_role,
    });

    const res = await request(app)
      .patch("/api/products/archive/123")
      .set("authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body).toEqual(expect.objectContaining({ message: "Forbidden" }));

    expect(service.archiveProduct).not.toHaveBeenCalled();
  });
});

describe("PATCH /products/amount/:productId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should return status 204", async () => {
    verifyToken();
    (service.updateProductAmount as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .patch("/api/products/amount/123")
      .send({ amount: 5 })
      .set("authorization", `Bearer ${token}`);

    expect(service.updateProductAmount).toHaveBeenCalledWith("123", 5);
    expect(res.status).toBe(204);
  });

  it("should return an error because value is not sent", async () => {
    verifyToken();

    const res = await request(app)
      .patch("/api/products/amount/123")
      .send({})
      .set("authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "amount",
        }),
      ]),
    );
    expect(service.updateProductAmount).not.toHaveBeenCalled();
  });

  it("should return an error because sent an invalid data", async () => {
    verifyToken();

    const res = await request(app)
      .patch("/api/products/amount/123")
      .send({ amount: -1 })
      .set("authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "amount",
          message: "Products amount cannot be less then 0",
        }),
      ]),
    );
    expect(service.updateProductAmount).not.toHaveBeenCalled();
  });

  it("should return an error no token sent", async () => {
    (jwtVerify as jest.Mock).mockRejectedValue(errorHandler(401));
    const res = await request(app)
      .patch("/api/products/amount/123")
      .send({ amount: 0 });

    expect(res.status).toBe(401);
    expect(res.body).toEqual(
      expect.objectContaining({ message: "Unauthorized" }),
    );
    expect(service.updateProductAmount).not.toHaveBeenCalled();
  });

  it("should return an error as product not found", async () => {
    verifyToken();
    (service.updateProductAmount as jest.Mock).mockRejectedValue(
      errorHandler(404, "Product is not found"),
    );

    const res = await request(app)
      .patch("/api/products/amount/123")
      .send({ amount: 4 })
      .set("authorization", `Bearer ${token}`);

    expect(service.updateProductAmount).toHaveBeenCalled();

    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({ message: "Product is not found" }),
    );
  });

  it("should return a forbidden error", async () => {
    verifyTokenForbidden();

    const res = await request(app)
      .patch("/api/products/amount/123")
      .send({ amount: 4 })
      .set("authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body).toEqual(expect.objectContaining({ message: "Forbidden" }));

    expect(service.updateProductAmount).not.toHaveBeenCalled();
  });
});

describe("DELETE /products/:productId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 204 status", async () => {
    verifyToken();
    (service.deleteProduct as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .delete("/api/products/123")
      .set("authorization", `Bearer ${token}`);

    expect(service.deleteProduct).toHaveBeenCalledWith("123");
    expect(res.status).toBe(204);
  });

  it("should return 404 error as product not found", async () => {
    verifyToken();
    (service.deleteProduct as jest.Mock).mockRejectedValue(
      errorHandler(404, "Product is not found"),
    );

    const res = await request(app)
      .delete("/api/products/123")
      .set("authorization", `Bearer ${token}`);

    expect(service.deleteProduct).toHaveBeenCalledWith("123");
    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Product is not found",
      }),
    );
  });

  it("should return 403 error as role is not admin", async () => {
    verifyTokenForbidden();

    const res = await request(app)
      .delete("/api/products/123")
      .set("authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body).toEqual(expect.objectContaining({ message: "Forbidden" }));
    expect(service.deleteProduct).not.toHaveBeenCalled();
  });

  it("should return 401 error as token is not sent", async () => {
    const res = await request(app).delete("/api/products/123");

    expect(res.status).toBe(401);
    expect(res.body).toEqual(
      expect.objectContaining({ message: "Unauthorized" }),
    );
    expect(service.deleteProduct).not.toHaveBeenCalled();
  });
});
