import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Paper } from '../../../interfaces/paper.interface';
import { PaperService } from '../../../services/paper.service';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paper-details',
  imports: [CommonModule],
  templateUrl: './paper-details.component.html',
  styleUrl: './paper-details.component.css'
})
export class PaperDetailsComponent implements OnInit {

  paper!: Paper;
  imageUrl!: string;
  headAuthor!: string;
  keywords: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private paperService: PaperService
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('eventId')!;
    const paperId = this.route.snapshot.paramMap.get('paperId')!;
    this.paperService.getPaperById(eventId, paperId).subscribe({
      next: (data: Paper) => {
        this.paper = data;
        this.imageUrl = environment.issuer + this.paper.path;
        this.headAuthor = this.paper.contributorsNames.find(name => name.toLowerCase().includes('headauthor')) ?? '';
        this.headAuthor = this.headAuthor.substring(0, this.headAuthor.indexOf(':'));
        this.paper.contributorsNames = this.paper.contributorsNames.filter(name => !name.toLowerCase().includes('headauthor'));
        this.keywords = this.paper.keywords.split(',').map(k => k.trim());
      },
      error: (err: any) => {
        console.error('Error fetching paper:', err);
      }
    });
  }

  downloadImage() {
    const link = document.createElement('a');
    link.href = this.imageUrl;
    link.download = this.paper.title + (this.imageUrl.endsWith('.jpg') ? '.jpg' : '.jpg'); 
    document.body.appendChild(link); 
    link.click();
    document.body.removeChild(link);
  }
}