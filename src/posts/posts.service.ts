import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './interfaces/post.interface';

@Injectable()
export class PostsService {
  private posts: Post[] = [
    {
      id: 1,
      title: 'Getting Started with NestJS',
      content:
        'A comprehensive guide to building your first NestJS application...',
      authorName: 'Jane Smith',
      createdAt: new Date('2023-05-15'),
      updatedAt: new Date('2023-05-16'),
    },
    {
      id: 2,
      title: 'TypeScript Best Practices',
      content:
        'Learn how to write cleaner and more maintainable TypeScript code...',
      authorName: 'John Doe',
      createdAt: new Date('2023-06-20'),
      updatedAt: new Date('2023-06-22'),
    },
    {
      id: 3,
      title: 'The Future of Web Development',
      content:
        'Exploring emerging trends in modern web development frameworks...',
      authorName: 'Alex Johnson',
      createdAt: new Date('2023-07-10'),
      updatedAt: new Date('2023-07-12'),
    },
    {
      id: 4,
      title: 'Database Optimization Techniques',
      content: 'How to improve your database queries for better performance...',
      authorName: 'Sarah Williams',
      createdAt: new Date('2023-08-05'),
      updatedAt: new Date('2023-08-07'),
    },
    {
      id: 5,
      title: 'Microservices Architecture Patterns',
      content: 'Design patterns for building scalable microservices systems...',
      authorName: 'Michael Brown',
      createdAt: new Date('2023-09-18'),
      updatedAt: new Date('2023-09-20'),
    },
  ];

  findAll(): Post[] {
    return this.posts;
  }

  findOne(id: number): Post {
    const singlePost = this.posts.find((post) => post.id === id);

    if (!singlePost) {
      throw new NotFoundException(`Post with ID ${id} can't seem to be found`);
    }
    return singlePost;
  }

  create(createPostData: Omit<Post, 'id' | 'createdAt'>): Post {
    const newPost: Post = {
      id: this.getNextId(),
      ...createPostData,
      createdAt: new Date(),
    };
    this.posts.push(newPost);
    return newPost;
  }

  update(
    id: number,
    updatePostData: Partial<Omit<Post, 'id' | 'createdAt'>>,
  ): Post {
    const currentPostIndexToEdit = this.posts.findIndex(
      (post) => post.id === id,
    );

    if (currentPostIndexToEdit === -1) {
      throw new NotFoundException(`Post with ID ${id} is not found.`);
    }
    this.posts[currentPostIndexToEdit] = {
      ...this.posts[currentPostIndexToEdit],
      ...updatePostData,
      updatedAt: new Date(),
    };

    return this.posts[currentPostIndexToEdit];
  }

  private getNextId(): number {
    return this.posts.length > 0
      ? Math.max(...this.posts.map((post) => post.id)) + 1
      : 1;
  }
}
