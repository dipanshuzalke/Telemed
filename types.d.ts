// types.d.ts
import { AuthUser } from "./lib/auth";
import "next";

declare module "next" {
  interface NextApiRequest {
    user?: AuthUser; // JWT user
  }
}
