// src/types/express.d.ts

import * as express from "express"

declare global {
  namespace Express {
    interface Request {
      authUser?: {
        id: string
        // Add other properties that `authUser` might have
      }
    }
  }
}
