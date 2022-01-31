import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-comment-menu',
  templateUrl: './comment-menu.component.html',
  styleUrls: ['./comment-menu.component.scss'],
})
export class CommentMenuComponent implements OnInit {
  @Input() commentId = '';
  @Output() handleDelete = new EventEmitter<string>();
  @Output() handleEditing = new EventEmitter<string>();
  constructor() {}

  ngOnInit(): void {}
}
