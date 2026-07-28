import { randomUUID } from "node:crypto";

import type { CreateUserInput, User } from "./user.types";

export class UserRepository {
async findByEmail(_email: string): Promise<User | null> {
return null;
}

async create(data: CreateUserInput): Promise<User> {
return {
id: randomUUID(),
name: data.name,
email: data.email,
createdAt: new Date(),
};
}
}