import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgStateTestBed } from 'ng-state';

import { {{pascalCase name}}Component } from './{{name}}.component';
import { {{pascalCase name}}StateActions } from './{{folderName}}/{{name}}.actions';

describe('{{pascalCase name}}Component', () => {
    let component: {{pascalCase name}}Component;
    let fixture: ComponentFixture<{{pascalCase name}}Component>;

    beforeAll(() => {
        NgStateTestBed.setTestEnvironment();
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [{{pascalCase name}}Component]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent({{pascalCase name}}Component);
        component = fixture.componentInstance;
        const actions = NgStateTestBed.createActions<{{pascalCase name}}StateActions>({{pascalCase name}}StateActions);
        NgStateTestBed.setActionsToComponent(actions, component);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
