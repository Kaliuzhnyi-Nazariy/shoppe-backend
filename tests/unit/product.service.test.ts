import { ensureProductExists } from "../../helpers";
import { IAddProduct, IProduct } from "../../interfaces/products";
import { prisma } from "../../lib/prisma";
import service from "../../service/products";

jest.mock("../../lib/prisma", () => ({
  prisma: {
    product: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock("../../helpers", () => ({
  ensureProductExists: jest.fn(),
}));

describe("productService.addProduct", () => {
  const productData: IAddProduct = {
    title: "Phone",
    amount: 10,
    price: 249.99,
    description: "some description added",
    photos: ["img1.jpg"],
  };

  const deployedProduct = {
    id: "product123",
    ...productData,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return new product", async () => {
    (prisma.product.create as jest.Mock).mockResolvedValue(deployedProduct);

    const result = await service.addProducts(productData);

    expect(prisma.product.create).toHaveBeenCalledWith({
      data: {
        ...productData,
        additionalInformation: "",
        isArchived: false,
      },
    });

    expect(result).toEqual(deployedProduct);
  });
});

describe("productService.updateProduct", () => {
  const productId = "product123";

  const data = {
    id: "product123",
    createdAt: "2026-03-10T07:47:17.283Z",
    updatedAt: "2026-03-10T08:02:07.702Z",
    title: "IPhone",
    price: 269.99,
    description: "some description added",
    additionalInformation: "",
    rate: 0,
    amount: 201,
    photos: [],
    isArchived: false,
  };

  const updateBody = {
    title: "IPhone 7",
    price: 169.99,
    description: "some description added",
    additionalInformation: "",
    photos: [],
  };

  const newData = {
    id: "product123",
    createdAt: "2026-03-10T07:47:17.283Z",
    updatedAt: "2026-03-10T08:02:07.702Z",
    title: "IPhone 7",
    price: 169.99,
    description: "some description added",
    additionalInformation: "",
    rate: 0,
    amount: 201,
    photos: [],
    isArchived: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update product", async () => {
    (ensureProductExists as jest.Mock).mockResolvedValue(data);
    (prisma.product.update as jest.Mock).mockResolvedValue(newData);

    const result = await service.updateProduct({
      productId,
      data: {
        ...updateBody,
        rate: 0,
        amount: 201,
        isArchived: false,
      },
    });

    expect(ensureProductExists).toHaveBeenCalledWith(productId);

    expect(prisma.product.update).toHaveBeenCalledWith({
      where: { id: productId },
      data: {
        ...updateBody,
        rate: 0,
        amount: 201,
        isArchived: false,
      },
    });

    expect(result).toEqual(newData);
  });

  it("should return an error because product not found", async () => {
    (ensureProductExists as jest.Mock).mockRejectedValue(
      new Error("Product is not found"),
    );

    await expect(service.updateProduct({ productId, data })).rejects.toThrow(
      "Product is not found",
    );

    expect(prisma.product.update).not.toHaveBeenCalled();
  });
});

describe("productService.updateProductAmount", () => {
  const productId = "product123";

  const data = {
    id: "product123",
    createdAt: "2026-03-10T07:47:17.283Z",
    updatedAt: "2026-03-10T08:02:07.702Z",
    title: "IPhone",
    price: 269.99,
    description: "some description added",
    additionalInformation: "",
    rate: 0,
    amount: 201,
    photos: [],
    isArchived: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update product amount", async () => {
    (ensureProductExists as jest.Mock).mockResolvedValue(data);
    (prisma.product.update as jest.Mock).mockResolvedValue(null);

    await service.updateProductAmount(productId, 155);

    expect(ensureProductExists).toHaveBeenCalledWith(productId);
    expect(prisma.product.update).toHaveBeenCalled();
  });

  it("should return error because product is not found", async () => {
    (ensureProductExists as jest.Mock).mockRejectedValue(
      new Error("Product is not found"),
    );

    await expect(service.updateProductAmount(productId, 5)).rejects.toThrow(
      "Product is not found",
    );
    expect(prisma.product.update).not.toHaveBeenCalled();
  });
});

describe("productService.archiveProduct", () => {
  const productId = "product123";

  const data = {
    id: "product123",
    createdAt: "2026-03-10T07:47:17.283Z",
    updatedAt: "2026-03-10T08:02:07.702Z",
    title: "IPhone",
    price: 269.99,
    description: "some description added",
    additionalInformation: "",
    rate: 0,
    amount: 201,
    photos: [],
    isArchived: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should archive product", async () => {
    (ensureProductExists as jest.Mock).mockResolvedValue(data);

    await service.archiveProduct(productId);
    expect(ensureProductExists).toHaveBeenCalledWith(productId);
    expect(prisma.product.update).toHaveBeenCalled();
  });

  it("should return an error as product is not found", async () => {
    (ensureProductExists as jest.Mock).mockRejectedValue(
      new Error("Product is not found"),
    );

    await expect(service.archiveProduct(productId)).rejects.toThrow(
      "Product is not found",
    );
    expect(prisma.product.update).not.toHaveBeenCalled();
  });
});
