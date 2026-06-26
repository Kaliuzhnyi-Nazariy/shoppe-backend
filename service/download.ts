import { prisma } from "../lib/prisma";

const getDownloads = async ({
  id,
  role,
}: {
  id: string;
  role: "admin" | "customer";
}) => {
  return await prisma.downloads.findMany({
    where: {
      ...(role === "customer" ? { userId: id } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const postDownload = async (
  userId: string,
  orderId: string,
  totalPrice: string,
) => {
  await prisma.downloads.create({
    data: {
      userId,
      orderId,
      totalPrice,
    },
  });
};

const deleteById = async (id: string) => {
  return await prisma.downloads.delete({ where: { id } });
};

export default {
  getDownloads,
  postDownload,
  deleteById,
};
