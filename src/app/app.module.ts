import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeftContainerComponent } from './left-container/left-container.component';
import { RightContainerComponent } from './right-container/right-container.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { WebSocketService } from './Services/websocket.service';
import { SearchService } from './Services/search.service';

@NgModule({
  declarations: [
    AppComponent,
    LeftContainerComponent,
    RightContainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
