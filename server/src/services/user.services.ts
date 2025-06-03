import User from "../db/models/user.model";
import { compare, genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import RefreshToken from "../db/models/refresh-token.model";
import MailService from "./mail.services";

export default class UserService {
  static findUserByEmail = async (email: string): Promise<User | null> => {
    const user = await User.findOne({ where: { email } });
    return user;
  };
  static createUser = async (email: string, password: string) => {
    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);
    const verificationToken = jwt.sign({ email }, "verify_email");
    const user = await User.create({
      email,
      password: hashedPassword,
      verificationToken,
    });
    await UserService.sendVerificationMail(user);
  };

  static sendPasswordResetMail = async (user: User) => {
    const mail = {
      from: "georgeynr@gmail.com",
      to: user.email,
      subject: "Reset your password",
      text: `http://localhost:3000/user/reset-email/${user.passwordResetToken}`,
    };
    await MailService.sendMail(mail);
  };

  private static sendVerificationMail = async (user: User) => {
    const mail = {
      from: "georgeynr@gmail.com",
      to: user.email,
      subject: "Welcome to google docs",
      text: `Click the following link to verify your email: http://localhost:3000/user/verify-email/${user.verificationToken}`,
    };
    await MailService.sendMail(mail);
  };

  static checkPassword = async (
    user: User,
    password: string
  ): Promise<boolean> => {
    return await compare(password, user.password);
  };

  static getRequestUser = async (
    user: User | RequestUser
  ): Promise<RequestUser> => {
    if (user instanceof User) {
      const userWithRoles = await User.scope("withRoles").findByPk(user.id);
      const roles = userWithRoles?.userRoles.map(
        (userRole) => userRole.role.name
      );
      return { id: user.id, email: user.email, roles: roles } as RequestUser;
    } else {
      return user;
    }
  };

  static generateAuthResponse = async (
    user: RequestUser | User
  ): Promise<TokenPair> => {
    const requestUser = await this.getRequestUser(user);
    const accessToken = jwt.sign(requestUser, "access_token", {
      expiresIn: "24h",
    });
    const refreshToken = jwt.sign(requestUser, "refresh_token", {
      expiresIn: "24h",
    });
    await RefreshToken.destroy({ where: { id: user.id } });
    await RefreshToken.create({ token: refreshToken, userId: user.id });
    return { accessToken, refreshToken };
  };

  static getIsTokenActive = async (token: string): Promise<boolean> => {
    const refreshToken = await RefreshToken.findOne({ where: { token } });
    return refreshToken != null;
  };

  static logoutUser = async (userId: number) => {
    await RefreshToken.destroy({ where: { userId } });
  };

  static findUserById = async (id: number): Promise<User | null> => {
    const user = await User.findByPk(id);
    return user;
  };

  static resetpassword = async (user: User) => {
    const passwordResetToken = jwt.sign(
      { id: user.id, email: user.email },
      "password_reset",
      {
        expiresIn: "24h",
      }
    );
    await user.update({ passwordResetToken });
    await UserService.sendPasswordResetMail(user);
  };

  static findUserByPasswordResetToken = async (
    email: string,
    token: string
  ): Promise<User | null> => {
    const user = await User.findOne({
      where: { email, passwordResetToken: token },
    });
    return user;
  };
  static updatePassword = async (user: User, password: string) => {
    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);
    await user.update({ password: hashedPassword });
  };
  static findUserByVerificationToken = async (
    email: string,
    verificationToken: string
  ): Promise<User | null> => {
    const user = await User.findOne({ where: { email, verificationToken } });
    return user;
  };
  static updateIsVerified = async (user: User, isVerified: boolean) => {
    await user.update({ isVerified });
  };
}
