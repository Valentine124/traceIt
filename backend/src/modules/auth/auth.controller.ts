import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';

export async function requestOtp(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.requestPhoneOtp(req.body.phone);
    res.status(200).json({ message: 'OTP sent' });
  } catch (err) {
    next(err);
  }
}

export async function verifyOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.verifyPhoneOtpAndLogin(req.body.phone, req.body.otp);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, displayName } = req.body;
    const result = await authService.registerWithEmail(email, password, displayName);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.loginWithEmail(req.body.email, req.body.password);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.refreshSession(req.body.refreshToken);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function logoutAll(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.logoutAllSessions(req.user!.sub);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
