import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { PermissionService } from '@core/services/permission.service';
import { Subject, takeUntil } from 'rxjs';

/**
 * Directiva estructural para mostrar/ocultar elementos basándose en permisos
 * 
 * Uso:
 * <button *hasPermission="'dish:write'">Crear Plato</button>
 * <div *hasPermission="['dish:read', 'drink:read']">...</div>
 * <button *hasPermission="'dish:write'; requireAll: true">Editar</button>
 */
@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private permissions: string[] = [];
  private requireAll = false;
  private destroy$ = new Subject<void>();
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionService
  ) {}

  @Input()
  set hasPermission(permissions: string | string[]) {
    this.permissions = Array.isArray(permissions) ? permissions : [permissions];
    this.updateView();
  }

  @Input()
  set hasPermissionRequireAll(requireAll: boolean) {
    this.requireAll = requireAll;
    this.updateView();
  }

  ngOnInit(): void {
    this.updateView();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateView(): void {
    const hasPermission = this.checkPermissions();

    if (hasPermission && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasPermission && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  private checkPermissions(): boolean {
    if (this.permissions.length === 0) {
      return true;
    }

    if (this.requireAll) {
      return this.permissionService.hasAllPermissions(this.permissions);
    } else {
      return this.permissionService.hasAnyPermission(this.permissions);
    }
  }
}
