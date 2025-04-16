import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent {
  commentForm: FormGroup;
  editingIndex: number | null = null; // Track the index of the comment being edited

  constructor(private formBuilder: FormBuilder) {
    this.commentForm = this.formBuilder.group({
      comments: this.formBuilder.array([]), // Store all comments in a single FormArray
    });
  }

  // Get comments as FormArray
  get comments(): FormArray {
    return this.commentForm.get('comments') as FormArray;
  }

  get commentControls(): FormGroup[] {
    return (this.commentForm.get('comments') as FormArray).controls as FormGroup[];
  }
  

  // Add a new comment
  addComment(commentText: string): void {
    if (commentText.trim()) {
      this.comments.push(this.formBuilder.group({ text: [commentText, Validators.required] }));
    }
  }

  // Enable edit mode for a comment
  startEditing(index: number): void {
    this.editingIndex = index;
  }

  // Save an edited comment
  saveComment(index: number, newText: string): void {
    if (newText.trim()) {
      this.comments.at(index).patchValue({ text: newText });
      this.editingIndex = null;
    }
  }

  // Delete a comment
  deleteComment(index: number): void {
    const confirmDelete = confirm("Are you sure you want to delete this comment?");
    if (confirmDelete) {
      this.comments.removeAt(index);
      if (this.editingIndex === index) {
        this.editingIndex = null; // Reset editing state if the comment being edited is deleted
      }
    }
  }
  
}
