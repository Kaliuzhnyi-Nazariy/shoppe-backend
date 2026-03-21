import { jwtVerify } from "jose";
import service from "../../service/cart";
import { errorHandler } from "../../helpers";
import request from "supertest";
import app from "../../app";

jest.mock("../../service/cart");
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

const verifyTokenError = () => {
  (jwtVerify as jest.Mock).mockRejectedValue(errorHandler(401));
};

const cartNotFound = (fn: jest.Mock) => {
  fn.mockRejectedValue(errorHandler(404, "Cart is not found"));
};

const itemNotFound = (fn: jest.Mock) => {
  fn.mockRejectedValue(errorHandler(404, "Item is not found"));
};

const emptyCartResponse = {
  id: "user123",
  items: [],
};

const addingResponse = {
  id: "cart-item-1",
  cartId: "cart-1",
  productId: "prod-1",
  quantity: 1,
  userId: "user123",
  price: 269.99,
};

const addBody = {
  productId: "prod-1",
  quantity: 1,
};

const itemProduct = {
  id: "cart-item-prod-1",
  quantity: 1,
  userId: "user123",
  price: 269.99,
  product: {
    id: "prod-1",
    title: "jewellry",
    description: "some description added",
    photos: [],
    rate: 0,
    reviewCount: 0,
  },
};

const cartResponse = {
  id: "user123",
  items: [itemProduct],
};

describe("GET /cart/", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return cart", async () => {
    verifyToken();
    (service.getCart as jest.Mock).mockResolvedValue(cartResponse);

    const res = await request(app)
      .get("/api/cart")
      .set("Cookie", `token=${token}`);

    expect(service.getCart).toHaveBeenCalledWith("user123");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(cartResponse);
  });

  it("should return an error as cart is not found", async () => {
    verifyToken();
    cartNotFound(service.getCart as jest.Mock);

    const res = await request(app)
      .get("/api/cart")
      .set("Cookie", `token=${token}`);

    expect(service.getCart).toHaveBeenCalledWith("user123");
    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Cart is not found",
      }),
    );
  });

  it("should return an error as user is unauthorized", async () => {
    verifyTokenError();

    const res = await request(app).get("/api/cart");

    expect(res.status).toBe(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      }),
    );

    expect(service.getCart).not.toHaveBeenCalled();
  });
});

describe("POST /cart/add", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should add product to cart", async () => {
    verifyToken();
    (service.addToCart as jest.Mock).mockResolvedValue(addingResponse);

    const res = await request(app)
      .post("/api/cart/add")
      .set("Cookie", `token=${token}`)
      .send(addBody);

    expect(service.addToCart).toHaveBeenCalledWith({
      userId: "user123",
      product: addBody,
    });
    expect(res.status).toBe(201);
    expect(res.body).toEqual(addingResponse);
  });

  it("should return an error as user is unauthorized", async () => {
    verifyTokenError();

    const res = await request(app)
      .post("/api/cart/add")
      .set("Cookie", `token=${token}`)
      .send(addBody);

    expect(res.status).toBe(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      }),
    );
    expect(service.addToCart).not.toHaveBeenCalled();
  });

  it("should return an error as amount is not sent", async () => {
    verifyToken();

    const res = await request(app)
      .post("/api/cart/add")
      .set("Cookie", `token=${token}`)
      .send({
        productId: "prod-2",
      });

    expect(res.status).toBe(400);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "quantity",
        }),
      ]),
    );
    expect(service.addToCart).not.toHaveBeenCalled();
  });
});

