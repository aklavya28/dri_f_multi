import { ExpenseNewComponent } from './pages/journal-entries/expense/expense-new/expense-new.component';
import { DisbursementHistoryDetailComponent } from './pages/employes/disbursement-history/disbursement-history-detail/disbursement-history-detail.component';
import { JournalEntriesComponent } from './pages/journal-entries/journal-entries.component';
import { OrderDetailComponent } from './pages/accounting/orders/order-detail/order-detail.component';
import { ViewOrdersComponent } from './pages/dashboard/view-orders/view-orders.component';
import { authGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { CompanyComponent } from './pages/company/company.component';
import { PromotersComponent } from './pages/promoters/promoters.component';

import { ShowPromotersComponent } from './pages/promoters/show-promoters/show-promoters.component';

import { AllPromotersComponent } from './pages/promoters/all-promoters/all-promoters.component';
import { AlloteShareComponent } from './pages/promoters/allote-share/allote-share.component';
import { CreateNewUserComponent } from './pages/company/create-new-user/create-new-user.component';
import { UserRoleComponent } from './pages/company/user-role/user-role.component';
import { AccountingComponent } from './pages/accounting/accounting.component';
import { LedgerComponent } from './pages/accounting/ledger/ledger.component';
import { StoreComponent } from './pages/store/store.component';
import { ProductComponent } from './pages/store/product/product.component';
import { CategoryComponent } from './pages/store/category/category.component';
import { OrderComponent } from './pages/accounting/order/order.component';
import { LedgersComponent } from './pages/accounting/ledgers/ledgers.component';
import { ShowCategoriesComponent } from './pages/store/show-categories/show-categories.component';
import { AllProductsComponent } from './pages/store/all-products/all-products.component';
import { OrdersComponent } from './pages/accounting/orders/orders.component';
import { SaleOrderComponent } from './pages/accounting/sale-order/sale-order.component';
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
import { EmpProfileComponent } from './pages/employes/new-employee/emp-profile/emp-profile.component';
import { SalarySettingsComponent } from './pages/employes/new-employee/salary-settings/salary-settings.component';
import { SalaryDisbursementComponent } from './pages/employes/salary-disbursement/salary-disbursement.component';
import { EditSalarySettingsComponent } from './pages/employes/new-employee/edit-salary-settings/edit-salary-settings.component';
import { DisbursementHistoryComponent } from './pages/employes/disbursement-history/disbursement-history.component';
import { AdvenceSalaryComponent } from './pages/employes/advence-salary/advence-salary.component';
import { CompanyUsersComponent } from './pages/company/company-users/company-users.component';
import { AsignRolesComponent } from './pages/company/asign-roles/asign-roles.component';
import { PromoterAddShareComponent } from './pages/company/company-users/promoter-add-share/promoter-add-share.component';
import { KhatabookComponent } from './pages/khatabook/khatabook.component';
import { KhatabookAccountsComponent } from './pages/khatabook/khatabook-accounts/khatabook-accounts.component';
import { NewKhataComponent } from './pages/khatabook/new-khata/new-khata.component';
import { ViewKhataComponent } from './pages/khatabook/view-khata/view-khata.component';
import { EditKhataComponent } from './pages/khatabook/edit-khata/edit-khata.component';
import { LenderComponent } from './pages/accounting/order/lender/lender.component';
import { KhatabookTransactionsComponent } from './pages/khatabook/khatabook-transactions/khatabook-transactions.component';
import { LedgerDetailComponent } from './pages/accounting/ledgers/ledger-detail/ledger-detail.component';
import { KhataProfileComponent } from './pages/khatabook/khata-profile/khata-profile.component';
import { AddPaymentComponent } from './pages/khatabook/khata-profile/add-payment/add-payment.component';
import { KhataOrdersComponent } from './pages/khatabook/khata-orders/khata-orders.component';
import { StockRegisterComponent } from './pages/dashboard/stock-register/stock-register.component';
import { StockSummeryComponent } from './pages/dashboard/stock-summery/stock-summery.component';
import { NewExpenseCatagoryComponent } from './pages/journal-entries/expense/expense-new/new-expense-catagory/new-expense-catagory.component';
import { TrialBalanceComponent } from './pages/dashboard/trial-balance/trial-balance.component';
import { DaybookComponent } from './pages/dashboard/daybook/daybook.component';
import { IncomeStatementComponent } from './pages/dashboard/income-statement/income-statement.component';
import { SaleServicesComponent } from './pages/sale-services/sale-services.component';
import { EditPOrderComponent } from './pages/accounting/order/edit-p-order/edit-p-order.component';
import { EditSOrderComponent } from './pages/accounting/order/edit-s-order/edit-s-order.component';
import { FixedAssetsComponent } from './pages/dashboard/fixed-assets/fixed-assets.component';
import { loginGuard } from './guards/login.guard';
import { TrialBalanceNewComponent } from './pages/dashboard/trial-balance-new/trial-balance-new.component';




const routes: Routes = [
  // {
  //   path:'login',

  //   loadChildren: () => import('./pages/login/login.component').then(m => m.LoginComponent),
  //   pathMatch: 'full'
  // }
  {
    path: '',
    redirectTo: 'dashboard/stock-summery/1',
    pathMatch: 'full'
  },
  {
    path:'login',
    component: LoginComponent,
    canActivate: [loginGuard]
  },
  {

    path:'',
    component: LayoutComponent,
    children: [
        {
            path:'dashboard',
            component: DashboardComponent,
            canActivate: [authGuard],
            children:[
              {
                path:'view-order',
                component: ViewOrdersComponent
              },{
                path:'stock-register/:page',
                component: StockRegisterComponent
              },{
                path:'stock-summery/:page',
                component: StockSummeryComponent
              },
              {
                path:'fixed-assets/:page',
                component: FixedAssetsComponent
              },
              {
                path:'trial-balance',
                component: TrialBalanceComponent
              },
              {
                path:'trial-balance-new',
                component: TrialBalanceNewComponent
              },
              {
                path:'daybook',
                component: DaybookComponent
              },
              {
                path:'income-statement',
                component: IncomeStatementComponent
              },


            ]
        },
        {
            path:'company',
            component: CompanyComponent,
            canActivate: [authGuard],
            children:[
              {
                path: 'users',
                component:CompanyUsersComponent
              },
              {
                path: 'users/:slug/:name',
                component: AsignRolesComponent
              },
              {
                path: 'user/promoter-share/:slug/:name',
                component: PromoterAddShareComponent
              },
              {
                path:'create-new-user',
                component: CreateNewUserComponent
              },
              {
                path: 'user-role',
                component: UserRoleComponent
              },
              {
                path: 'banks',
                component: BanksComponent
              },{
                path: 'new-bank',
                component: NewBankComponent
              },{
                path: 'edit-bank/:slug',
                component: EditBankComponent
              },
              {
                path: 'promoters',
                component: AllPromotersComponent
               },

            ]
        },
        {
            path:'promoters',
            component: PromotersComponent,
            canActivate: [authGuard],
            children:[
              {
               path: 'all',
               component: AllPromotersComponent
              },
              {
                path:'all/:slug',
                component: ShowPromotersComponent
              },
              {
                path:'show',
                component: ShowPromotersComponent
             },
             {
              path: 'allocate-share',
              component:AlloteShareComponent

             }

          ]

        },
        {
          path:"employees",
          component:EmployesComponent,
          canActivate: [authGuard],
          children:[
            {
              path:"all-employees",
              component: AllEmployeesComponent
            },{
              path:"Advance-salary",
              component: AdvenceSalaryComponent
            },
            {
              path:"salary-disbursement",
              component: SalaryDisbursementComponent
            }
            ,{
              path:"disbursement-history",
              component: DisbursementHistoryComponent
            },
            {
              path:"disbursement-history/:slug/:date",
              component: DisbursementHistoryDetailComponent
            },
            {
              path:"emp-profile/:slug",
              component: EmpProfileComponent
            },{
              path:"salary-setting/:slug/:name",
              component: SalarySettingsComponent
            },{
              path:"edit-salary-setting/:slug/:name",
              component: EditSalarySettingsComponent
            },
            {
              path:"new-employee",
              component: NewEmployeeComponent
            }
          ]
        },
        {
          path:'entries',
            component: JournalEntriesComponent,
            canActivate: [authGuard],
            children:[
              {
                path: "view/:page",
                component: ViewComponent
              },
              {
                path: "expense/:page",
                component: ExpenseComponent
              },
              {
                path: "expense-new",
                component: ExpenseNewComponent
              },
              {
                path: "expense-new/category",
                component: NewExpenseCatagoryComponent
              },
              {
                path: "accounting-entries/:page",
                component: RevenueComponent
              },

              {
                path: "asset",
                component: AssetComponent
              }
            ]
        },

        {
          path:'khatabook',
            component: KhatabookComponent,
            canActivate: [authGuard],
            children:[
              {
                path:"khatabook-accounts/:page",
                component: KhatabookAccountsComponent
              },
              {
                path: "new-khata",
                component: NewKhataComponent
              },
              {
                path: "view-khata/:slug",
                component: ViewKhataComponent
              },
              {
                path: "view-trans/:slug/:name/:page",
                component: KhatabookTransactionsComponent
              },
              {
                path: "khata-orders/:slug/:name/:page",
                component: KhataOrdersComponent
              },
              {
                path: "edit-khata/:slug",
                component: EditKhataComponent
              },
              {
                path: 'new-lender',
                component: LenderComponent
              },
              {
                path: "khata-profile/:slug/:name/:page",
                component: KhataProfileComponent
              },
              {
                path: "add-payment/:slug/:name",
                component: AddPaymentComponent
              },


            ]
        },
        {
          path:'accounting',
            component: AccountingComponent,
            canActivate: [authGuard],
            children:[
              {
                path: "ledgers",
                component: LedgersComponent
              },
              {
                path: "ledgers/:slug/:page",
                component: LedgerDetailComponent
              },
              {
                path: 'new-ledger',
                component: LedgerComponent
              },
              {
                path: 'orders/:page',
                component: OrdersComponent
              },

              {
                path:'orders/:page/:slug',
                component: OrderDetailComponent
              },
              {
                path: 'new-order',
                component: OrderComponent
              },
              {
                path: 'edit-order/:slug',
                component: EditPOrderComponent
              },

              {
                path: 'sale-order',
                component: SaleOrderComponent
              },
              {
                path: 'edit-sale-order/:slug',
                component: EditSOrderComponent
              },

            ]
        },
        {
          path:'store',
          component: StoreComponent,
          canActivate: [authGuard],
          children: [
            {
              path: 'show-categories',
              component: ShowCategoriesComponent
            },
            {
              path: 'all-products',
              component: AllProductsComponent
            }
            ,{
              path: 'new-product',
              component: ProductComponent
            },
            {
              path: 'new-category',
              component: CategoryComponent
            },
            {
              path: 'sale-services',
              component: SaleServicesComponent
            },

          ]
        },

        {

          path:'**',
          component:NotfoundComponent

        }
      ],

},

{

    path:'**', component:NotfoundComponent

}

];

@NgModule({
  imports: [RouterModule.forRoot(routes) ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
