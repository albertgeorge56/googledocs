import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import UserService from "../../services/user.services";
import { resetPassword } from "../../responses";
import jwt, { VerifyErrors } from "jsonwebtoken";
export default class UserController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const { email, password1 } = req.body;
    await UserService.createUser(email, password1);
    return res.sendStatus(200);
  });

  static getUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const user = await UserService.findUserById(userId);
    if (user == null) return res.sendStatus(400);
    return res.status(200).json(user);
  });

  static resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await UserService.findUserByEmail(email);
    if (!user) return res.status(200).json(resetPassword);
    await UserService.resetpassword(user);
    return res.status(200).json(resetPassword);
  });

  static verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const verificationToken = req.params.token;
    jwt.verify(
      verificationToken,
      "verify_email",
      async (err: VerifyErrors | null, decoded: unknown) => {
        if (err) return res.sendStatus(403);
        try {
          const { email } = decoded as { email: string };
          UserService.findUserByVerificationToken(email, verificationToken)
            .then((user) => {
              if (!user || !user.isVerified) {
                return res.sendStatus(400);
              }
              UserService.updateIsVerified(user, true)
                .then(() => res.sendStatus(200))
                .catch(() => res.sendStatus(500));
            })
            .catch(() => res.sendStatus(500));
        } catch (err) {
          console.log(err);
          return res.sendStatus(403);
        }
      }
    );
  });

  static confirmResetPassword = asyncHandler(
    async (req: Request, res: Response) => {
      const resetPasswordToken = req.params.token;
      const { password1 } = req.body;
      jwt.verify(
        resetPasswordToken,
        "password_reset",
        (err: VerifyErrors | null, decoded: unknown) => {
          if (err) return res.sendStatus(403);
          try {
            const { email } = decoded as { email: string };
            UserService.findUserByPasswordResetToken(email, resetPasswordToken)
              .then((user) => {
                if (!user) return res.sendStatus(400);
                UserService.updatePassword(user, password1)
                  .then(() => {
                    return res.sendStatus(200);
                  })
                  .catch(() => {
                    return res.sendStatus(500);
                  });
              })
              .catch(() => {
                return res.sendStatus(500);
              });
          } catch (error) {
            console.log(error);
            res.sendStatus(403);
          }
        }
      );
    }
  );
}