describe("POST /cart/remove/:itemId", () => {
  beforeEach(() => jest.clearAllMocks());

  const req = async () => {
    return await request(app)
      .post("/api/cart/remove/prod-1")
      .set("Cookie", `token=${token}`)
      .send({ quantity: 1 });
  };

  it("should remove item from cart", async () => {
    verifyToken();
    (service.removeFromCart as jest.Mock).mockResolvedValue(addingResponse);

    const res = await request(app)
      .post("/api/cart/remove/prod-1")
      .set("Cookie", `token=${token}`)
      .send({ quantity: 1 });

    expect(service.removeFromCart).toHaveBeenCalledWith({
      userId: "user123",
      productId: "prod-1",
      quantity: 1,
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(addingResponse);
  });

  it("should return an error as user is unauthorized", async () => {
    verifyTokenError();

    const res = await req();

    expect(res.status).toBe(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      }),
    );
    expect(service.removeFromCart).not.toHaveBeenCalled();
  });

  it("should return an error as cart is not found", async () => {
    verifyToken();
    cartNotFound(service.removeFromCart as jest.Mock);

    const res = await req();

    expect(service.removeFromCart).toHaveBeenCalledWith({
      userId: "user123",
      productId: "prod-1",
      quantity: 1,
    });
    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Cart is not found",
      }),
    );
  });

  it("should return an error as item in cart is not found", async () => {
    verifyToken();
    itemNotFound(service.removeFromCart as jest.Mock);

    const res = await req();

    expect(service.removeFromCart).toHaveBeenCalledWith({
      userId: "user123",
      productId: "prod-1",
      quantity: 1,
    });
    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Item is not found",
      }),
    );
  });
});

describe("DELETE /cart/item/:itemId", () => {
  beforeEach(() => jest.clearAllMocks());

  const req = async () => {
    return await request(app)
      .delete("/api/cart/item/prod-1")
      .set("Cookie", `token=${token}`);
  };

  it("should delete item from cart", async () => {
    verifyToken();
    (service.removeItemFromCart as jest.Mock).mockResolvedValue(addingResponse);

    const res = await req();

    expect(service.removeItemFromCart).toHaveBeenCalledWith({
      userId: "user123",
      productId: "prod-1",
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual(addingResponse);
  });

  it("should return an error as user is unauthorized", async () => {
    verifyTokenError();

    const res = await req();

    expect(res.status).toBe(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      }),
    );
    expect(service.removeItemFromCart).not.toHaveBeenCalled();
  });

  it("should return an error as cart is not found", async () => {
    verifyToken();
    cartNotFound(service.removeItemFromCart as jest.Mock);

    const res = await req();

    expect(service.removeItemFromCart).toHaveBeenCalledWith({
      userId: "user123",
      productId: "prod-1",
    });
    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Cart is not found",
      }),
    );
  });

  it("should return an error as item is not found in cart ", async () => {
    verifyToken();
    itemNotFound(service.removeItemFromCart as jest.Mock);

    const res = await req();

    expect(service.removeItemFromCart).toHaveBeenCalledWith({
      userId: "user123",
      productId: "prod-1",
    });
    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Item is not found",
      }),
    );
  });
});

describe("DELETE /cart/clear", () => {
  beforeEach(() => jest.clearAllMocks());

  const req = async () => {
    return await request(app)
      .delete("/api/cart/clear")
      .set("Cookie", `token=${token}`);
  };

  it("should return an empty cart items", async () => {
    verifyToken();
    (service.cleanCart as jest.Mock).mockResolvedValue({ items: [] });

    const res = await req();

    expect(service.cleanCart).toHaveBeenCalledWith("user123");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ items: [] });
  });

  it("should return an error as user is unauthorized", async () => {
    verifyTokenError();

    const res = await req();

    expect(res.status).toBe(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      }),
    );
    expect(service.cleanCart).not.toHaveBeenCalled();
  });

  it("should return an error as cart is not found", async () => {
    verifyToken();
    cartNotFound(service.cleanCart as jest.Mock);

    const res = await req();

    expect(service.cleanCart).toHaveBeenCalledWith("user123");
    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Cart is not found",
      }),
    );
  });
});

describe("DELETE /cart", () => {
  beforeEach(() => jest.clearAllMocks());

  const req = async () => {
    return await request(app)
      .delete("/api/cart")
      .set("Cookie", `token=${token}`);
  };

  it("should delete cart", async () => {
    verifyToken();
    (service.deleteCart as jest.Mock).mockResolvedValue(null);

    const res = await req();

    expect(service.deleteCart).toHaveBeenCalledWith("user123");
    expect(res.status).toBe(204);
  });

  it("should return an error as user is not found", async () => {
    verifyTokenError();

    const res = await req();

    expect(res.status).toBe(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      }),
    );
    expect(service.deleteCart).not.toHaveBeenCalled();
  });

  it("should return an error as cart is not found", async () => {
    verifyToken();
    cartNotFound(service.deleteCart as jest.Mock);

    const res = await req();

    expect(service.deleteCart).toHaveBeenCalledWith("user123");
    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Cart is not found",
      }),
    );
  });
});
