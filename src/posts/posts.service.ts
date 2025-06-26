import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './interfaces/post.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { Posts } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private postRepository: Repository<Posts>,
  ) {}

  async findAll(): Promise<Posts[]> {
    return this.postRepository.find({
      relations: ['authorName'],
    });
  }

  async findOne(id: number): Promise<Posts> {
    const singlePost = await this.postRepository.findOne({
      where: { id },
      relations: ['authorName'],
    });

    if (!singlePost) {
      throw new NotFoundException(`Post with ID ${id} can't seem to be found`);
    }
    return singlePost;
  }

  async create(createPostData: CreatePostDto): Promise<Post> {
    const newPost: Post = this.postRepository.create({
      title: createPostData.title,
      content: createPostData.content,
      author: User,
    });
    return this.postRepository.save(newPost);
  }

  async update(id: number, updatePostData: UpdatePostDto): Promise<Posts> {
    const findPostToEdit = await this.findOne(id);

    if (!findPostToEdit) {
      throw new NotFoundException(`Post with ID ${id} is not found.`);
    }
    if (updatePostData.title) {
      findPostToEdit.title = updatePostData.title;
    }
    if (updatePostData.content) {
      findPostToEdit.content = updatePostData.content;
    }

    return this.postRepository.save(findPostToEdit);
  }
}
