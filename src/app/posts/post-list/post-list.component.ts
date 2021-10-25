import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/authentication/auth.service';
import { PostModel } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: PostModel[] = [];
  totalPosts: number = 0;
  pageSize: number = 3;
  pageIndex: number = 1;
  isUserAuthenticate = false;
  userId: string = '';
  private subscription!: Subscription;
  private getIsAuthListnerSub: Subscription | undefined;

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.postService.getPosts(this.pageSize, this.pageIndex);
    this.userId = this.authService.getUserId();
    this.subscription = this.postService
      .updatedPostListener()
      .subscribe((resData: { posts: PostModel[]; totalPostItems: number }) => {
        this.posts = resData.posts;
        this.totalPosts = resData.totalPostItems;
        this.userId = this.authService.getUserId();
      });
    this.isUserAuthenticate = this.authService.getisAuth();
    this.getIsAuthListnerSub = this.authService
      .getIsAuthListner()
      .subscribe((bool) => {
        this.isUserAuthenticate = bool;
      });
  }
  onDelete(postId: string | null) {
    this.postService.deletePost(postId).subscribe((resData) => {
      this.postService.getPosts(this.pageSize, this.pageIndex);
    });
  }

  onChangedPage(event: PageEvent) {
    this.pageIndex = event.pageIndex + 1;
    // we do +1 beacause on our backends
    // pageIndex is 1
    this.pageSize = event.pageSize;
    this.postService.getPosts(this.pageSize, this.pageIndex);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.getIsAuthListnerSub?.unsubscribe();
  }
}
