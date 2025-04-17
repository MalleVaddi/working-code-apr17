import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() postId!: string;

  commentForm: FormGroup;
  comments: any[] = [];
  loading: boolean = false;
  editingCommentId: string | null = null;
  editText: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.commentForm = this.fb.group({
      newComment: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.postId) {
      this.loadComments();
    }
  }

  loadComments(): void {
    this.loading = true;
    this.http.get<any[]>(`http://localhost:8000/api/posts/${this.postId}/comments`).subscribe({
      next: (data) => {
        this.comments = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Failed to load comments', err);
        this.loading = false;
      }
    });
  }

  addComment(): void {
    const text = this.commentForm.value.newComment?.trim();
    if (!text) return;

    this.http.post(`http://localhost:8000/api/posts/${this.postId}/comments`, { text }).subscribe({
      next: () => {
        this.commentForm.reset();
        this.loadComments();
      },
      error: (err) => console.error('❌ Failed to post comment', err)
    });
  }

  startEdit(comment: any): void {
    this.editingCommentId = comment._id;
    this.editText = comment.text;
  }

  cancelEdit(): void {
    this.editingCommentId = null;
    this.editText = '';
  }

  saveEdit(): void {
    if (!this.editingCommentId || !this.editText.trim()) return;

    this.http.put(
      `http://localhost:8000/api/posts/${this.postId}/comments/${this.editingCommentId}`,
      { text: this.editText.trim() }
    ).subscribe({
      next: () => {
        this.cancelEdit();
        this.loadComments();
      },
      error: (err) => console.error('❌ Failed to update comment', err)
    });
  }

  deleteComment(commentId: string): void {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    this.http.delete(
      `http://localhost:8000/api/posts/${this.postId}/comments/${commentId}`
    ).subscribe({
      next: () => this.loadComments(),
      error: (err) => console.error('❌ Failed to delete comment', err)
    });
  }
}
