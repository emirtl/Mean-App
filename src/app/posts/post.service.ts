import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { PostModel } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: PostModel[] = [];
  updatedPosts = new Subject<PostModel[]>();
  constructor(private httpClient: HttpClient, private router: Router) {}

  getPosts() {
    return this.httpClient
      .get<{ message: String; posts: PostModel[] }>(
        'http://localhost:3000/api/posts/getPosts'
      )
      .subscribe((resData) => {
        this.posts = resData.posts;
        this.updatedPosts.next([...this.posts]);
        console.log(resData.message);
      });
  }

  updatedPostListener() {
    return this.updatedPosts.asObservable();
  }

  addPost(post: PostModel) {
    return this.httpClient
      .post<{ message: String }>('http://localhost:3000/api/posts/post', {
        post,
      })
      .subscribe((resData) => {
        console.log(resData);
        this.posts.push(post);
        this.updatedPosts.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }
}
