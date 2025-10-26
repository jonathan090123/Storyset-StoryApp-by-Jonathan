import RegisterView from './register-view';
import RegisterPresenter from './register-presenter';

export default class RegisterPage {
    constructor() {
        this.view = new RegisterView();
        this.presenter = new RegisterPresenter(this.view);
    }

    async render() {
        return this.view.render();
    }

    async afterRender() {
        const form = document.getElementById('register-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            this.presenter.handleRegister(name, email, password);
        });
    }
}