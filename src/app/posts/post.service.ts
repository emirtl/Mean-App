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
      .get<{ message: string; posts: any }>(
        'http://localhost:3000/api/posts/getPosts'
      )
      .pipe(
        map((data) => {
          return data.posts.map((p: any) => {
            return {
              title: p.title,
              content: p.content,
              id: p._id,
              image: p.image,
            };
          });
        })
      )
      .subscribe((resData) => {
        console.log('getPosts : ', resData);

        this.posts = resData;
        this.updatedPosts.next([...this.posts]);
      });
  }
  singlePost(postId: string | null) {
    return this.httpClient.get<{ message: string; post: any }>(
      'http://localhost:3000/api/posts/single-post/' + postId
    );
  }

  updatedPostListener() {
    return this.updatedPosts.asObservable();
  }

  addPost(post: PostModel) {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', post.image, post.title);

    this.httpClient
      .post<{ message: string; image: string }>(
        'http://localhost:3000/api/posts/post',
        postData
      )
      .subscribe(() => {
        this.posts.push(post);
        this.updatedPosts.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }
  editPost(postId: string | null, post: PostModel) {
    let postData: PostModel | FormData;
    if (typeof post.image === 'object') {
      postData = new FormData();
      postData.append('title', post.title);
      postData.append('content', post.content);
      postData.append('image', post.image, post.title);
    } else {
      postData = {
        id: postId,
        title: post.title,
        content: post.content,
        image: post.image,
      };
    }
    return this.httpClient
      .post<{ message: string }>(
        'http://localhost:3000/api/posts/post-edit/' + postId,
        postData
      )
      .subscribe((resData) => {
        console.log(resData.message);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string | null) {
    return this.httpClient.delete(
      'http://localhost:3000/api/posts/delete-post/' + postId
    );
  }
}
