import { AddCommentDialogComponent } from '../add-comment-dialog/add-comment-dialog.component';
import { Component, OnInit } from '@angular/core';
import { CommentService } from '../../../services/comment.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
})
export class CommentListComponent implements OnInit {
  constructor(
    public commentService: CommentService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {}

  handleClickAdd(): void {
    const dialogRef = this.dialog.open(AddCommentDialogComponent, {
      width: '85%',
      data: {
        title: 'Nuevo comentario',
        subtitle: 'Inserte comentario',
      },
    });
    dialogRef.afterClosed().subscribe(async (res) => {
      if (res.save) {
        await this.commentService.create(res);
      }
    });
  }
}
