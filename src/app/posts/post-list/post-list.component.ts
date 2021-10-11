import { Component, OnDestroy, OnInit } from '@angular/core';
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
  private subscription!: Subscription;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postService.getPosts();
    this.subscription = this.postService
      .updatedPostListener()
      .subscribe((resData: PostModel[]) => {
        this.posts = resData;
      });
  }
  onDelete(postId: String) {
    this.postService.deletePost(postId).subscribe((resData) => {
      this.postService.getPosts();
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
