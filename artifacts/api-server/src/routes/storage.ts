import { Router, type IRouter } from "express";
import { ObjectStorageService, ObjectNotFoundError } from "../lib/objectStorage.js";
import { requireAuth } from "../middleware/auth.js";

const router: IRouter = Router();
const storage = new ObjectStorageService();

router.post("/storage/uploads/request-url", requireAuth, async (req, res) => {
  try {
    const { name, contentType } = req.body as {
      name?: string;
      contentType?: string;
    };

    if (!name || !contentType) {
      res.status(400).json({ error: "name and contentType are required" });
      return;
    }

    const uploadURL = await storage.getObjectEntityUploadURL();
    const objectPath = storage.normalizeObjectEntityPath(uploadURL);
    res.json({ uploadURL, objectPath });
  } catch (err) {
    req.log?.error({ err }, "Failed to generate upload URL");
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

router.get("/storage/objects/*path", async (req, res) => {
  try {
    const rawPath = req.params.path as string;
    const objectPath = `/objects/${rawPath}`;
    const file = await storage.getObjectEntityFile(objectPath);
    const response = await storage.downloadObject(file);

    const contentType = response.headers.get("content-type") ?? "application/octet-stream";
    const cacheControl = response.headers.get("cache-control") ?? "public, max-age=31536000";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", cacheControl);

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    if (err instanceof ObjectNotFoundError) {
      res.status(404).json({ error: "Object not found" });
      return;
    }
    req.log?.error({ err }, "Failed to serve object");
    res.status(500).json({ error: "Failed to serve object" });
  }
});

export default router;
