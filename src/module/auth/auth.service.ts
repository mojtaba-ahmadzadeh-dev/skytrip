import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity.js';
import { Repository } from 'typeorm';

class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}
}

export default AuthService;
