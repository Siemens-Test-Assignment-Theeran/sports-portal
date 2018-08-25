import { AuthGuard } from './guard/auth.guard';
import { AuthGuardService } from './guard/auth-guard.service';
import { CommonModule } from '@angular/common';
import { CustomTreeComponent } from './components/custom-tree/custom-tree.component';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    CustomTreeComponent
  ],
  declarations: [CustomTreeComponent],
  providers: [AuthGuard, AuthGuardService]
})
export class SharedModule { }
