import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-side-divider',
  templateUrl: './side-divider.component.html',
  styleUrls: ['./side-divider.component.scss'],
})
export class SideDividerComponent {
  @Input() isExpanded: boolean | null = false;
  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private commentService: CommentService,
  ) {
    iconRegistry.addSvgIcon(
      'angle-left',
      sanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/caret-left-solid.svg',
      ),
    );
    iconRegistry.addSvgIcon(
      'angle-right',
      sanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/caret-right-solid.svg',
      ),
    );
  }
  toggleExpanded(event: MouseEvent): void {
    event.stopPropagation();
    this.commentService.toggleCommentSectionOpenStatus();
    this.isExpanded = !this.isExpanded;
  }
}
