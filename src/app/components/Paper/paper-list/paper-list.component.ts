import { Component, Input, OnInit } from '@angular/core';
import { Paper } from '../../../interfaces/paper.interface';
import { PaperService } from '../../../services/paper.service';
import { environment } from '../../../environments/environment';
import { PaginationComponent } from "../../pagination/pagination.component";
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-paper-list',
  imports: [PaginationComponent, CommonModule],
  templateUrl: './paper-list.component.html',
  styleUrl: './paper-list.component.css'
})
export class PaperListComponent implements OnInit {
  @Input() eventId: string = "f3350fae-0c83-4632-bfae-7622b0cbcdf3";

  papers: Paper[] = [];
  pagedPapers: Paper[][] = [];
  currentPage: number = 0;
  cardsPerPage: number = 6;

  constructor(private paperService: PaperService) {}

  ngOnInit(): void {
    if (this.eventId) {
      this.fetchPapers();
    }
  }

  fetchPapers(): void {
    this.paperService.getPapersByEventId(this.eventId).subscribe({
      next: (data : Paper[]) => {
        console.log('Fetched papers:', data);

        this.papers = data.map(paper => {
          if (paper.path && !paper.path.startsWith('http')) {
            paper.path = `${environment.issuer}${paper.path}`;
           // paper.status = "Accepted";
          }
          return paper;
        });

        this.pagedPapers = this.chunkPapers(this.papers, this.cardsPerPage);
      },
      error: (err) => {
        console.error('Error fetching papers:', err);
      }
    });
  }

  chunkPapers(papers: Paper[], size: number): Paper[][] {
    const chunks: Paper[][] = [];
    for (let i = 0; i < papers.length; i += size) {
      chunks.push(papers.slice(i, i + size));
    }
    return chunks;
  }

  nextPage(): void {
    if (this.currentPage < this.pagedPapers.length - 1) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  getHeadAuthor(contributors: string[]): string {
    return contributors.find(c => c.toLowerCase().includes('headauthor')) ?? 'Unknown';
  }
}
