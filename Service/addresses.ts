import { prisma } from "../lib/prisma";

const getAddresses = async (userId: string) => {
  return await prisma.address.findMany({ where: { userId } });
};

const getAddressById = async ({
  userId,
  addressId,
}: {
  userId: string;
  addressId: string;
}) => {
  return await prisma.address.findUnique({ where: { userId, id: addressId } });
};

export interface IPostAddress {
  userId: string;
  firstName: string;
  lastName: string;
  companyName: string;
  country: string;
  streetAddress: string;
  postcode: string;
  city: string;
  phone: string;
  email: string;
}

const postAddress = async ({
  userId,
  firstName,
  lastName,
  companyName,
  country,
  streetAddress,
  postcode,
  city,
  phone,
  email,
}: IPostAddress) => {
  const newAddress = await prisma.address.create({
    data: {
      userId,
      firstName,
      lastName,
      companyName,
      country,
      streetAddress,
      postcode,
      city,
      phone,
      email,
    },
  });

  return newAddress;
};

const updateAddress = async (data: IPostAddress & { addressId: string }) => {
  const updatedAddress = await prisma.address.update({
    where: { id: data.addressId, userId: data.userId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      companyName: data.companyName,
      country: data.country,
      streetAddress: data.streetAddress,
      postcode: data.postcode,
      city: data.city,
      phone: data.phone,
      email: data.email,
    },
  });

  return updatedAddress;
};

const deleteAddress = async (userId: string, addressId: string) => {
  const deletedAddress = await prisma.address.delete({
    where: { userId, id: addressId },
  });

  return deletedAddress;
};

export default {
  getAddresses,
  getAddressById,
  postAddress,
  updateAddress,
  deleteAddress,
};
