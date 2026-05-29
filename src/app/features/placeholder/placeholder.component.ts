import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/**
 * Shown for routes whose page is not yet implemented in this session.
 * Provides a clear "coming soon" instead of a blank screen, and reminds
 * which BFF endpoint will back the page when built.
 */
@Component({
  selector: 'app-placeholder',
  imports: [MatIconModule],
  template: `
    <div class="page">
      <div class="placeholder-card">
        <mat-icon>construction</mat-icon>
        <h1>{{ title }}</h1>
        <p>This page is planned but not yet implemented.</p>
        @if (endpoint) {
          <p class="text-small text-muted">
            Backend endpoint: <code>{{ endpoint }}</code>
          </p>
        }
      </div>
    </div>
  `,
  styles: [`
    .placeholder-card {
      background: #fff; padding: 48px 24px; border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      text-align: center; max-width: 480px; margin: 32px auto;
    }
    .placeholder-card mat-icon {
      font-size: 56px; width: 56px; height: 56px;
      color: #94a3b8; margin-bottom: 8px;
    }
    .placeholder-card h1 { margin: 0 0 6px; font-weight: 500; }
    .placeholder-card p { color: #6b7280; margin: 6px 0; }
    code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; }
  `]
})
export class PlaceholderComponent {
  @Input() title = 'Coming soon';
  @Input() endpoint?: string;
}
