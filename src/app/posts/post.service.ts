import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PostModel } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  posts: PostModel[] = [];
  constructor(private router: Router) {}
  getPosts() {
    return [...this.posts];
  }

  addPost(post: PostModel) {
    this.posts.push(post);
    this.router.navigate(['/']);
  }
}
