import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ColorPickerModule } from "ngx-color-picker";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ArticleContentItemComponent } from "./components/article-content-item/article-content-item.component";
import { ArticleItemComponent } from "./components/article-item/article-item.component";
import { HighlightableComponent } from "./components/highlightable/highlightable.component";
import { LawsRoutingModule } from "./laws-routing.module";
import { LawDetailComponent } from "./law-detail/law-detail.component";
import { LawListComponent } from "./law-list/law-list.component";
import { ColorPickerButtonComponent } from "./components/color-picker-button/color-picker-button.component";
import { CommentListComponent } from "./components/comment-list/comment-list.component";
import { CommentCardComponent } from "./components/comment-card/comment-card.component";
import { CommentMenuComponent } from "./components/comment-menu/comment-menu.component";
import { AddCommentDialogComponent } from "./components/add-comment-dialog/add-comment-dialog.component";
import { ArticleAutocompleteComponent } from "./components/article-autocomplete/article-autocomplete.component";
import { DeleteDialogComponent } from "./components/delete-dialog/delete-dialog.component";
import { SideDividerComponent } from "../components/side-divider/side-divider.component";
import { AngularMaterialModule } from "../angular-material/angular-material.module";
import { MatMenuModule } from "@angular/material/menu";
import { ProfileModule } from "../pages/profile/profile.module";
import { AddLawComponent } from "../components/add-law/add-law.component";
import { ArticleDifComponent } from "../components/article-dif/article-dif.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatBadgeModule } from "@angular/material/badge";
import { MatPaginatorModule } from "@angular/material/paginator";

const components = [
  AddLawComponent,
  ArticleItemComponent,
  LawDetailComponent,
  LawListComponent,
  HighlightableComponent,
  ArticleContentItemComponent,
  ColorPickerButtonComponent,
  CommentListComponent,
  CommentCardComponent,
  CommentMenuComponent,
  AddCommentDialogComponent,
  ArticleAutocompleteComponent,
  DeleteDialogComponent,
  SideDividerComponent,
  AddLawComponent,
  ArticleDifComponent,

];
@NgModule({
  declarations: components,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ColorPickerModule,
    CommonModule,
    LawsRoutingModule,
    AngularMaterialModule,
    ProfileModule,

  ],
  providers: [],
  exports: components,
})
export class LawsModule {}
