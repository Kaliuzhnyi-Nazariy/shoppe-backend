import pLimit from "p-limit";
import cloudinary from "../lib/cloudinary";

const limit = pLimit(10);

export const cloudinaryUpload = async (
  files: Express.Multer.File[],
): Promise<{ link: string; id: string }[]> => {
  if (files.length === 0) {
    return [];
  }

  try {
    const uploads = await Promise.all(
      files.map((file) => {
        return limit(
          () =>
            new Promise<{ link: string; id: string }>((resolve, reject) => {
              cloudinary.uploader
                .upload_stream(
                  {
                    filename_override: file.filename,
                    folder: "product_images",
                    public_id: `product_${Date.now()}_${file.originalname}`,
                    overwrite: true,
                  },
                  (error, result) => {
                    if (error) return reject(error);
                    resolve({
                      link: result!.secure_url,
                      id: result!.public_id,
                    });
                  },
                )
                .end(file.buffer);
            }),
        );
      }),
    );

    return uploads;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const cloudinaryDelete = async (ids: string[]) => {
  if (!ids.length) return;

  try {
    const results = await Promise.all(
      ids.map((id) => cloudinary.uploader.destroy(id)),
    );

    return results;
  } catch (error) {
    console.error(error);
    return ids;
  }
};
