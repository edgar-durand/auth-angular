import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ArticleContent } from "../../laws/models/article-content.interface";

// import * as Diff from 'diff';

@Component({
  selector: 'app-article-dif',
  templateUrl: './article-dif.component.html',
  styleUrls: ['./article-dif.component.scss']
})
export class ArticleDifComponent implements OnInit {

  versionResult = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      currentVersion: ArticleContent;
      previousVersion: ArticleContent;
      isNewRevision: boolean;
    }
  ) {
    this.versionResult = data.currentVersion.textOk;
  }

  saveCurrentVersion(): void {
    console.log(this.versionResult)
  }

  ngOnInit(): void {

  }

}
