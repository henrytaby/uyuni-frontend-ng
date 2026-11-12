import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  OnDestroy,
  output,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dropdown.component.html'
})
export class DropdownComponent implements AfterViewInit, OnDestroy {
  readonly isOpen = input<boolean>(false);
  readonly className = input<string>('');
  readonly closeDropdown = output<void>();

  @ViewChild('dropdownRef') dropdownRef!: ElementRef<HTMLDivElement>;

  private handleClickOutside = (event: MouseEvent) => {
    if (
      this.isOpen() &&
      this.dropdownRef &&
      this.dropdownRef.nativeElement &&
      !this.dropdownRef.nativeElement.contains(event.target as Node) &&
      !(event.target as HTMLElement).closest('.dropdown-toggle')
    ) {
      this.closeDropdown.emit();
    }
  };

  ngAfterViewInit() {
    if (typeof document !== 'undefined') {
      document.addEventListener('mousedown', this.handleClickOutside);
    }
  }

  ngOnDestroy() {
    if (typeof document !== 'undefined') {
      document.removeEventListener('mousedown', this.handleClickOutside);
    }
  }
}