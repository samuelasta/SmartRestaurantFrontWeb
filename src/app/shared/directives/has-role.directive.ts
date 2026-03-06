import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { StorageService } from '@core/services/storage.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    const userRole = this.storageService.getUserRole();
    
    if (this.appHasRole.includes(userRole)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
