import { MatDialog } from '@angular/material/dialog';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { HeaderComponent } from './pages/layout/header/header.component';
import { FooterComponent } from './pages/layout/footer/footer.component';
import { SidebarComponent } from './pages/layout/sidebar/sidebar.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';

import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CompanyComponent } from './pages/company/company.component';
import { PromotersComponent } from './pages/promoters/promoters.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { ShowPromotersComponent } from './pages/promoters/show-promoters/show-promoters.component';
import { AllPromotersComponent } from './pages/promoters/all-promoters/all-promoters.component';
import { AlloteShareComponent } from './pages/promoters/allote-share/allote-share.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import { CreateNewUserComponent } from './pages/company/create-new-user/create-new-user.component';
import { UserRoleComponent } from './pages/company/user-role/user-role.component';
import {MatSelectModule} from '@angular/material/select';
import { AccountingComponent } from './pages/accounting/accounting.component';
import { LedgerComponent } from './pages/accounting/ledger/ledger.component';
import {MatRadioModule} from '@angular/material/radio';
import { StoreComponent } from './pages/store/store.component';
import { ProductComponent } from './pages/store/product/product.component';
import { CategoryComponent } from './pages/store/category/category.component';
import { OrderComponent } from './pages/accounting/order/order.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {AsyncPipe} from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import { DilogComponent } from './util/dilog/dilog.component';
import {MatTableModule} from '@angular/material/table';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ViewOrdersComponent } from './pages/dashboard/view-orders/view-orders.component';
import { LedgersComponent } from './pages/accounting/ledgers/ledgers.component';
import {MatTabsModule} from '@angular/material/tabs';
import { ShowCategoriesComponent } from './pages/store/show-categories/show-categories.component';
import { AllProductsComponent } from './pages/store/all-products/all-products.component';
import {MatIconModule} from '@angular/material/icon';
import { OrdersComponent } from './pages/accounting/orders/orders.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { OrderDetailComponent } from './pages/accounting/orders/order-detail/order-detail.component';
import { SaleOrderComponent } from './pages/accounting/sale-order/sale-order.component';
import { JournalEntriesComponent } from './pages/journal-entries/journal-entries.component';
import { ViewComponent } from './pages/journal-entries/view/view.component';
import { ExpenseComponent } from './pages/journal-entries/expense/expense.component';
import { RevenueComponent } from './pages/journal-entries/revenue/revenue.component';
import { AssetComponent } from './pages/journal-entries/asset/asset.component';
import { NewBankComponent } from './pages/company/new-bank/new-bank.component';
import { BanksComponent } from './pages/company/banks/banks.component';
import { EditBankComponent } from './pages/company/edit-bank/edit-bank.component';
import { EmployesComponent } from './pages/employes/employes.component';
import { NewEmployeeComponent } from './pages/employes/new-employee/new-employee.component';
import { AllEmployeesComponent } from './pages/employes/all-employees/all-employees.component';
import { SalarySettingsComponent } from './pages/employes/new-employee/salary-settings/salary-settings.component';
import { EmpProfileComponent } from './pages/employes/new-employee/emp-profile/emp-profile.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { SalaryDisbursementComponent } from './pages/employes/salary-disbursement/salary-disbursement.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { EditSalarySettingsComponent } from './pages/employes/new-employee/edit-salary-settings/edit-salary-settings.component';
import { DisbursementHistoryComponent } from './pages/employes/disbursement-history/disbursement-history.component';
import { DisbursementHistoryDetailComponent } from './pages/employes/disbursement-history/disbursement-history-detail/disbursement-history-detail.component';
import { AdvenceSalaryComponent } from './pages/employes/advence-salary/advence-salary.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CompanyUsersComponent } from './pages/company/company-users/company-users.component';
import { AsignRolesComponent } from './pages/company/asign-roles/asign-roles.component';
import { PromoterAddShareComponent } from './pages/company/company-users/promoter-add-share/promoter-add-share.component';
import {MatMenuModule} from '@angular/material/menu';
import { KhatabookComponent } from './pages/khatabook/khatabook.component';
import { KhatabookAccountsComponent } from './pages/khatabook/khatabook-accounts/khatabook-accounts.component';
import { NewKhataComponent } from './pages/khatabook/new-khata/new-khata.component';
import { ViewKhataComponent } from './pages/khatabook/view-khata/view-khata.component';
import { EditKhataComponent } from './pages/khatabook/edit-khata/edit-khata.component';
import { LenderComponent } from './pages/accounting/order/lender/lender.component';
import { KhatabookTransactionsComponent } from './pages/khatabook/khatabook-transactions/khatabook-transactions.component';
import { UppercaseDirective } from './uppercase.directive';

