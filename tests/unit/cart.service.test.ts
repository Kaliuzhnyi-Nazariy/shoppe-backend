jest.mock("../../lib/prisma", () => ({
  // prisma: {
  //   cart: {
  //     findUnique: jest.fn(),
  //     create: jest.fn(),
  //     update: jest.fn(),
  //     delete: jest.fn(),
  //     upsert: jest.fn(),
  //   },
  //   cartItem: {
  //     findUnique: jest.fn(),
  //     create: jest.fn(),
  //     update: jest.fn(),
  //     delete: jest.fn(),
  //     upsert: jest.fn(),
  //     deleteMany: jest.fn(),
  //   },
  // },
  prisma: {
    cart: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    cartItem: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

const cartItem = {
  id: "f197cf33-f8c4-4d0d-98ed-ea8cdc89eefa",
  quantity: 4,
  userId: null,
  price: 750.99,
  product: {
    id: "ca5e424a-4836-47dc-99a0-44efa11f0702",
    createdAt: "2026-03-14T19:34:40.626Z",
    updatedAt: "2026-03-14T19:34:40.626Z",
    title: "Tablet",
    price: 750.99,
    description: "some description added",
    additionalInformation: "",
    amount: 150,
    photos: [],
    isArchived: false,
    rate: 0,
    reviewCount: 0,
  },
};

const cartResponse = {
  id: "cart123",
  items: [cartItem],
};

import { prisma } from "../../lib/prisma";
import { ensureExists } from "../../helpers";
import service from "../../service/cart";

jest.mock("../../helpers", () => {
  const actual = jest.requireActual("../../helpers");

  return {
    ...actual,
    ensureExists: jest.fn(),
  };
});

describe("service.getCart", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return cart", async () => {
    (prisma.cart.upsert as jest.Mock).mockResolvedValue(cartResponse);

    const result = await service.getCart("user123");

    expect(prisma.cart.upsert).toHaveBeenCalledWith({
      where: { userId: "user123" },
      update: {},
      create: { userId: "user123" },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                description: true,
                photos: true,
                rate: true,
                reviewCount: true,
                amount: true,
              },
            },
          },
          omit: { cartId: true, productId: true },
        },
      },
    });

    expect(result).toEqual(cartResponse);
  });
});

describe("service.addToCart", () => {
  beforeEach(() => jest.clearAllMocks());
  const product = {
    id: "prod-1",
    price: 100,
    amount: 150,
  };

  const cart = {
    id: "cart-1",
  };

  const cartItem = {
    id: "item-1",
    quantity: 4,
  };
  it("should add product to cart", async () => {
    (ensureExists as jest.Mock).mockResolvedValue(product);
    (prisma.cart.upsert as jest.Mock).mockResolvedValue(cart);
    (prisma.cartItem.upsert as jest.Mock).mockResolvedValue(cartItem);

    const result = await service.addToCart({
      userId: "user123",
      product: {
        cartId: "cart-1",
        productId: "prod-1",
        quantity: 4,
      },
    });

    expect(ensureExists).toHaveBeenCalled();

    expect(prisma.cart.upsert).toHaveBeenCalledWith({
      where: { userId: "user123" },
      update: {},
      create: { userId: "user123" },
    });

    expect(prisma.cartItem.upsert).toHaveBeenCalledWith({
      where: {
        cartId_productId: {
          cartId: "cart-1",
          productId: "prod-1",
        },
      },
      update: {
        quantity: { increment: 4 },
      },
      create: {
        cartId: "cart-1",
        productId: "prod-1",
        quantity: 4,
        price: 100,
        userId: "user123",
      },
    });

    expect(result).toEqual(cartItem);
  });

  it("should return an error as product is not found", async () => {
    (prisma.cart.upsert as jest.Mock).mockResolvedValue(cart);
    (ensureExists as jest.Mock).mockRejectedValue(
      new Error("Product is not found"),
    );

    await expect(
      service.addToCart({
        userId: "user123",
        product: {
          cartId: "cart-1",
          productId: "prod-1",
          quantity: 1,
        },
      }),
    ).rejects.toThrow("Product is not found");
  });

  it("should return an error as lower value of quantity", async () => {
    await expect(
      service.addToCart({
        userId: "user123",
        product: {
          cartId: "cart-1",
          productId: "prod-1",
          quantity: -1,
        },
      }),
    ).rejects.toThrow("Quantity must be greater than 0");

    expect(prisma.cart.upsert).not.toHaveBeenCalled();
  });

  it("should throw when quantity is 0", async () => {
    await expect(
      service.addToCart({
        userId: "user123",
        product: {
          cartId: "cart-1",
          productId: "prod-1",
          quantity: 0,
        },
      }),
    ).rejects.toThrow("Quantity must be greater than 0");

    expect(prisma.cart.upsert).not.toHaveBeenCalled();
  });

  it("should throw an error because total quantity is bigger product amount", async () => {
    (prisma.cart.upsert as jest.Mock).mockResolvedValue(cart);
    (ensureExists as jest.Mock).mockResolvedValue(product);

    await expect(
      service.addToCart({
        userId: "user123",
        product: {
          cartId: "cart-1",
          productId: "prod-1",
          quantity: 155555550,
        },
      }),
    ).rejects.toThrow("Not enough stock");

    expect(prisma.cart.upsert).toHaveBeenCalledWith({
      where: { userId: "user123" },
      update: {},
      create: { userId: "user123" },
    });

    expect(prisma.cartItem.upsert).not.toHaveBeenCalled();
  });
});

describe("service.removeFromCart", () => {
  beforeEach(() => jest.clearAllMocks());

  const cart = {
    id: "cart-1",
    items: [{ productId: "product-1", quantity: 5 }],
  };

  it("should successfully remove from cart 2 products, so 3 left", async () => {
    (ensureExists as jest.Mock)
      .mockResolvedValueOnce(cart)
      .mockResolvedValueOnce({
        productId: "product-1",
        quantity: 5,
      });

    (prisma.cartItem.update as jest.Mock).mockResolvedValue({
      productId: "product-1",
      quantity: 3,
    });

    const res = await service.removeFromCart({
      userId: "user123",
      quantity: 2,
      productId: "product-1",
    });

    expect(prisma.cartItem.delete).not.toHaveBeenCalled();
    expect(res).toEqual({ productId: "product-1", quantity: 3 });
  });

  it("should successfully delete product because delete quantity 5", async () => {
    (ensureExists as jest.Mock)
      .mockResolvedValueOnce(cart)
      .mockResolvedValueOnce({
        productId: "product-1",
        quantity: 5,
      });

    (prisma.cartItem.delete as jest.Mock).mockResolvedValue({
      productId: "product-1",
      quantity: 5,
    });

    const res = await service.removeFromCart({
      userId: "user123",
      quantity: 5,
      productId: "product-1",
    });

    expect(prisma.cartItem.update).not.toHaveBeenCalled();
    expect(res).toEqual({
      productId: "product-1",
      quantity: 5,
    });
  });

  it("should return an error as quantity more than user has in cart", async () => {
    (ensureExists as jest.Mock)
      .mockResolvedValueOnce(cart)
      .mockResolvedValueOnce({
        productId: "product-1",
        quantity: 5,
      });

    await expect(
      service.removeFromCart({
        userId: "user123",
        quantity: 8,
        productId: "product-1",
      }),
    ).rejects.toThrow("Quantity must be lower than you have in cart");

    expect(prisma.cartItem.delete).not.toHaveBeenCalled();
    expect(prisma.cartItem.update).not.toHaveBeenCalled();
  });

  it("should return an error as cart is not found", async () => {
    (ensureExists as jest.Mock).mockRejectedValue(
      new Error("Cart is not found"),
    );

    await expect(
      service.removeFromCart({
        userId: "user123",
        quantity: 2,
        productId: "product-1",
      }),
    ).rejects.toThrow("Cart is not found");

    expect(prisma.cartItem.delete).not.toHaveBeenCalled();
    expect(prisma.cartItem.update).not.toHaveBeenCalled();
  });

  it("should return an error as product is not found in cart", async () => {
    (ensureExists as jest.Mock)
      .mockResolvedValueOnce(cart)
      .mockRejectedValueOnce(new Error("Product is not found"));

    await expect(
      service.removeFromCart({
        userId: "user123",
        quantity: 2,
        productId: "product-1",
      }),
    ).rejects.toThrow("Product is not found");

    expect(prisma.cartItem.delete).not.toHaveBeenCalled();
    expect(prisma.cartItem.update).not.toHaveBeenCalled();
  });
});

describe("service.removeItemFromCart", () => {
  beforeEach(() => jest.clearAllMocks());
  const product = {
    id: "prod-1",
    price: 100,
    amount: 150,
  };

  const cart = {
    id: "cart-1",
  };

  const cartItem = {
    id: "item-1",
    quantity: 4,
  };

  it("should successfully delete item from cart", async () => {
    (ensureExists as jest.Mock)
      .mockResolvedValueOnce(cart)
      .mockResolvedValueOnce(cartItem);
    (prisma.cartItem.delete as jest.Mock).mockResolvedValue(cartItem);

    const res = await service.removeItemFromCart({
      userId: "user123",
      productId: "prod-1",
    });

    expect(prisma.cartItem.delete).toHaveBeenCalledWith({
      where: { id: "item-1" },
    });

    expect(res).toEqual(cartItem);
  });

  it("should return an error because cart item is not found", async () => {
    (ensureExists as jest.Mock)
      .mockResolvedValueOnce(cart)
      .mockRejectedValueOnce(new Error("Item is not found"));

    await expect(
      service.removeItemFromCart({
        userId: "user123",
        productId: "prod-1",
      }),
    ).rejects.toThrow("Item is not found");

    expect(prisma.cartItem.delete).not.toHaveBeenCalled();
  });

  it("should return an error because cart is not found", async () => {
    (ensureExists as jest.Mock).mockRejectedValue(
      new Error("Cart is not found"),
    );

    await expect(
      service.removeItemFromCart({
        userId: "user123",
        productId: "prod-1",
      }),
    ).rejects.toThrow("Cart is not found");

    expect(prisma.cartItem.delete).not.toHaveBeenCalled();
  });
});

describe("service.cleanCart", () => {
  beforeEach(() => jest.clearAllMocks());

  const cart = {
    id: "cart-1",
  };

  it("Should clean cart", async () => {
    (ensureExists as jest.Mock).mockResolvedValue(cart);
    (prisma.cartItem.deleteMany as jest.Mock).mockResolvedValue(null);
    (prisma.cart.findUnique as jest.Mock).mockResolvedValue({ items: [] });

    const res = await service.cleanCart("user123");

    expect(ensureExists).toHaveBeenCalledWith({
      model: prisma.cart,
      where: { userId: "user123" },
      entityName: "Cart",
    });
    expect(prisma.cartItem.deleteMany).toHaveBeenCalled();
    expect(prisma.cart.findUnique).toHaveBeenCalledWith({
      where: { userId: "user123" },
      include: {
        items: true,
      },
    });

    expect(res).toEqual({ items: [] });
  });

  it("Should return an error as no cart found", async () => {
    (ensureExists as jest.Mock).mockRejectedValue(
      new Error("Cart is not found"),
    );

    await expect(service.cleanCart("user123")).rejects.toThrow(
      "Cart is not found",
    );

    expect(ensureExists).toHaveBeenCalledWith({
      model: prisma.cart,
      where: { userId: "user123" },
      entityName: "Cart",
    });
    expect(prisma.cartItem.deleteMany).not.toHaveBeenCalled();
  });

  it("Should clean cart", async () => {
    (ensureExists as jest.Mock).mockResolvedValue(cart);
    (prisma.cartItem.deleteMany as jest.Mock).mockResolvedValue(null);
    (prisma.cart.findUnique as jest.Mock).mockRejectedValue(
      new Error("Cart is not found"),
    );

    await expect(service.cleanCart("user123")).rejects.toThrow(
      "Cart is not found",
    );

    expect(ensureExists).toHaveBeenCalledWith({
      model: prisma.cart,
      where: { userId: "user123" },
      entityName: "Cart",
    });
    expect(prisma.cartItem.deleteMany).toHaveBeenCalled();
    expect(prisma.cart.findUnique).toHaveBeenCalledWith({
      where: { userId: "user123" },
      include: {
        items: true,
      },
    });
  });
});

describe("service.deleteCart", () => {
  beforeEach(() => jest.clearAllMocks());

  const cart = {
    id: "cart-1",
  };

  it("should delete cart", async () => {
    (ensureExists as jest.Mock).mockResolvedValue(cart);
    (prisma.cart.delete as jest.Mock).mockResolvedValue(null);

    await service.deleteCart("user123");

    expect(ensureExists).toHaveBeenCalledWith({
      model: prisma.cart,
      where: { userId: "user123" },
      entityName: "Cart",
    });
    expect(prisma.cart.delete).toHaveBeenCalledWith({
      where: { id: "cart-1" },
    });
  });

  it("should return an error as cart is not found", async () => {
    (ensureExists as jest.Mock).mockRejectedValue(
      new Error("Cart is not found"),
    );

    await expect(service.deleteCart("user123")).rejects.toThrow(
      "Cart is not found",
    );

    expect(ensureExists).toHaveBeenCalledWith({
      model: prisma.cart,
      where: { userId: "user123" },
      entityName: "Cart",
    });
    expect(prisma.cart.delete).not.toHaveBeenCalled();
  });
});
