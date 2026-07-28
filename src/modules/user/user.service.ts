import { UserRepository } from "./user.repository";
import type { CreateUserInput, User } from "./user.types";

export class UserService {
constructor(private readonly userRepository = new UserRepository()) {}

async create(data: CreateUserInput): Promise<User> {
const existingUser = await this.userRepository.findByEmail(data.email);

if (existingUser) {
throw new Error("User already exists");
}

return this.userRepository.create(data);
}
}

