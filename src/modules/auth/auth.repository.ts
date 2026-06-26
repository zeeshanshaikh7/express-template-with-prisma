import { PrismaClient } from "@prisma/client";

export class AuthRepository {
  constructor(private prisma: PrismaClient) { }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserById(id: string) {
    return {
      id: id,
      name: "Zeeshan",
      email: "[EMAIL_ADDRESS]",
      role: "admin",
    }
  }

}