import { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import { catchAsync } from "../../shared/catchAsync";
import { tokenUtils } from "../../utils/token";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { CookieUtils } from "../../utils/cookie";

const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "you are unauthorized" });
  }
  const result = await authService.getCurrentUser(user.id);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "retrieve current user successsfully",
    data: result,
  });
});

const signoutUser = catchAsync(async (req: Request, res: Response) => {
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const user = req.user;
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "you are unauthorized" });
  }
  const result = await authService.signoutUser(user.id, betterAuthSessionToken);
  CookieUtils.clearCookie(res, "accesstoken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  CookieUtils.clearCookie(res, "refreshtoken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  CookieUtils.clearCookie(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User logged out successfully",
    data: result,
  });
});

const signup = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.signup(req.body);
  if (!result) {
    return res.status(400).json({ success: false, message: "Signup failed" });
  }
  const { accesstoken, refreshtoken, token } = result;
  tokenUtils.setAccessTokenCookie(res, accesstoken);
  tokenUtils.setRefreshTokenCookie(res, refreshtoken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "user signup successfully",
    data: result,
  });
});

const signin = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.signin(req.body);
  const { accessToken, refreshToken, token } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "user signin successfully",
    data: result,
  });
});
export const authController = {
  getCurrentUser,
  signoutUser,
  signup,
  signin,
};
