export default class LoginView {
    render() {
        return `
      <section class="container auth-section">
        <div class="auth-card">
          <h1 class="auth-title">Login</h1>
          <p class="auth-subtitle">Masuk untuk berbagi cerita Anda</p>
          
          <form id="login-form" class="auth-form" novalidate>
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                aria-required="true"
                aria-describedby="email-error"
                autocomplete="email"
              />
              <span id="email-error" class="error-text" role="alert"></span>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                required 
                aria-required="true"
                aria-describedby="password-error"
                autocomplete="current-password"
              />
              <span id="password-error" class="error-text" role="alert"></span>
            </div>

            <button type="submit" class="btn btn-primary">Login</button>
          </form>

          <p class="auth-link">
            Belum punya akun Storyset? Yuk! <a href="#/register">Daftar di sini</a>
          </p>
        </div>
      </section>
    `;
    }

    showEmailError(message) {
        document.getElementById('email-error').textContent = message;
        document.getElementById('email').setAttribute('aria-invalid', 'true');
    }

    showPasswordError(message) {
        document.getElementById('password-error').textContent = message;
        document.getElementById('password').setAttribute('aria-invalid', 'true');
    }

    clearErrors() {
        document.getElementById('email-error').textContent = '';
        document.getElementById('password-error').textContent = '';
        document.getElementById('email').removeAttribute('aria-invalid');
        document.getElementById('password').removeAttribute('aria-invalid');
    }
}