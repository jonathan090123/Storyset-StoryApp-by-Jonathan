import LoginView from './login-view';
import LoginPresenter from './login-presenter';

export default class LoginPage {
    constructor() {
        this.view = new LoginView();
        this.presenter = new LoginPresenter(this.view);
    }

    async render() {
        return this.view.render();
    }

    async afterRender() {
        const form = document.getElementById('login-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            this.presenter.handleLogin(email, password);
        });
    }
}