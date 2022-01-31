import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogAddData {
  id?: string;
  title: string;
  subtitle: string;
  commentContent: string | undefined;
}

@Component({
  selector: 'app-add-comment-dialog',
  templateUrl: './add-comment-dialog.component.html',
  styleUrls: ['./add-comment-dialog.component.scss'],
})
export class AddCommentDialogComponent {
  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddCommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogAddData,
  ) {
    this.form = this.formBuilder.group({
      content: ['', Validators.required],
    });

    if (this.data.id) {
      this.form.patchValue({
        content: this.data.commentContent,
      });
    }
  }

  getControl(control: string): AbstractControl | null {
    return this.form.get(control);
  }

  handleCloseModal(): void {
    this.dialogRef.close();
  }

  handleOk(): void {
    const res = {
      save: true,
      ...this.form.value,
    };
    this.dialogRef.close(res);
  }
}
