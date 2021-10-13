import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs/operators';
import { PostModel } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit {
  public post: PostModel | undefined;
  private state: string = 'create';
  private postId: String | null = '';
  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param: ParamMap) => {
      if (param.has('postId')) {
        this.state = 'edit';
        this.postId = param.get('postId');
        this.postService.singlePost(this.postId).subscribe((resData: any) => {
          this.post = {
            id: resData.post._id,
            content: resData.post.content,
            title: resData.post.title,
          };
        });
      } else {
        this.state = 'edit';
        this.postId = '';
      }
    });
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const post: PostModel = {
      id: '',
      title: form.value.title,
      content: form.value.content,
    };
    if (this.state === 'create') {
      this.postService.addPost(post);
    } else {
      this.postService.editPost(this.postId, post);
    }
    form.resetForm();
  }
}
