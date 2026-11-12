import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dropdown-item',
  templateUrl: './dropdown-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule],
  host: {
    'class': 'block w-full',
    'style': 'display: block !important;'
  }
})
export class DropdownItemComponent {
  readonly to = input<string | undefined>(undefined);
  readonly baseClassName = input<string>('');
  readonly className = input<string>('');
  readonly tag = input<'a' | 'button'>('button');
  readonly itemClick = output<void>();

  private readonly router = inject(Router);

  readonly combinedClasses = computed(() => `${this.baseClassName()} ${this.className()}`.trim());

  handleClick() {
    const toUrl = this.to();
    if (toUrl) {
      this.router.navigateByUrl(toUrl);
    }
    this.itemClick.emit();
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.handleClick();
      event.preventDefault();
    }
  }
}