import { Component } from '@angular/core';

import { InitService } from 'src/app/services/init.service';

import { LawsService } from '../laws.service';
import { AddLawComponent } from "../../components/add-law/add-law.component";
import { MatDialog } from "@angular/material/dialog";
import { AlertService } from "../../services/alert.service";
import { ApiService } from "../../services/api.service";

@Component({
  selector: 'app-law-list',
  templateUrl: './law-list.component.html',
  styleUrls: ['./law-list.component.scss'],
})
export class LawListComponent {
  constructor(
    public lawsService: LawsService,
    public initService: InitService,
    public dialog: MatDialog,
    private alertService: AlertService,
    private apiService: ApiService,
  ) {}

  async addReviewToLaw(lawId: string, lawName: string, lawDate: string): Promise<void> {
    const dialogRef = this.dialog.open(AddLawComponent, {
      data: { isRevision: true, lawName, lawId, lawDate }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        const { file, lawName, lawDate } = dialogRef.componentInstance.addForm.value;

        const formData = new FormData();
        formData.append('file', file)
        formData.append('lawId', lawId);
        formData.append('isRevision', 'true');
        const url = `/api/database/create-law-from-pdf/${lawName}/${lawDate.toISOString().substr(0,10)}`;
        const result: any = await this.apiService.post(url, formData).toPromise();
        if (result.id) {
          this.alertService.alert('La revision se ha agregado correctamente');
          this.lawsService.init()
        } else {
          this.alertService.alert('La revision no se pudo crear');
        }
      }
    });
  }

  async addLaw(){
    const dialogRef = this.dialog.open(AddLawComponent, {
      data: { isRevision: false }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        const { file, lawName, lawDate } = dialogRef.componentInstance.addForm.value;

        const formData = new FormData();
        formData.append('file', file)
        const url = `/api/database/create-law-from-pdf/${lawName}/${lawDate.toISOString().substr(0,10)}`;
        const result: any = await this.apiService.post(url, formData).toPromise();
        if (result.id) {
          this.alertService.alert('La ley se ha creado correctamente');
          this.lawsService.init()
        } else {
          this.alertService.alert('La ley no se pudo crear');
        }
      }
    });
  }
}
