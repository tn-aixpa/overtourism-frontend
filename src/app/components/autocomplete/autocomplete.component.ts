import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy
} from '@angular/core';

type FunctionSource = (query: string, populateResults: (results: string[]) => void) => void;

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  standalone: false,
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit, OnDestroy {
  @Input() source: string[] | FunctionSource = [];
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() minLength: number = 0;
  @Input() showAllOnFocus: boolean = true;
  @Input() maxResults: number = 200;

  @Output() selected = new EventEmitter<string>();

  @ViewChild('inputEl', { static: true }) inputEl!: ElementRef<HTMLInputElement>;

  inputValue = '';
  filtered: string[] = [];
  panelOpen = false;
  highlighted = -1;

  private outsideClickHandler = (e: Event) => {
    if (!this.el.nativeElement.contains(e.target)) {
      this.closePanel();
    }
  };

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    document.addEventListener('click', this.outsideClickHandler);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.outsideClickHandler);
  }

  // apertura su focus / click
  onFocus(): void {
    if (this.showAllOnFocus && this.minLength === 0) {
      this.updateResults('');
      if (this.filtered.length) this.openPanel();
    }
  }

  // input change
  onInput(): void {
    const q = this.inputValue ?? '';
    if (q.length < this.minLength) {
      this.closePanel();
      return;
    }
    this.updateResults(q);
    if (this.filtered.length) this.openPanel();
    else this.closePanel();
  }

  // aggiorna risultati da array o da funzione
  updateResults(query: string): void {
    if (typeof this.source === 'function') {
      (this.source as FunctionSource)(query, (results: string[]) => {
        this.filtered = (results || []).slice(0, this.maxResults);
        this.highlighted = this.filtered.length ? 0 : -1;
      });
    } else {
      const q = (query || '').toLowerCase();
      this.filtered = (this.source as string[])
        .filter(s => s.toLowerCase().includes(q))
        .slice(0, this.maxResults);
      this.highlighted = this.filtered.length ? 0 : -1;
    }
  }

  openPanel(): void {
    this.panelOpen = true;
    const panel = this.el.nativeElement.querySelector('.autocomplete-panel');
    if (panel) {
      document.body.appendChild(panel);
      const rect = this.inputEl.nativeElement.getBoundingClientRect();
      panel.style.position = 'absolute';
      panel.style.top = rect.bottom + 'px';
      panel.style.left = rect.left + 'px';
      panel.style.width = rect.width + 'px';
      panel.style.zIndex = '2000';
    }
  }

  closePanel(): void {
    this.panelOpen = false;
    this.highlighted = -1;
  }

  select(item: string): void {
    if (!item) return;
    this.selected.emit(item);
  
    // svuota campo e chiudi
    this.inputValue = '';
    this.filtered = [];
    this.closePanel();
  
  }

  // navigazione tastiera
  onKeyDown(e: KeyboardEvent): void {
    if (!this.panelOpen) {
      if (e.key === 'ArrowDown' && this.filtered.length) {
        this.openPanel();
        e.preventDefault();
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.highlighted = Math.min(this.highlighted + 1, this.filtered.length - 1);
      this.scrollIntoViewIfNeeded();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.highlighted = Math.max(this.highlighted - 1, 0);
      this.scrollIntoViewIfNeeded();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (this.highlighted >= 0) this.select(this.filtered[this.highlighted]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this.closePanel();
    }
  }

  // aiuta a vedere l'elemento evidenziato se la lista è scrollabile
  private scrollIntoViewIfNeeded(): void {
    const el = this.el.nativeElement.querySelectorAll('.ac-item')[this.highlighted] as HTMLElement | undefined;
    if (el) el.scrollIntoView({ block: 'nearest' });
  }

  // API utile per reset manuale
  public clear(): void {
    this.inputValue = '';
    this.filtered = [];
    this.closePanel();
  }
}
