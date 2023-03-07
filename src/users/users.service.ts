import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {
  }

  create(email: string, password: string) {
    const user = this.repository.create({ email, password });
    return this.repository.save(user);
  }

  get(id: number) {
    if (!id) {
      return null
    }
    return this.repository.findOneBy({ id });
  }

  getAll(email: string) {
    return this.repository.findBy({ email });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.get(id);
    if (!user) {
      throw new NotFoundException("User with id: [" + id + "] not found");
    }
    Object.assign(user, attrs);
    return this.repository.save(user);
  }

  async remove(id: number) {
    const user = await this.get(id);
    if (!user) {
      throw new NotFoundException("User with id: [" + id + "] not found");
    }
    return this.repository.remove(user);
  }
}
