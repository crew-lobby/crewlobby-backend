export type CreateUserInput = {
name: string;
email: string;
};

export type User = {
id: string;
name: string;
email: string;
createdAt: Date;
};