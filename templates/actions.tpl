import { HasStore, InjectStore } from 'ng-state';
import { Map } from 'immutable';

@InjectStore({{{ statePath }}})
export class {{pascalCase name}}StateActions extends HasStore<Map<any, any>> {
}