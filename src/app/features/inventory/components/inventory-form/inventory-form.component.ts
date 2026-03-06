import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-inventory-form',
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.scss']
})
export class InventoryFormComponent implements OnInit {
  inventoryForm!: FormGroup;
  categories: Category[] = [];
  loading = false;
  isEditMode = false;
  itemId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private inventoryService: InventoryService,
    private categoryService: CategoryService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.itemId = Number(id);
      this.loadItem(this.itemId);
    }
  }

  initForm(): void {
    this.inventoryForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      sku: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      minStock: [0, [Validators.required, Validators.min(0)]],
      maxStock: [0, [Validators.required, Validators.min(0)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      supplier: ['', [Validators.required]],
      location: ['', [Validators.required]]
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      }
    });
  }

  loadItem(id: number): void {
    this.inventoryService.getById(id).subscribe({
      next: (item) => {
        this.inventoryForm.patchValue({
          ...item,
          categoryId: item.category.id
        });
      }
    });
  }

  onSubmit(): void {
    if (this.inventoryForm.valid) {
      this.loading = true;
      const formData = this.inventoryForm.value;

      const request = this.isEditMode && this.itemId
        ? this.inventoryService.update(this.itemId, formData)
        : this.inventoryService.create(formData);

      request.subscribe({
        next: () => {
          this.notificationService.showSuccess(
            this.isEditMode ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente'
          );
          this.router.navigate(['/inventory/list']);
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/inventory/list']);
  }
}
