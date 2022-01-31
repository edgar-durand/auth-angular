import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ILaw } from "../../interfaces/law.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-add-law',
  templateUrl: './add-law.component.html',
  styleUrls: ['./add-law.component.scss']
})
export class AddLawComponent implements OnInit {
  addForm: FormGroup;
  startDate = new Date(
    +this.data?.lawDate?.substr(0,4),
    +this.data?.lawDate?.substr(6,2),
    +this.data?.lawDate?.substr(8,2)
  );

  myFilter = (d: Date | null): boolean => {
    const day = Date.parse((d || new Date()).toISOString().substr(0,10));

    return this.data?.lawDate
      ? day >= Date.parse(this.data?.lawDate)
        && Date.parse((new Date()).toISOString().substr(0,10)) >= day
      : Date.parse((new Date()).toISOString().substr(0,10)) >= day;
  };


  constructor(
    public formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ILaw,
  ) {
    this.addForm = this.formBuilder.group({
      lawName: [data?.lawName, Validators.required],
      lawDate: ['', Validators.required],
      file: ['', Validators.required],
      isRevision: [this.data?.isRevision],
      lawId: [data?.lawId]
    });
  }

  addFile(event: any): void {
    this.addForm.controls['file'].patchValue(event.target?.files[0])
  }

  ngOnInit(): void {
  }

}
