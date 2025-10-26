import {
    loginUser
} from '../../data/api';
import {
    saveToken
} from '../../utils/auth-helper';
import {
    validateEmail,
    validatePassword
} from '../../utils/validation';
import {
    showLoading,
    hideLoading,
    showToast
} from '../../utils';

export default class LoginPresenter {
    constructor(view) {
        this.view = view;
    }

    async handleLogin(email, password) {
        this.view.clearErrors();

        // Validation
        if (!validateEmail(email)) {
            this.view.showEmailError('Email tidak valid');
            return;
        }

        if (!validatePassword(password)) {
            this.view.showPasswordError('Password minimal 8 karakter');
            return;
        }

        showLoading();
        try {
            const response = await loginUser({
                email,
                password
            });

            if (!response.error) {
                saveToken(response.loginResult.token);
                showToast('Login berhasil!', 'success');
                setTimeout(() => {
                    window.location.hash = '#/';
                }, 500);
            } else {
                showToast(response.message || 'Login gagal. Periksa email dan password Anda.', 'error');
            }
        } catch (error) {
            showToast('Terjadi kesalahan. Silakan coba lagi.', 'error');
            console.error(error);
        } finally {
            hideLoading();
        }
    }
}