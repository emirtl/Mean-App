import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../authentication/auth.service';
import { PostModel } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: PostModel[] = [];

  updatedPosts = new Subject<{
    posts: PostModel[];
    totalPostItems: number;
  }>();
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  getPosts(pageSize: number, pageIndex: number) {
    const query = `?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    return this.httpClient
      .get<{
        message: string;
        posts: any;
        totalPostItems: number;
      }>('http://localhost:3000/api/posts/getPosts' + query)
      .pipe(
        map((data) => {
          return {
            posts: data.posts.map((p: any) => {
              return {
                title: p.title,
                content: p.content,
                id: p._id,
                image: p.image,
                creator: p.creator,
              };
            }),
            totalPostItems: data.totalPostItems,
          };
        })
      )
      .subscribe((resData) => {
        console.log(resData);

        this.posts = resData.posts;
        this.updatedPosts.next({
          posts: [...this.posts],
          totalPostItems: resData.totalPostItems,
        });
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
    const token = this.authService.getToken();
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
      postData.append('creator', '');
    } else {
      postData = {
        id: postId,
        title: post.title,
        content: post.content,
        image: post.image,
        creator: '',
      };
    }
    return this.httpClient
      .post<{ message: string }>(
        'http://localhost:3000/api/posts/post-edit/' + postId,
        postData
      )
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string | null) {
    return this.httpClient.delete(
      'http://localhost:3000/api/posts/delete-post/' + postId
    );
  }
}
