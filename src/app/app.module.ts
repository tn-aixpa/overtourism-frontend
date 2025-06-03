import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// AGID Design
import { DesignAngularKitModule } from 'design-angular-kit';

// Translate
import { HttpClientModule, HttpClient, HttpBackend } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HomeComponent } from './pages/home/home.component';
import { SimulazioniComponent } from './pages/simulazioni/simulazioni/simulazioni.component';
import { ScenariComponent } from './pages/simulazioni/scenari/scenari.component';
import { PreferitiComponent } from './pages/simulazioni/preferiti/preferiti.component';
import { FaqsComponent } from './pages/faqs/faqs.component';
import { TermsComponent } from './pages/terms/terms.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AppSideBarModule } from './components/app-side-bar/app-side-bar.module';
import { AppHeaderModule } from './components/app-header/app-header.module';
import { AppFooterModule } from './components/app-footer/app-footer.module';
import { ScenarioDetailComponent } from './pages/simulazioni/scenario-detail/scenario-detail.component';
import { PlotComponent } from './components/plot/plot.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { KpiBoxComponent } from './components/plot/kpi-box/kpi-box.component';
import { PlotControlsComponent } from './components/plot/plot-controls/plot-controls.component';
import { AppPlotEditorWidgetComponent } from './components/plot/app-plot-editor-widget/app-plot-editor-widget.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';


// Funzione per caricare i file delle traduzioni
export function multiTranslateLoaderFactory(httpBackend: HttpBackend) {
  return new MultiTranslateHttpLoader(httpBackend, [
    { prefix: './assets/i18n/design-angular-kit/', suffix: '.json' }, // traduzioni design-angular-kit
    { prefix: './assets/i18n/app/', suffix: '.json' }, // traduzioni tue personalizzate
  ]);
}

@NgModule({
  declarations: [AppComponent, HomeComponent, SimulazioniComponent, ScenariComponent, PreferitiComponent, FaqsComponent, TermsComponent, SettingsComponent, ScenarioDetailComponent, PlotComponent, KpiBoxComponent, PlotControlsComponent, AppPlotEditorWidgetComponent, BreadcrumbsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppHeaderModule,
    AppFooterModule,
    AppSideBarModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: multiTranslateLoaderFactory,
        deps: [HttpBackend]
      }
    }),
    DesignAngularKitModule.forRoot({
      translateLoader: (itPrefix: string, itSuffix: string) => ({
        provide: TranslateLoader,
        useFactory: (http: HttpBackend) =>
          new MultiTranslateHttpLoader(http, [
            { prefix: itPrefix, suffix: itSuffix }, 
            { prefix: './assets/i18n/app/', suffix: '.json' }, 
          ]),
        deps: [HttpBackend],
      }),
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
