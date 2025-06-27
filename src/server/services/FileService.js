import path from "path";
import fs from "fs";
import { NotFoundError } from "./errors/NotFoundError.js";
import { AccessDenied } from "./errors/AccessDenied.js";

const BASE_FOLDER = path.resolve("files");
const TEMP_FOLDER = path.join(BASE_FOLDER, "temp");
const CARS_FOLDER = "cars";
const PARTS_FOLDER = "parts";

if (!fs.existsSync(TEMP_FOLDER)) fs.mkdirSync(TEMP_FOLDER, { recursive: true });
if (!fs.existsSync(path.join(BASE_FOLDER, CARS_FOLDER)))
  fs.mkdirSync(path.join(BASE_FOLDER, CARS_FOLDER), { recursive: true });
if (!fs.existsSync(path.join(BASE_FOLDER, PARTS_FOLDER)))
  fs.mkdirSync(path.join(BASE_FOLDER, PARTS_FOLDER), { recursive: true });

export const getTempFolder = () => TEMP_FOLDER;
export const getCarsFolder = () => CARS_FOLDER;
export const getPartsFolder = () => PARTS_FOLDER;

export function persistFile(newPath, fileName, newFileName) {
  const sourcePath = path.join(TEMP_FOLDER, fileName);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`File not found: ${fileName}`);
  }

  const ext = path.extname(fileName);
  const finalFileName = newFileName ? `${newFileName}${ext}` : fileName;
  const targetDir = path.join(BASE_FOLDER, newPath);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetPath = path.join(targetDir, finalFileName);
  fs.renameSync(sourcePath, targetPath);

  return `${newPath}/${finalFileName}`;
}

export async function getFileAbsolutePath(relativePath) {
  const absolutePath = path.join(BASE_FOLDER, relativePath);

  if (!absolutePath.startsWith(BASE_FOLDER)) {
    throw new AccessDenied("Permission denied");
  }

  if (!fs.existsSync(absolutePath)) {
    throw new NotFoundError("File not found");
  }

  return absolutePath;
}

export async function deleteFile(relativePath) {
  const absolutePath = await getFileAbsolutePath(relativePath);
  const dirPath = path.dirname(absolutePath);

  try {
    await fs.promises.unlink(absolutePath);
    console.log(`File deleted: ${absolutePath}`);

    // Removes the directory if there is no more files in
    const files = await fs.promises.readdir(dirPath);
    if (files.length === 0) {
      await fs.promises.rmdir(dirPath);
      console.log(`Empty directory removed: ${dirPath}`);
    }
  } catch (err) {
    console.error(`Error removing file:`, err);
  }
}

export async function deleteFolder(folderName) {
  const targetPath = path.join(BASE_FOLDER, folderName);

  if (!targetPath.startsWith(BASE_FOLDER)) {
    throw new Error("Invalid path");
  }

  try {
    await fs.promises.rm(targetPath, { recursive: true, force: true });
    console.log(`Deleted folder: ${targetPath}`);
  } catch (err) {
    console.error(`Error deleting folder ${targetPath}:`, err);
  }
}

export async function cleanupOldTempFiles(days = 1) {
  const expirationMs = days * 24 * 60 * 60 * 1000;
  const now = Date.now();

  try {
    const files = await fs.promises.readdir(TEMP_FOLDER);

    for (const file of files) {
      const match = file.match(/-(\d+)\.[^\.]+$/);
      if (!match) continue;

      const timestamp = parseInt(match[1], 10);
      if (isNaN(timestamp)) continue;

      if (now - timestamp > expirationMs) {
        const filePath = path.join(TEMP_FOLDER, file);
        await fs.promises.unlink(filePath);
        console.log(`Deleted old temp file: ${file}`);
      }
    }
  } catch (err) {
    console.error("Error cleaning up temp files:", err);
  }
}
