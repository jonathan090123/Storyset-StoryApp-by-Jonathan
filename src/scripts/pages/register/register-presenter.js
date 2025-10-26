import {
    registerUser
} from '../../data/api';
import {
    validateEmail,
    validatePassword,
    validateRequired
} from '../../utils/validation';
import {
    showLoading,
    hideLoading,
    showToast
} from '../../utils';

export default class RegisterPresenter {
    constructor(view) {
        this.view = view;
    }

    async handleRegister(name, email, password) {
        this.view.clearErrors();

        // Validation
        let hasError = false;

        if (!validateRequired(name)) {
            this.view.showNameError('Nama harus diisi');
            hasError = true;
        }

        if (!validateEmail(email)) {
            this.view.showEmailError('Email tidak valid');
            hasError = true;
        }

        if (!validatePassword(password)) {
            this.view.showPasswordError('Password minimal 8 karakter');
            hasError = true;
        }

        if (hasError) return;

        showLoading();
        try {
            const response = await registerUser({
                name,
                email,
                password
            });

            if (!response.error) {
                showToast('Registrasi berhasil! Silakan login.', 'success');
                setTimeout(() => {
                    window.location.hash = '#/login';
                }, 1000);
            } else {
                showToast(response.message || 'Registrasi gagal. Email mungkin sudah digunakan.', 'error');
            }
        } catch (error) {
            showToast('Terjadi kesalahan. Silakan coba lagi.', 'error');
            console.error(error);
        } finally {
            hideLoading();
        }
    }
}