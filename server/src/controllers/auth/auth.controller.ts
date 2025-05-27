import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { validationResult } from "express-validator";
import UserService from "../../services/user.services";
import { emailNotVerified, userNotFound } from "../../responses";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

export default class AuthController {
  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await UserService.findUserById(email);
    if (!user) return res.status(401).json({ errors: userNotFound });
    const validPassword = UserService.checkPassword(user, password);
    if (!validPassword) return res.status(401).json({ errors: userNotFound });
    if (!user.isVerified)
      return res.status(401).json({ errors: emailNotVerified });
    const authResponse = await UserService.generateAuthResponse(user);
    return res.status(200).json(authResponse);
  });

  static refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.body.token;
    const isTokenActive = await UserService.getIsTokenActive(refreshToken);
    if (!isTokenActive) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      "refresh_token",
      async (error: VerifyErrors | null, decoded: unknown) => {
        if (error) return res.status(403);
        try {
          const { email, id, roles } = decoded as RequestUser;
          const user = { email, id, roles };
          const authResponse = await UserService.generateAuthResponse(user);
          return res.status(200).json(authResponse);
        } catch (err) {
          console.log(err);
          res.sendStatus(403);
        }
      }
    );
  });

  static logout = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.sendStatus(401);
    const userId = parseInt(req.user.id);
    await UserService.logoutUser(userId);
    return res.sendStatus(200);
  });
}
