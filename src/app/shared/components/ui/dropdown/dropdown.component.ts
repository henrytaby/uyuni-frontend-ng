import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy,Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dropdown.component.html',
  imports:[CommonModule]
})
export class DropdownComponent implements AfterViewInit, OnDestroy {
  @Input() isOpen = false;
  @Output() closeDropdown = new EventEmitter<void>();
  @Input() className = '';

  @ViewChild('dropdownRef') dropdownRef!: ElementRef<HTMLDivElement>;

  private handleClickOutside = (event: MouseEvent) => {
    if (
      this.isOpen &&
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