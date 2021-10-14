import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from '../mimetype.validation.ts';
import { PostModel } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit {
  public post: PostModel | undefined;
  public form!: FormGroup;
  public imagePreview: String | ArrayBuffer | null = '';
  private state: string = 'create';
  private postId: String | null = '';
  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(10)],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
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
          this.form?.setValue({
            title: this.post?.title,
            content: this.post?.content,
            image: '',
          });
        });
      } else {
        this.state = 'create';
        this.postId = '';
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const post: PostModel = {
      id: '',
      title: this.form.value.title,
      content: this.form.value.content,
    };
    if (this.state === 'create') {
      this.postService.addPost(post);
    } else {
      this.postService.editPost(this.postId, post);
    }
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const files = (event.target as HTMLInputElement).files!;
    const file = files[0];
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
      console.log(reader.result);
    };
    reader.readAsDataURL(file);
  }
}
