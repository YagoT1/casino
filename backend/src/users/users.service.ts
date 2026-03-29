import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.usersRepo.findOne({ where: { id } });
  }

  create(data: Pick<User, 'email' | 'passwordHash' | 'fullName' | 'birthDate'>) {
    const user = this.usersRepo.create(data);
    return this.usersRepo.save(user);
  }

  listAll() {
    return this.usersRepo.find({ order: { createdAt: 'DESC' } });
  }
}
