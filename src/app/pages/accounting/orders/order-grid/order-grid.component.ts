import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-order-grid',
  templateUrl: './order-grid.component.html',
  styleUrl: './order-grid.component.scss'
})
export class OrderGridComponent {
  @Input() data: any[] = []; // Input for table data
  @Input() currentPage: number = 1; // Current page for pagination
  @Input() itemsPerPage: number = 10; // Items per page
  @Input() totalItems: number = 0; // Total number of items
  @Input() pages: number = 0; // Total number of items
  @Output() pageChange = new EventEmitter<number>(); // Output event for pagination
  @Output() editOrder = new EventEmitter<{ slug: string, type: string }>(); // Emit edit action
  @Output() approveOrder = new EventEmitter<number>(); // Emit approve action

  // Utility method to convert string to number if needed
  convertToNumber(value: any): number {
    return parseFloat(value) || 0;
  }
}
