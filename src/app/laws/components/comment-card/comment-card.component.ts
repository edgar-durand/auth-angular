import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommentService } from 'src/app/services/comment.service';
import { Comment } from '../../../models/comment.interface';
import { AddCommentDialogComponent } from '../add-comment-dialog/add-comment-dialog.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss'],
})
export class CommentCardComponent implements OnInit {
  @Input() comment!: Comment;
  isListInSync = true;
  constructor(
    public commentService: CommentService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {}

  onDelete(id: string): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        title: '¿Desea eliminar el comentario?',
      },
    });
    dialogRef.afterClosed().subscribe(async (res) => {
      if (res?.save) {
        await this.commentService.destroy(id);
      }
    });
  }

  onEditing(id: string): void {
    const comment = this.commentService.highlightComments$.value?.find(
      (comment) => comment.id === id,
    );
    const dialogRef = this.dialog.open(AddCommentDialogComponent, {
      width: '85%',
      data: {
        id,
        title: 'Editando comentario',
        subtitle: 'Edite comentario',
        commentContent: comment?.content,
      },
    });
    dialogRef.afterClosed().subscribe(async (res) => {
      if (res?.save) {
        await this.commentService.edit({
          id,
          ...res,
        });
      }
    });
  }

  handleOnSelectArticle(articleId: string): void {
    if (!this.comment.relatedArticles) {
      this.comment.relatedArticles = [];
    }
    this.comment.relatedArticles.push(articleId);
  }

  removeRelatedArticle(articleId: string): void {
    const index = this.comment.relatedArticles.findIndex(
      (article) => article === articleId,
    );
    this.comment.relatedArticles.splice(index, 1);
  }

  onUpdateArticles(): void {
    this.isListInSync = false;
  }

  async onSyncArticles(articles: string[]): Promise<void> {
    this.comment.relatedArticles = articles;
    await this.commentService.edit(this.comment);
    this.isListInSync = true;
  }
}
