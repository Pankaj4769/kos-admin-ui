import { Component, Input, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

/**
 * Small reusable widget: displays a value (typically a temp password
 * or token) with a one-click copy button + brief "copied!" feedback.
 */
@Component({
  selector: 'app-copyable',
  imports: [MatIcon, MatIconButton, MatTooltip],
  template: `
    <code class="value">{{ value }}</code>
    <button mat-icon-button (click)="copy()"
            [matTooltip]="copied() ? 'Copied!' : 'Copy to clipboard'">
      <mat-icon>{{ copied() ? 'check' : 'content_copy' }}</mat-icon>
    </button>
  `,
  styles: [`
    :host { display: inline-flex; align-items: center; gap: 4px; }
    .value {
      background: #f3f4f6; padding: 6px 10px; border-radius: 6px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 13px;
    }
  `]
})
export class CopyableComponent {
  @Input({ required: true }) value!: string;
  readonly copied = signal(false);

  async copy() {
    try {
      await navigator.clipboard.writeText(this.value);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    } catch {
      // Older browsers without clipboard API — fail silently.
    }
  }
}
