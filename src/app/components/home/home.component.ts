import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import {NgForOf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {JwtDecoderService} from '../../services/jwt-decoder.service';
import {AuthService} from '../../services/auth.service';

interface Slide { icon: string; title: string; desc: string; }
interface Stat  { value: string; label: string; }
interface Step  { date: string; title: string; desc: string; }

@Component({
  selector: 'app-home',
  imports: [
    NgForOf,
    RouterLink
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {

  isAuthor : boolean = false;
  isChairman : boolean = false;
  isAttendee : boolean = true;
  isBoardDirector: boolean = false;

  constructor(private router: Router, private jwtDecoder: JwtDecoderService, private authService : AuthService) {
    if (!this.jwtDecoder.extractRoles()) {
      localStorage.removeItem("jwt")
      localStorage.removeItem("roles")
      this.router.navigate(['/']);
      return;
    }

    const roles = localStorage.getItem('roles');
    if (roles) {
      this.isAuthor = roles.includes('Author');
      this.isChairman = roles.includes('Chairman');
      this.isBoardDirector = roles.includes('BoardDirector');
    }
  }
  slides: Slide[] = [
    { icon: '/ai.jpg',   title: 'IA & Vision',      desc: 'Deep-learning, Security, Detections.' },
    { icon: '/iot.jpg',  title: 'IoT & Edge',       desc: 'Edge-computing & Connected Objects.' },
    { icon: '/CLOUD.png',title: 'Cloud Native',     desc: 'Kubernetes, micro-services, DevOps.' },
    { icon: '/green.jpg',title: 'Green Tech',       desc: 'Tech durables & eco-friendly Conceptions.' },
    { icon: '/xr.jpg',   title: 'XR & Metaverse',   desc: 'AR/VR & Fluid User experience.' }
  ];
  currentSlide = 0;
  private timer$!: Subscription;
  stats: Stat[] = [
    { value: '120+', label: 'Intervenants' },
    { value: '3',    label: 'Keynotes internationales' },
    { value: '30',   label: 'Workshops' },
    { value: '1500+',label: 'Participants' }
  ];
  ngOnInit(): void { this.resume(); }
  ngOnDestroy(): void { this.pause(); }

  next(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }
  go(i: number): void { this.currentSlide = i; }
  pause(): void { this.timer$?.unsubscribe(); }
  resume(): void {
    this.timer$ = interval(4000).subscribe(() => this.next());
  }

  logout() {
    this.authService.logout(this.router);
  }

  protected readonly localStorage = localStorage;
}
