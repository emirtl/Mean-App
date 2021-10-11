import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { PostModel } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: PostModel[] = [];
  updatedPosts = new Subject<PostModel[]>();
  constructor(private httpClient: HttpClient, private router: Router) {}

  getPosts() {
    return this.httpClient
      .get<{ message: String; posts: any }>(
        'http://localhost:3000/api/posts/getPosts'
      )
      .pipe(
        map((data) => {
          return data.posts.map((p: any) => {
            return { title: p.title, content: p.content, id: p._id };
          });
        })
      )
      .subscribe((resData) => {
        this.posts = resData;
        this.updatedPosts.next([...this.posts]);
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

  deletePost(postId: String) {
    return this.httpClient.delete(
      'http://localhost:3000/api/posts/delete-post/' + postId
    );
  }
}
