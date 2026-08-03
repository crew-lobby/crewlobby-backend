import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import { db } from "../../db/index.js";
import { users } from "../../db/schema/users.js";
import { AppError } from "../../shared/errors/app-error.js";
import type { CreateUserInput, User } from "./user.types.js";

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const user = result[0];

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async create(data: CreateUserInput): Promise<User> {
    const result = await db
      .insert(users)
      .values({
        id: randomUUID(),
        name: data.name,
        email: data.email,
      })
      .onConflictDoNothing()
      .returning();

    const user = result[0];

    if (!user) {
      throw new AppError(409, "User already exists");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}