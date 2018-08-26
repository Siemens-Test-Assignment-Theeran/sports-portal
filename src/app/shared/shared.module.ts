import { AppDataService } from '../services/app-data.service';
import { AuthGuard } from './guard/auth.guard';
import { AuthGuardService } from './guard/auth-guard.service';
import { CommonModule } from '@angular/common';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { CustomTreeComponent } from './components/custom-tree/custom-tree.component';
import { FileUpload } from './guard/fileupload';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    CustomTreeComponent,
    ContextMenuComponent
  ],
  declarations: [CustomTreeComponent, ContextMenuComponent],
  providers: [AuthGuard, AuthGuardService, AppDataService]
})
export class SharedModule { }
