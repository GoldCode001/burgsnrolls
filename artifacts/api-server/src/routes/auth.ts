import { Router } from "express";
import { generateToken } from "../middleware/auth.js";

const router = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "burgsnrolls2024";

router.post("/auth/login", (req, res) => {
  const { password } = req.body as { password?: string };
  if (!password || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Wrong password" });
    return;
  }
  const token = generateToken();
  res.json({ token });
});

export default router;
