'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const util_1 = require("util");
const WebRequest = require("web-request");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "jint" is now active!');
    //global variables while the extension is active
    //put here your jenkins url
    var URL = 'http://www.mycognitiva.io:8080/';
    var USER;
    var PASS;
    var LAST_VIEW;
    var LAST_JOB;
    var CRUMB;
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    vscode.commands.registerCommand('extension.configJenkinsCredentials', () => __awaiter(this, void 0, void 0, function* () {
        //user and token for jenkins
        USER = yield vscode.window.showInputBox({ placeHolder: 'User' });
        PASS = yield vscode.window.showInputBox({ password: true, placeHolder: 'Password' });
        if (USER === '' || PASS === '') {
            vscode.window.showErrorMessage('Error, user or token null');
            USER = '';
            PASS = '';
            return;
        }
        if (util_1.isUndefined(USER) || util_1.isUndefined(PASS)) {
            vscode.window.showErrorMessage('Error, user or token undefined');
            USER = '';
            PASS = '';
            return;
        }
        else {
            vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: 'Checking...' }, p => {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    if (yield checkUserConnection(USER, PASS, URL)) {
                        //if conect with the credentials all is ok for next connections
                        CRUMB = yield searchCrumb(USER, PASS, URL);
                        console.log('CRUMB object: ' + JSON.stringify(CRUMB));
                        resolve();
                        vscode.window.showInformationMessage('Account configured!');
                    }
                    else {
                        resolve();
                        vscode.window.showErrorMessage('Problems with your account, try set up it again!');
                        USER = '';
                        PASS = '';
                    }
                }));
            });
        }
    }));
    vscode.commands.registerCommand('extension.excecuteJenkinsJob', () => __awaiter(this, void 0, void 0, function* () {
        //excecute a jenkins job
        //check if is a account config
        if (!checkConfigCredentials(USER, PASS)) {
            vscode.window.showWarningMessage('You need set up an account first!');
            return;
        }
        //select the view
        LAST_VIEW = yield vscode.window.showQuickPick(listViews(USER, PASS, URL), { placeHolder: 'Select a view' });
        if (util_1.isUndefined(LAST_VIEW)) {
            vscode.window.showErrorMessage('View is undefined, start again!');
            return;
        }
        //select the job
        LAST_JOB = yield vscode.window.showQuickPick(listJobs(LAST_VIEW, USER, PASS, URL), { placeHolder: 'Select a job for excecute' });
        if (util_1.isUndefined(LAST_JOB)) {
            vscode.window.showErrorMessage('Job is undefine, start again!');
            return;
        }
        //confirm the excecute
        var confirm = yield vscode.window.showInputBox({ placeHolder: "Say 'yes' for excecute " + LAST_VIEW + '->' + LAST_JOB });
        if (confirm === 'yes') {
            vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: 'Building...' }, p => {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    if (yield excecuteJob(LAST_VIEW, LAST_JOB, USER, PASS, URL, CRUMB)) {
                        //esperar a que termine el trabajo ejecutado
                        yield checkFinishLast(USER, PASS, URL, LAST_JOB);
                        //termino de ejecucion
                        vscode.window.showInformationMessage('Job excecuted!');
                        resolve();
                    }
                    else {
                        vscode.window.showErrorMessage('we have a problem excecuting the job :(');
                        resolve();
                    }
                }));
            });
        }
        else {
            vscode.window.showInformationMessage('Canceled!');
        }
    }));
    vscode.commands.registerCommand('extension.excecuteLastJenkinsJob', () => __awaiter(this, void 0, void 0, function* () {
        //check if is a account config
        if (!checkConfigCredentials(USER, PASS)) {
            vscode.window.showWarningMessage('You need set up an account first!');
            return;
        }
        //confirm the excecute
        var confirm = yield vscode.window.showInputBox({ placeHolder: "Say 'yes' for excecute " + LAST_VIEW + '->' + LAST_JOB });
        if (confirm === 'yes') {
            vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: 'Building...' }, p => {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    if (yield excecuteJob(LAST_VIEW, LAST_JOB, USER, PASS, URL, CRUMB)) {
                        //esperar a que termine el trabajo ejecutado
                        yield checkFinishLast(USER, PASS, URL, LAST_JOB);
                        //termino de ejecucion
                        vscode.window.showInformationMessage('Job excecuted!');
                        resolve();
                    }
                    else {
                        vscode.window.showErrorMessage('we have a problem excecuting the job :(');
                        resolve();
                    }
                }));
            });
        }
        else {
            vscode.window.showInformationMessage('Canceled!');
        }
    }));
    vscode.commands.registerCommand('extension.jenkinsHelp', () => __awaiter(this, void 0, void 0, function* () {
        //list of commands avalaible
        vscode.window.showQuickPick(vscode.commands.getCommands(true));
        console.log('commands : ' + typeof (vscode.commands.getCommands(true)));
    }));
    vscode.commands.registerCommand('extension.changeURL', () => __awaiter(this, void 0, void 0, function* () {
        //confirm the excecute
        URL = yield vscode.window.showInputBox({ placeHolder: "Write the jenkins URL like that 'http://jenkins:8080/'" });
        if (util_1.isUndefined(URL)) {
            URL = '';
        }
    }));
    //context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    console.log('jint deactivated, bye!');
}
exports.deactivate = deactivate;
function checkUserConnection(user, pass, url) {
    return __awaiter(this, void 0, void 0, function* () {
        //try to connect with the credentials
        var response = yield WebRequest.get(url, {
            auth: {
                user: user,
                pass: pass
            }
        });
        //response of jenkins
        var statusCode = yield response.statusCode;
        if (statusCode === 200) {
            console.log('status code: 200, correct credentialas!');
            return true;
        }
        else if (statusCode === 401) {
            console.log('status code: 401, bad credentials!');
            return false;
        }
        console.log('Status code: ' + statusCode);
        return false;
    });
}
function listViews(user, pass, url) {
    return __awaiter(this, void 0, void 0, function* () {
        //here we need to go to search for the views
        //try to connect with the credentials
        var list = [];
        var response = yield WebRequest.get(url + 'api/json?pretty=true', {
            auth: {
                user: user,
                pass: pass
            }
        });
        //wait for the response
        // var statusCode = await response.statusCode;
        var json = JSON.parse(yield response.content);
        var views = json.views;
        //add views to the list
        for (let view of views) {
            list.push(view.name);
            console.log('vista : ' + view.name);
        }
        return list;
    });
}
function listJobs(view, user, pass, url) {
    return __awaiter(this, void 0, void 0, function* () {
        //here we need to go to search for the views
        //try to connect with the credentials
        var list = [];
        var response = yield WebRequest.get(url + 'view/' + view + '/api/json?pretty=true', {
            auth: {
                user: user,
                pass: pass
            }
        });
        //wait for the response
        // var statusCode = await response.statusCode;
        var json = JSON.parse(yield response.content);
        var jobs = json.jobs;
        //add jobst to the list
        for (let job of jobs) {
            list.push(job.name);
            console.log('job : ' + job.name);
        }
        return list;
    });
}
function excecuteJob(view, job, user, pass, url, crumb) {
    return __awaiter(this, void 0, void 0, function* () {
        var response = yield WebRequest.post(url + 'job/' + job + '/build', {
            auth: {
                user: user,
                pass: pass
            },
            headers: {
                "Jenkins-Crumb": crumb.crumb
            }
        });
        var statusCode = yield response.statusCode;
        console.log('status code of jenkins excecution: ' + statusCode);
        console.log('body of response: ' + response.content);
        if (statusCode === 200) {
            return true;
        }
        else if (statusCode === 201) {
            return true;
        }
        return false;
    });
}
function checkConfigCredentials(user, pass) {
    if (user === '' || pass === '' || util_1.isUndefined(user) ||
        util_1.isUndefined(pass)) {
        return false;
    }
    return true;
}
function searchCrumb(user, pass, url) {
    return __awaiter(this, void 0, void 0, function* () {
        var response = yield WebRequest.get(url + 'crumbIssuer/api/json', {
            auth: {
                user: user,
                pass: pass
            }
        });
        //return the Crumb json
        return yield JSON.parse(response.content);
    });
}
function checkFinishLast(user, pass, url, job) {
    return __awaiter(this, void 0, void 0, function* () {
        do {
            var response = yield WebRequest.get(url + 'job/' + job + '/lastBuild/api/json', {
                auth: {
                    user: user,
                    pass: pass
                }
            });
            var jsonResponse = JSON.parse(response.content);
            console.log('construyendo: ' + jsonResponse.building);
            if (jsonResponse.building === false) {
                vscode.window.showInformationMessage('Resultado: ' + jsonResponse.result);
                return true;
            }
            yield delay(5000);
        } while (true);
        return false;
    });
}
function delay(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}
//# sourceMappingURL=extension.js.map