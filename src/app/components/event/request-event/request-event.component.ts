import { Component } from '@angular/core';
import {
  FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl, ReactiveFormsModule, FormArray, FormsModule
} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { EventService } from '../../../services/event.service';
import { JwtDecoderService } from '../../../services/jwt-decoder.service';
import {NgForOf, NgIf, SlicePipe} from '@angular/common';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { ChairmanSuggestion } from '../../../interfaces/chairman-suggestion.interface';
import { of, EMPTY } from 'rxjs';

@Component({
  selector  : 'app-request-event',
  standalone: true,
  templateUrl: './request-event.component.html',
  styleUrl  : './request-event.component.css',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    FormsModule,
    NgForOf,
    NgIf
  ]
})
export class RequestEventComponent {

  isAuthor = false;
  isChairman = false;
  isAttendee = true;
  isBoardDirector = false;

  step = 1;
  progress = 0;
  logoPreview = '';

  eventRequestForm!: FormGroup;
  selectedFile: File | null = null;
  searchTerm = '';
  private search$ = new Subject<string>();
  suggestions: ChairmanSuggestion[] = [];


  constructor(
    private eventService: EventService,
    private router: Router,
    private jwtDecoder: JwtDecoderService,
    private fb: FormBuilder) {

    if (!this.jwtDecoder.extractRoles()) {
      this.router.navigate(['/']);
      return;
    }
    const roles = localStorage.getItem('roles');
    if (roles) {
      this.isAuthor       = roles.includes('Author');
      this.isChairman     = roles.includes('Chairman');
      this.isBoardDirector= roles.includes('BoardDirector');
    }
  }

  ngOnInit(): void {
    this.eventRequestForm = this.fb.group({
      committeeMembers: this.fb.array([]),        // <- nouveau
      /* step 1 */
      title     : ['', Validators.required],
      acronym   : ['', [Validators.required, Validators.maxLength(10)]],
      eventType : ['', Validators.required],
      startsAt  : ['', Validators.required],
      endsAt    : ['', Validators.required],
      theme     : ['', Validators.required],
      location  : ['', Validators.required],
      topics    : ['', Validators.required],
      subTopics : ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(255)]],

      logo: ['', Validators.required],

      submissionRules: this.fb.group({
        font             : ['', Validators.required],
        minPages         : [1,  [Validators.required, Validators.min(1)]],
        maxPages         : [1,  [Validators.required, Validators.min(1)]],
        formats          : ['', Validators.required],
        margins          : [0,  [Validators.required, Validators.min(0)]],
        lineSpacing      : [1,  [Validators.required, Validators.min(1)]],
        additionalRules  : ['', Validators.required],
        fileNameFormat   : ['', Validators.required],
        submissionDeadline: ['', Validators.required]
      }, { validators: this.pageRangeValidator })
    }, { validators: this.dateOrderValidator });

    this.updateProgress();
    this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term =>
          term.length < 2
            ? of([] as ChairmanSuggestion[])
            : this.eventService.getChairmen(term)
        )
      )
      .subscribe(res => {
        console.log('suggestions:', res);
        this.suggestions = res;
      });
  }

  nextStep(): void {

    const step1Keys = ['title','acronym','eventType','startsAt','endsAt',
      'theme','location','topics','subTopics','description'];

    const step1Valid = step1Keys.every(k => this.eventRequestForm.get(k)?.valid);
    const step2Valid = this.eventRequestForm.get('logo')?.valid;

    if ((this.step === 1 && !step1Valid) ||
      (this.step === 2 && !step2Valid)) {
      return;
    }

    this.step++;
    this.updateProgress();
  }

  previousStep(): void {
    if (this.step > 1) this.step--;
    this.updateProgress();
  }

  private updateProgress(): void {
    this.progress = (this.step - 1) * 50;
  }

  private dateOrderValidator(group: AbstractControl): ValidationErrors | null {
    const s = new Date(group.get('startsAt')?.value);
    const e = new Date(group.get('endsAt')?.value);
    return s && e && e >= s ? null : { dateOrder: true };
  }

  private pageRangeValidator(group: AbstractControl): ValidationErrors | null {
    const min = group.get('minPages')?.value;
    const max = group.get('maxPages')?.value;
    return min <= max ? null : { pageRange: true };
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (file.size > 1_000_000) {
      alert('Logo must be ≤ 1 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => this.logoPreview = e.target?.result as string;
    reader.readAsDataURL(file);

    const data = new FormData();
    data.append('file', file);
    this.eventService.uploadLogo(data).subscribe({
      next : res => this.eventRequestForm.patchValue({ logo: res.path }),
      error: err => console.error('Logo upload failed', err)
    });
  }

  submitEvent(): void {
    if (this.eventRequestForm.invalid) return;

    /* ➜ vérifie ce qui sera envoyé */
    console.log('%cPayload:', 'color:green;font-weight:bold',
      JSON.stringify(this.eventRequestForm.value, null, 2));

    this.eventService.submitEventRequest(this.eventRequestForm.value)
      .subscribe({
        next : () => {
          alert('Your request has been submitted!');
          this.router.navigate(['/events']);
        },
        error: err => console.error('Submission failed:', err)
      });
  }


  basicFields = [
    { name: 'title',      label: 'Title',       type: 'text'  },
    { name: 'acronym',    label: 'Acronym',     type: 'text'  },
    { name: 'eventType',  label: 'Event Type',  type: 'text'  },
    { name: 'startsAt',   label: 'Start Date',  type: 'date'  },
    { name: 'endsAt',     label: 'End Date',    type: 'date'  },
    { name: 'theme',      label: 'Theme',       type: 'text'  },
    { name: 'location',   label: 'Location',    type: 'text'  },
    { name: 'topics',     label: 'Topics',      type: 'text'  },
    { name: 'subTopics',  label: 'Sub-topics',  type: 'text'  }
  ];

  searchChairmen(term: string) {
    this.search$.next(term.trim());
    console.log('typed:', term);
  }

  get committeeMembers() {
    return this.eventRequestForm.get('committeeMembers') as FormArray;
  }

  addChairman(ch: ChairmanSuggestion) {
    if (this.committeeMembers.controls.some(c => c.value.chairmanId === ch.id)) return;

    this.committeeMembers.push(
      this.fb.group({
        chairmanId: [ch.id, Validators.required],
        role:      ['Evaluator'],
        name:      [ch.name],
        email:     [ch.email]
      })
    );
    this.suggestions = [];
    this.searchTerm  = '';
  }

  removeChairman(i: number) {
    this.committeeMembers.removeAt(i);
  }


}
