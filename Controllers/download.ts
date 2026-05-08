import { NextFunction, Request, Response } from "express";
import { controllerWrapper, getParam, getUserData } from "../helpers";
import service from "../service/download";

const getDownloads = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id, role } = getUserData(req);

  const downloads = await service.getDownloads({ id, role });

  res.status(200).json(downloads);
};

// const postDownloads = async () => {};

// const deleteDownloads = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const { id } = getUserData(req);

//   await service.deleteDownload(id);

//   res.sendStatus(204);
// };

const deleteDownloadsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = getParam(req, "id", "Id");

  const deleteDownloadItem = await service.deleteById(id);

  res.status(200).json(deleteDownloadItem);
};

export default {
  getDownloads: controllerWrapper(getDownloads),
  // postDownloads: controllerWrapper(postDownloads),
  // deleteDownloads: controllerWrapper(deleteDownloads),
  deleteDownloadsById: controllerWrapper(deleteDownloadsById),
};
