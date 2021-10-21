import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
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
  private subscription!: Subscription;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postService.getPosts(this.pageSize, this.pageIndex);
    this.subscription = this.postService
      .updatedPostListener()
      .subscribe((resData: { posts: PostModel[]; totalPostItems: number }) => {
        this.posts = resData.posts;
        this.totalPosts = resData.totalPostItems;
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
  }
}
