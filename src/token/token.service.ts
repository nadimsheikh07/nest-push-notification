import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from './entities/token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name)
    private tokenModel: Model<TokenDocument>,
  ) {}

  async create(createTokenDto: CreateTokenDto): Promise<Token> {
    const existing = await this.tokenModel.findOne({
      token: createTokenDto.token,
    });

    if (existing) {
      return existing;
    }

    const createdToken = new this.tokenModel(createTokenDto);
    return createdToken.save();
  }

  async findAll(): Promise<Token[]> {
    return this.tokenModel.find().exec();
  }

  async findOne(id: string): Promise<Token> {
    const token = await this.tokenModel.findById(id).exec();

    if (!token) {
      throw new NotFoundException('Token not found');
    }

    return token;
  }

  async update(id: string, updateTokenDto: UpdateTokenDto): Promise<Token> {
    const updated = await this.tokenModel
      .findByIdAndUpdate(id, updateTokenDto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Token not found');
    }

    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.tokenModel.findByIdAndDelete(id).exec();

    if (!deleted) {
      throw new NotFoundException('Token not found');
    }

    return { message: 'Token deleted successfully' };
  }
}
