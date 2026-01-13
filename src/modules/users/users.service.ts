import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '@common/enums/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async findAll(skip = 0, take = 10): Promise<User[]> {
    return this.userRepository.find({ skip, take });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.findOne(id);
    await this.userRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.userRepository.delete(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByRole(role: Role, skip = 0, take = 10): Promise<User[]> {
    return this.userRepository.find({
      where: { role },
      skip,
      take,
    });
  }

  async updatePassword(userId: string, newPassword: string): Promise<User> {
    const user = await this.findOne(userId);
    user.password = await bcrypt.hash(newPassword, 10);
    return this.userRepository.save(user);
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<User> {
    const user = await this.findOne(userId);
    // Avatar/photo not available in current schema
    // TODO: Add photoUrl or avatar field to User entity
    return user;
  }

  async getUserProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['patients', 'schedules', 'activityLogs'],
    });
    if (!user) throw new NotFoundException('User not found');
    const userProfile = { ...user };
    // password is already not selected in queries, no need to delete
    return userProfile as User;
  }

  async deactivateUser(userId: string): Promise<User> {
    const user = await this.findOne(userId);
    user.active = false;
    return this.userRepository.save(user);
  }

  async searchUsers(query: string, skip = 0, take = 10): Promise<User[]> {
    return this.userRepository.find({
      where: [
        { firstName: Like(`%${query}%`) },
        { lastName: Like(`%${query}%`) },
        { email: Like(`%${query}%`) },
      ],
      skip,
      take,
    });
  }
}
