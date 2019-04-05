const promptDirectory = require('inquirer-directory');
const path = require('path');
const finder = require('find-package-json');
const pluralize = require('pluralize');
const packageJson = finder(process.cwd()).next().value;

module.exports = function (plop) {
    const customPath = (packageJson.ngStateCli && packageJson.ngStateCli.basePath) || '';
    const componentPrefix = (packageJson.ngStateCli && packageJson.ngStateCli.componentPrefix) || 'app';
    const style = (packageJson.ngStateCli && packageJson.ngStateCli.style) || 'css';
    const folderName = (packageJson.ngStateCli && packageJson.ngStateCli.actionFolderName) || 'actions';

    const userConfig = path.resolve(process.cwd(), customPath);
    const basePath = userConfig || process.cwd();

    plop.setPrompt('directory', promptDirectory);

    const chooseDirAction = {
        type: 'directory',
        name: 'directory',
        message: 'Choose a directory',
        basePath: basePath
    };

    const statePathAction = {
        type: 'input',
        name: 'statePath',
        message: 'Enter state path',
        default: ''
    };

    const addOrEdit = {
        type: 'list',
        name: 'addOrAppend',
        message: 'Do you want to add new component or append to existing one',
        default: 'add',
        choices: [
            { name: 'Add', value: 'add' },
            { name: 'Append', value: 'append' },
          ],
    };

    plop.setGenerator('ngstate add', {
        description: 'Create new stack',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of component?'
            }
        ].concat(chooseDirAction, statePathAction, addOrEdit),
        actions: function (data) {
            return data.addOrAppend === 'add'
                ? getAddActions(data)
                : getAppendActions(data);
        }
    });

    function getAppendActions(data) {
        const actions = {
            type: 'add',
            skipIfExists: true,
            path: buildPath('{{ \'dashCase\' name}}.actions.ts', data.directory, folderName),
            templateFile: `./templates/actions.tpl`
        };

        const addConstructor = {
            type: 'modify',
            skipIfExists: true,
            path: buildPath('{{ \'dashCase\' name}}.component.ts', data.directory),
            pattern: /(export class.*Component)(.*)(?={)({)/gi,
            template: `$1 extends HasStateActions<TodosStateActions> $2$3 \r\n    constructor(cd: ChangeDetectorRef) { super(cd); }`
        };

        const addDecorator = {
            type: 'modify',
            skipIfExists: true,
            path: buildPath('{{ \'dashCase\' name}}.component.ts', data.directory),
            pattern: /@Component/gi,
            template: '@ComponentState({{\'pascalCase\' name}}StateActions)\n@Component'
        };

        const addActionImports = {
            type: 'modify',
            skipIfExists: true,
            path: buildPath('{{ \'dashCase\' name}}.component.ts', data.directory),
            pattern: /@ComponentState/gi,
            template: 'import { {{\'pascalCase\' name}}StateActions } from \'./' + folderName + '/' + data.name + '.actions\';\r\n@ComponentState'
        };

        const addImports = {
            type: 'modify',
            skipIfExists: true,
            path: buildPath('{{ \'dashCase\' name}}.component.ts', data.directory),
            pattern: /@ComponentState/gi,
            template: 'import { ComponentState, HasStateActions } from \'ng-state\';\r\n\r\n@ComponentState'
        };

        const removeEmptyConstructor = {
            type: 'modify',
            skipIfExists: true,
            path: buildPath('{{ \'dashCase\' name}}.component.ts', data.directory),
            pattern: /constructor\(\) { }/gi,
            template: ''
        };

        const addSpecImports = {
            type: 'modify',
            skipIfExists: true,
            path: buildPath('{{ \'dashCase\' name}}.component.spec.ts', data.directory),
            pattern: /'@angular\/core\/testing';/gi,
            template: '\'@angular/core/testing\';\r\nimport { NgStateTestBed } from \'ng-state\';\r\n'
        };

        const addSpecActionsImports = {
            type: 'modify',
            skipIfExists: true,
            path: buildPath('{{ \'dashCase\' name}}.component.spec.ts', data.directory),
            pattern: /'@angular\/core\/testing';/gi,
            template: '\'@angular/core/testing\';\r\nimport { {{\'pascalCase\' name}}StateActions } from \'./' + folderName + '/' + data.name + '.actions\';\r\n'
        };

        const addSpecBeforeAll = {
            type: 'modify',
            skipIfExists: true,
            path: buildPath('{{ \'dashCase\' name}}.component.spec.ts', data.directory),
            pattern: /beforeEach/i,
            template: 'beforeAll(() => { NgStateTestBed.setTestEnvironment(); });\r\n\r\nbeforeEach'
        };

        const addSpecActionsAll = {
            type: 'modify',
            skipIfExists: true,
            path: buildPath('{{ \'dashCase\' name}}.component.spec.ts', data.directory),
            pattern: /component = fixture.componentInstance;/i,
            template: `component = fixture.componentInstance;
    const actions = NgStateTestBed.createActions<{{'pascalCase' name}}StateActions>({{'pascalCase' name}}StateActions);
    NgStateTestBed.setActionsToComponent(actions, component);
            `
        };

        return [actions, removeEmptyConstructor, addConstructor, addDecorator, addActionImports, addImports, addSpecImports, addSpecBeforeAll, addSpecActionsAll, addSpecActionsImports];
    }

    function getAddActions(data) {
        const actions = {
            type: 'add',
            skipIfExists: true,
            path: buildPath('{{ \'dashCase\' name}}.actions.ts', data.directory, folderName),
            templateFile: `./templates/actions.tpl`
        };

        const styleFile = {
            type: 'add',
            skipIfExists: true,
            path: buildPath('{{ \'dashCase\' name}}.component.' + style, data.directory),
            templateFile: `./templates/empty.tpl`
        };

        const htmlFile = {
            type: 'add',
            skipIfExists: true,
            path: buildPath('{{ \'dashCase\' name}}.component.html', data.directory),
            templateFile: `./templates/empty.tpl`
        };

        const specFile = {
            type: 'add',
            skipIfExists: true,
            path: buildPath('{{ \'dashCase\' name}}.component.spec.ts', data.directory),
            templateFile: `./templates/spec.tpl`,
            data: {
                folderName: folderName
            }
        };

        const component = {
            type: 'add',
            skipIfExists: true,
            path: buildPath('{{ \'dashCase\' name}}.component.ts', data.directory),
            templateFile: `./templates/component.tpl`,
            data: {
                prefix: componentPrefix,
                folderName: folderName,
                style: style
            }
        };

        return [actions, component, styleFile, htmlFile, specFile];
    }

    plop.setHelper('singular', function (value) {
        return pluralize.singular(value);
    });

    function buildPath(name, chosenDir, folderName) {
        const basePath = customPath ? userConfig : process.cwd();
        folderName = folderName ? `${folderName}/` : '';

        return `${basePath}/${chosenDir}/${folderName}/${name}`;
    }
}