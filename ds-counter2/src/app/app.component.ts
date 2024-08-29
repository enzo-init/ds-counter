import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { invoke } from "@tauri-apps/api/tauri";
import { register } from '@tauri-apps/api/globalShortcut';
import { BaseDirectory, readTextFile, writeTextFile } from '@tauri-apps/api/fs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  greetingMessage = "";
  counter: number = 320;
  style: string = 'elden-ring';
  constructor(private cdr: ChangeDetectorRef, private renderer: Renderer2, private el: ElementRef) {}
  greet(event: SubmitEvent, name: string): void {
    event.preventDefault();
    invoke<string>("greet", { name }).then((text) => {
      this.greetingMessage = text;
    });
  }
  async ngOnInit(): Promise<void> {
    await register('CommandOrControl+D', () => {
      console.log('Shortcut triggered');
      this.addCount();
    });  
    await register('CommandOrControl+F', () => {
      console.log('Shortcut triggered');
      this.susCount();
    });
    await this.readTextFile();
  }
  addCount() {
    this.counter+=1
    this.cdr.detectChanges();
  }
  susCount() {
    this.counter-=1
    this.cdr.detectChanges();
  }
 async readTextFile() {
  try {
    const file = await readTextFile('ds-count.txt', {dir: BaseDirectory.Desktop})
    this.counter = Number(file);
  } catch (error) {
    console.log(error);
  }
 }
 changeCounterStyle(style: string) {
  this.style = style;
 }
async saveDeaths() {
   await writeTextFile({ path: 'ds-count.txt', contents: `${this.counter}` }, {dir: BaseDirectory.Desktop});
 }
}
