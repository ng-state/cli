import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { ComponentState, HasStateActions } from 'ng-state';
import { {{pascalCase name}}StateActions } from './{{folderName}}/{{name}}.actions';

@ComponentState({{pascalCase name}}StateActions)
@Component({
  selector: '{{prefix}}-{{name}}',
  templateUrl: './{{name}}.component.html',
  styleUrls: ['./{{name}}.component.{{style}}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class {{pascalCase name}}Component extends HasStateActions<{{pascalCase name}}StateActions> {
    constructor(cd: ChangeDetectorRef) {
        super(cd);
    }
}