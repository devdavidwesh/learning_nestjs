import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './interfaces/post.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { Posts } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private postRepository: Repository<Posts>,
  ) {}

  async findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  async findOne(id: number): Promise<Post> {
    const singlePost = await this.postRepository.findOneBy({ id });

    if (!singlePost) {
      throw new NotFoundException(`Post with ID ${id} can't seem to be found`);
    }
    return singlePost;
  }

  async create(createPostData: CreatePostDto): Promise<Post> {
    const newPost: Post = this.postRepository.create({
      title: createPostData.title,
      content: createPostData.content,
      authorName: createPostData.authorName,
    });
    return this.postRepository.save(newPost);
  }

  async update(id: number, updatePostData: UpdatePostDto): Promise<Post> {
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
    if (updatePostData.authorName) {
      findPostToEdit.authorName = updatePostData.authorName;
    }

    return this.postRepository.save(findPostToEdit);
  }
}
