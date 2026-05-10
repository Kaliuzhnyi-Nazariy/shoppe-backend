import errorHandler from "./errorHandler";

export const ensureExists = async ({
  model,
  where,
  entityName,
}: {
  model: { findUnique: Function };
  where: object;
  entityName: string;
}) => {
  const request = await model.findUnique({
    where,
  });

  if (!request) throw errorHandler(404, entityName + " is not found");

  return request;
};
