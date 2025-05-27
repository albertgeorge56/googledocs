import { NextFunction, Request, Response } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return void res.sendStatus(401);
  jwt.verify(
    token,
    "access_token",
    (error: VerifyErrors | null, decoded: unknown) => {
      if (error) return void res.sendStatus(403);
      try {
        const { id, email, roles } = decoded as RequestUser;
        req.user = { id, email, roles };
        next();
      } catch (err) {
        console.log(err);
        return void res.sendStatus(403);
      }
    }
  );
};

export default authMiddleware;
