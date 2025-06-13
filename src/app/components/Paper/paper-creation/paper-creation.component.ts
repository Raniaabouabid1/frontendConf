import { Component } from '@angular/core';
import { FormsModule,FormGroup, ReactiveFormsModule,FormBuilder, Validators } from '@angular/forms';
import {Router, RouterLink, ActivatedRoute} from '@angular/router';
import {NgForOf} from '@angular/common';
import {CommonModule} from '@angular/common';
import { Author, Author2 } from '../../../interfaces/author.interface';
import { PaperService } from '../../../services/paper.service';
import { AuthorService } from '../../../services/author.service';
import { ErrorDivComponent } from '../../error-div/error-div.component';

@Component({
  selector: 'app-paper-creation',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgForOf,
    RouterLink, ErrorDivComponent],
  templateUrl: './paper-creation.component.html',
  styleUrl: './paper-creation.component.css'
})
export class PaperCreationComponent {

  paperForm: FormGroup;
  availableAuthors: Author[] = [];
  showAddAuthor = false;
  newAuthors: Author2[] = [];
  newAuthor = { fullName: '', email: '', expertise: '' };
  eventId: string = "";

  constructor(
    private fb: FormBuilder,
    private paperService: PaperService,
    private authorService: AuthorService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.paperForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      abstract: ['', [Validators.required, Validators.maxLength(4096)]],
      publicationDate: ['', Validators.required],
      paperFile: [null, Validators.required],
      keywords: ['', [Validators.required, Validators.maxLength(255)]],
      contributors: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('eventId')!;
    console.log(this.eventId);
    this.loadAuthors();
  }

  loadAuthors(): void {
    this.authorService.getAvailableAuthors().subscribe({
      next: (authors : Author[]) => this.availableAuthors = authors,
      error: (err : any) => console.error('Error loading authors:', err)
    });
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.paperForm.get('paperFile')?.setValue(file);
    }
  }

  toggleAddAuthor(): void {
    this.showAddAuthor = !this.showAddAuthor;
    if (!this.showAddAuthor) {
      this.newAuthor = { fullName: '', email: '', expertise: '' };
    }
  }

  settingAuthor(): Author2 {
    const names = this.newAuthor.fullName.trim().split(' ');
    const firstName = names[0];
    const lastName = names.slice(1).join(' ') || '-';

    return {
      FirstName: firstName,
      LastName: lastName,
      Email: this.newAuthor.email,
      Expertise: this.newAuthor.expertise
    };
  }

  addNewAuthor(): void {
    const authorToAdd = this.settingAuthor();
    this.authorService.createAuthors([authorToAdd]).subscribe({
      next: (createdAuthors: Author[]) => {
        this.availableAuthors.push(...createdAuthors);
        this.paperForm.patchValue({
          contributors: [...this.paperForm.get('contributors')?.value || [], createdAuthors[0].id]
        });

        this.newAuthor = { fullName: '', email: '', expertise: '' };
        this.showAddAuthor = false;
        this.router.navigate([`/event/${this.eventId}/paper-list`]);
      },
      error: (err : any) => {
        console.error('Error creating author:', err);
      }
    });
  }




  onSubmit(): void {
    if (this.paperForm.invalid) return;

    const formData = new FormData();
    formData.append('Title', this.paperForm.get('title')?.value);
    formData.append('Abstract', this.paperForm.get('abstract')?.value);
    formData.append('PublicationDate', this.paperForm.get('publicationDate')?.value);
    formData.append('PaperFile', this.paperForm.get('paperFile')?.value);
    formData.append('Keywords', this.paperForm.get('keywords')?.value);

    const contributorIds = this.paperForm.get('contributors')?.value || [];
    contributorIds.forEach((authorId: string, index: number) => {
      formData.append(`Contributors[${index}].AuthorId`, authorId);
    });

    this.paperService.createPaper(this.eventId, formData).subscribe({
      next: () => this.router.navigate([`/event/${this.eventId}/paper-list`]),
      error: (err : any) => console.error('Error creating paper:', err)
    });
  }


}
