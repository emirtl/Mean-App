import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../Material.module';
import { CreatePostComponent } from './create-post/create-post.component';
import { PostListComponent } from './post-list/post-list.component';

@NgModule({
  declarations: [CreatePostComponent, PostListComponent],
  imports: [
    AngularMaterialModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
  ],
})
export class PostsModule {}
