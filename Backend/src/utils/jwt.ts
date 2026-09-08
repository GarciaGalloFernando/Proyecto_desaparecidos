import jwt from "jsonwebtoken";
import { env } from "../config/env.js";


export function signToken(payload: object) {

  return jwt.sign(
    payload,
    env.jwtSecret,
    {
      expiresIn: "1h",
    }
  );

}