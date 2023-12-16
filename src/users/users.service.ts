import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return await this.repo.save(user);
    //return await this.repo.insert(user);
  }

  async findOne(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User not found with id: ${id}`);
    }
    return user;
  }

  async find(email: string) {
    return await this.repo.findBy({ email });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`user not found with id: ${id}`);
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const data = await this.repo.delete(id);
    if (data.affected === 0) {
      throw new BadRequestException(`User whit id ${id} not found`);
    }
    return;
  }
}
