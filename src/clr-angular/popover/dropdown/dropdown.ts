/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, Optional, SkipSelf } from '@angular/core';
import { Subscription } from 'rxjs';

import { IfOpenService } from '../../utils/conditional/if-open.service';
import { POPOVER_HOST_ANCHOR } from '../common/popover-host-anchor.token';

import { ROOT_DROPDOWN_PROVIDER, RootDropdownService } from './providers/dropdown.service';

@Component({
  selector: 'clr-dropdown',
  template: '<ng-content></ng-content>',
  host: {
    '[class.dropdown]': 'true',
    // the open class, also used in static version, is always present in the Angular version
    // Angular takes care of hiding it, regardless of whether you use *clrIfOpen or not
    '[class.open]': 'true',
  },
  providers: [IfOpenService, ROOT_DROPDOWN_PROVIDER, { provide: POPOVER_HOST_ANCHOR, useExisting: ElementRef }],
})
export class ClrDropdown implements OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(
    @SkipSelf()
    @Optional()
    public parent: ClrDropdown,
    public ifOpenService: IfOpenService,
    private cdr: ChangeDetectorRef,
    dropdownService: RootDropdownService
  ) {
    this.subscriptions.push(dropdownService.changes.subscribe(value => (this.ifOpenService.open = value)));
    this.subscriptions.push(ifOpenService.openChange.subscribe(value => this.cdr.markForCheck()));
  }

  @Input('clrCloseMenuOnItemClick') isMenuClosable: boolean = true;

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
