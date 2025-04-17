import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CommentComponent } from '../comment/comment.component'; // ✅ import comment component

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CommentComponent],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  postForm!: FormGroup;
  posts: any[] = [];
  currentPostIndex: number | null = null;

  private apiUrl = 'http://localhost:8000/api/posts';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: [''],
      content: ['']
    });
  
    this.fetchPosts();  
  }
  

  fetchPosts(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (posts) => this.posts = posts,
      error: (err) => console.error('Error fetching posts:', err)
    });
  }
  

  onSubmit(): void {
    if (!this.postForm.valid) return;

    const formData = this.postForm.value;

    if (this.currentPostIndex === null) {
      this.http.post(this.apiUrl, formData).subscribe({
        next: () => {
          console.log('✅ Post created');
          this.fetchPosts();
          this.postForm.reset();
        },
        error: (err) => console.error('Error creating post:', err)
      });
    } else {
      const postId = this.posts[this.currentPostIndex]._id;
      this.http.put(`${this.apiUrl}/${postId}`, formData).subscribe({
        next: () => {
          console.log('✏️ Post updated');
          this.fetchPosts();
          this.postForm.reset();
          this.currentPostIndex = null;
        },
        error: (err) => console.error('Error updating post:', err)
      });
    }
  }

  editPost(index: number): void {
    this.currentPostIndex = index;
    const post = this.posts[index];
    this.postForm.setValue({
      title: post.title || '',
      content: post.content || ''
    });
  }

  setDeleteIndex(index: number): void {
    const postId = this.posts[index]._id;
    if (window.confirm('Are you sure you want to delete this post?')) {
      this.http.delete(`${this.apiUrl}/${postId}`).subscribe({
        next: () => {
          console.log('🗑️ Post deleted');
          this.fetchPosts();
          this.postForm.reset();
          this.currentPostIndex = null;
        },
        error: (err) => console.error('Error deleting post:', err)
      });
    }
  }
}
