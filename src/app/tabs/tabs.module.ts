import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TabsPage } from './tabs.page';
import { TabPageRoutingModule } from './tabs-routing.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TabPageRoutingModule],
  declarations: [TabsPage],
})
export class TabsPageModule {}
