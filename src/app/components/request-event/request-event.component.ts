import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import{EventService} from '../../services/event.service';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-request-event',
  imports: [
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './request-event.component.html',
  styleUrl: './request-event.component.css'
})
export class RequestEventComponent {

  eventRequestForm!: FormGroup;
  selectedFile: File | null = null;


  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router
  ) {}

  uploadLogo(file: File): void {
    const formData = new FormData();
    formData.append('file', file);

    this.eventService.uploadLogo(formData).subscribe({
      next: (res) => {
        // Assuming backend returns { path: 'uploads/logos/image123.png' }
        this.eventRequestForm.get('logo')?.setValue(res.path);
      },
      error: (err) => {
        console.error('Logo upload failed', err);
      }
    });
  }


  eventFields = [
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'acronym', label: 'Acronym', type: 'text' },
    { name: 'eventType', label: 'Event Type', type: 'text' },
    { name: 'startsAt', label: 'Start Date', type: 'date' },
    { name: 'endsAt', label: 'End Date', type: 'date' },
    { name: 'theme', label: 'Theme', type: 'text' },
    { name: 'location', label: 'Location', type: 'text' },
    { name: 'topics', label: 'Topics', type: 'text' },
    { name: 'subTopics', label: 'Subtopics', type: 'text' },
    { name: 'logo', label: 'Logo URL', type: 'text' },
  ];

  ngOnInit(): void {
    this.eventRequestForm = this.fb.group({
      title: ['', Validators.required],
      acronym: ['', Validators.required],
      eventType: ['', Validators.required],
      startsAt: ['', Validators.required],
      endsAt: ['', Validators.required],
      theme: ['', Validators.required],
      location: ['', Validators.required],
      topics: ['', Validators.required],
      subTopics: ['', Validators.required],
      logo: ['', Validators.required],
      description: ['', Validators.required]
    });
  }
  submitEvent(): void {
    if (this.eventRequestForm.valid) {
      this.eventService.submitEventRequest(this.eventRequestForm.value).subscribe({
        next: res => {
          alert('Your request has been submitted!');
          this.router.navigate(['/events']);
        },
        error: err => {
          console.error('Submission failed:', err);
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.eventService.uploadLogo(formData).subscribe({
        next: (res) => {
          this.eventRequestForm.patchValue({ logo: res.path });
          console.log('Logo uploaded:', res.path);
        },
        error: (err) => {
          console.error('Logo upload failed', err);
        }
      });
    }
  }

}
