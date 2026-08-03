import { UserRepository } from "./user.repository.js";
import type { CreateUserInput, User } from "./user.types.js";

export class UserService {
	constructor(private readonly userRepository = new UserRepository()) {}

	async create(data: CreateUserInput): Promise<User> {
		return this.userRepository.create(data);
	}
}

