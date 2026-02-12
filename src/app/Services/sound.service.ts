import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  Success() {
    this.playSound('/sounds/congratulations.mp3');
  }

  Failed() {
    this.playSound('/sounds/loose.mp3');
  }

  Incorrect() {
    this.playSound('/sounds/error.mp3');
  }

  LetsGo() {
    this.playSound('/sounds/lets-go.mp3');
  }


  playSound(url: string) {
    const audio = new Audio(url);
    audio.play();
  }

}
