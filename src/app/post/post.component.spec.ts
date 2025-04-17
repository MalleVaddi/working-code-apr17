import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { PostComponent } from './post.component';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs'; // To simulate observable
import { PostService } from '../services/post.service';  // Assuming the service is here

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let postService: PostService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule],
      declarations: [PostComponent],
      providers: [
        {
          provide: PostService, // Mock the PostService
          useValue: {
            getPosts: () => of([ // Mocking getPosts method
              {
                title: 'Travel in Yellowstone',
                content: 'Yellowstone National Park is a breathtaking destination full of geysers, wildlife, and natural beauty.',
              },
            ]), 
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService);  // Injecting the mocked PostService
    fixture.detectChanges();  // Detect changes after component creation
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the Yellowstone post', () => {
    // Check if the post content is displayed
    const postTitle = fixture.debugElement.nativeElement.querySelector('ul li h3');
    const postContent = fixture.debugElement.nativeElement.querySelector('ul li p');

    expect(postTitle.textContent).toContain('Travel in Yellowstone');
    expect(postContent.textContent).toContain('Yellowstone National Park is a breathtaking destination full of geysers, wildlife, and natural beauty.');
  });
});