import {MatSidenavModule} from '@angular/material/sidenav';
import { LedgerDetailComponent } from './pages/accounting/ledgers/ledger-detail/ledger-detail.component';
import { KhataProfileComponent } from './pages/khatabook/khata-profile/khata-profile.component';
import { AddPaymentComponent } from './pages/khatabook/khata-profile/add-payment/add-payment.component';
import { KhataOrdersComponent } from './pages/khatabook/khata-orders/khata-orders.component';
import { StockRegisterComponent } from './pages/dashboard/stock-register/stock-register.component';
import { StockSummeryComponent } from './pages/dashboard/stock-summery/stock-summery.component';
import { ExpenseCategoryComponent } from './pages/journal-entries/expense-category/expense-category.component';
import { ExpenseNewComponent } from './pages/journal-entries/expense/expense-new/expense-new.component';
import { NewExpenseCatagoryComponent } from './pages/journal-entries/expense/expense-new/new-expense-catagory/new-expense-catagory.component';
import { CapitalizeSpacesPipe } from './capitalize-spaces.pipe';
import { TrialBalanceComponent } from './pages/dashboard/trial-balance/trial-balance.component';
import { DaybookComponent } from './pages/dashboard/daybook/daybook.component';
import { IncomeStatementComponent } from './pages/dashboard/income-statement/income-statement.component';
import { SaleServicesComponent } from './pages/sale-services/sale-services.component';
import { EditPOrderComponent } from './pages/accounting/order/edit-p-order/edit-p-order.component';
import { EditSOrderComponent } from './pages/accounting/order/edit-s-order/edit-s-order.component';
import { OrderGridComponent } from './pages/accounting/orders/order-grid/order-grid.component';
import { FixedAssetsComponent } from './pages/dashboard/fixed-assets/fixed-assets.component';
import { TrialBalanceNewComponent } from './pages/dashboard/trial-balance-new/trial-balance-new.component';

@NgModule({

  declarations: [

    AppComponent,
    LoginComponent,
    LayoutComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    NotfoundComponent,
    CompanyComponent,
    PromotersComponent,
    ShowPromotersComponent,
    AllPromotersComponent,
    AlloteShareComponent,
    CreateNewUserComponent,
    UserRoleComponent,
    AccountingComponent,
    LedgerComponent,
    StoreComponent,
    ProductComponent,
    CategoryComponent,
    OrderComponent,
    DilogComponent,
    ViewOrdersComponent,
    LedgersComponent,
    ShowCategoriesComponent,
    AllProductsComponent,
    OrdersComponent,
    OrderDetailComponent,
    SaleOrderComponent,
    JournalEntriesComponent,
    ViewComponent,
    ExpenseComponent,
    RevenueComponent,
    AssetComponent,
    NewBankComponent,
    BanksComponent,
    EditBankComponent,
    EmployesComponent,
    NewEmployeeComponent,
    AllEmployeesComponent,
    SalarySettingsComponent,
    EmpProfileComponent,
    SalaryDisbursementComponent,
    EditSalarySettingsComponent,
    DisbursementHistoryComponent,
    DisbursementHistoryDetailComponent,
    AdvenceSalaryComponent,
    CompanyUsersComponent,
    AsignRolesComponent,
    PromoterAddShareComponent,
    KhatabookComponent,
    KhatabookAccountsComponent,
    NewKhataComponent,
    ViewKhataComponent,
    EditKhataComponent,
    LenderComponent,
    KhatabookTransactionsComponent,
    UppercaseDirective,
    LedgerDetailComponent,
    KhataProfileComponent,
    AddPaymentComponent,
    KhataOrdersComponent,
    StockRegisterComponent,
    StockSummeryComponent,
    ExpenseCategoryComponent,
    ExpenseNewComponent,
    NewExpenseCatagoryComponent,
    CapitalizeSpacesPipe,
    TrialBalanceComponent,
    DaybookComponent,
    IncomeStatementComponent,
    SaleServicesComponent,
    EditPOrderComponent,
    EditSOrderComponent,
    OrderGridComponent,
    FixedAssetsComponent,
    TrialBalanceNewComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatButtonModule,
    // NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    NgxSpinnerModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSelectModule,
    MatRadioModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatDialogModule,
    MatTableModule,
    SweetAlert2Module,
    MatTabsModule,
    MatIconModule,
    NgxPaginationModule,
    MatExpansionModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    NgxMatSelectSearchModule,
    MatMenuModule,
    MatSidenavModule



    ],
  providers: [
    HttpClient,
    // NgxSpinnerModule,
    LayoutComponent,
    provideAnimationsAsync(),
    provideNativeDateAdapter()
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule { }
