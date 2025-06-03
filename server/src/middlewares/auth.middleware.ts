import { NextFunction, Request, Response } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import RoleEnum from "../types/enums/role-enum";
import UserRole from "../db/models/user-role.model";
import Role from "../db/models/role.model";

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

export const authorize = (permittedRoles: RoleEnum[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return void res.sendStatus(401);
    const userId = req.user.id;
    UserRole.findAll({ where: { userId }, include: Role })
      .then((data) => {
        const roles = data.map((userRole) => userRole.role.name);
        if (permittedRoles.some((prole) => roles.includes(prole))) next();
        return res.sendStatus(403);
      })
      .catch((error) => {
        console.log(error);
        return res.sendStatus(403);
      });
  };
};

export default authMiddleware;
