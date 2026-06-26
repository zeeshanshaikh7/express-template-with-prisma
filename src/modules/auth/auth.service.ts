import { AuthRepository } from "./auth.repository";

export class AuthService {
  constructor(
    private authRepository: AuthRepository
  ) { }

  async me(email: string) {
    return this.authRepository.findUserByEmail(email);
  }

  async findUserById(id: string) {
    return this.authRepository.findUserById(id);
  }
}