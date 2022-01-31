import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Comment } from '../models/comment.interface';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  commentBaseUrl = `/api/comment`;
  public isCommentSectionOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );

  currentHighlight$: BehaviorSubject<string | undefined> = new BehaviorSubject<
    string | undefined
  >(undefined);
  highlightComments$: BehaviorSubject<
    Comment[] | undefined
  > = new BehaviorSubject<Comment[] | undefined>(undefined);
  constructor(private apiService: ApiService) {}

  toggleCommentSectionOpenStatus(): void {
    this.isCommentSectionOpen$.next(!this.isCommentSectionOpen$.value);
  }

  async setHighlight(id: string): Promise<void> {
    this.currentHighlight$.next(id);
    const comments = await this.getCommentsFromHighlight(id);
    this.highlightComments$.next(comments);
  }

  async getCommentsFromHighlight(id: string): Promise<Comment[]> {
    const comments = await this.apiService
      .get<Comment[]>(`${this.commentBaseUrl}/findAByHighLight/${id}`)
      .toPromise();
    return comments;
  }

  async create(comment: Comment): Promise<void> {
    try {
      const result = await this.apiService
        .post<{ id: string }>(this.commentBaseUrl, {
          ...comment,
          highlight: {
            id: this.currentHighlight$.value,
          },
        })
        .toPromise();
      const currentComments = this.highlightComments$.value || [];
      // console.log('currentComments', currentComments);
      comment.id = result.id;
      currentComments.push(comment);
      const newComments = currentComments.map((c) => ({ ...c }));
      // console.log('newComments', newComments);
      this.highlightComments$.next(newComments);
    } catch (error) {
      console.log('Error creando comentario', error);
    }
  }
  async edit(comment: Comment): Promise<void> {
    const id = comment.id;
    if (!id) {
      throw new Error(`Se intentó editar un comentario sin ID`);
    } else {
      try {
        const url = this.commentBaseUrl;
        await this.apiService
          .put<string>(url, {
            ...comment,
            highlight: {
              id: this.currentHighlight$.value,
            },
          })
          .toPromise();
        const arrayComment = [...(this.highlightComments$.value || [])];
        arrayComment.map((comm) => {
          if (comm.id === id) {
            comm.content = comment.content;
          }
        });
        this.highlightComments$.next(arrayComment);
      } catch (error) {
        throw new Error(`Error ${error}`);
      }
    }
  }

  async destroy(id: string): Promise<void> {
    try {
      const url = `${this.commentBaseUrl}/${id}`;
      await this.apiService.delete<string>(url).toPromise();
      this.highlightComments$.next(
        this.highlightComments$.value?.filter((comment) => comment.id !== id),
      );
    } catch (error) {
      throw new Error(`Error ${error}`);
    }
  }
}
