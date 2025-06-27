import { MongoBinary as FileService } from "mongodb-memory-server-core";

const download = async function (req, res) {
  try {
    const relativePath = req.query.path;
    const filePath = FileService.download(relativePath);
    return res.sendFile(filePath);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const upload = async function (req, res) {
  console.log("Uploading a file");
  if (!req.file) return res.status(400).json({ message: "There is no file" });

  res.status(200).json({
    message: "File upload correctly",
    tempFilename: req.file.filename,
    tempPath: `/temp/${req.file.filename}`,
  });
};

export default {
  download,
  upload,
};
