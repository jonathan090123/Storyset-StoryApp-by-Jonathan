export default class RegisterView {
    render() {
        return `
      <section class="container auth-section">
        <div class="auth-card">
          <h1 class="auth-title">Register</h1>
          <p class="auth-subtitle">Buat akun untuk berbagi cerita</p>
          
          <form id="register-form" class="auth-form" novalidate>
            <div class="form-group">
              <label for="name">Nama</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                aria-required="true"
                aria-describedby="name-error"
                autocomplete="name"
              />
              <span id="name-error" class="error-text" role="alert"></span>
            </div>

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
                autocomplete="new-password"
              />
              <span id="password-error" class="error-text" role="alert"></span>
              <small>Minimal 8 karakter</small>
            </div>

            <button type="submit" class="btn btn-primary">Register</button>
          </form>

          <p class="auth-link">
            Sudah punya akun Storyset? <a href="#/login">Login di sini</a>
          </p>
        </div>
      </section>
    `;
    }

    showNameError(message) {
        document.getElementById('name-error').textContent = message;
        document.getElementById('name').setAttribute('aria-invalid', 'true');
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
        ['name-error', 'email-error', 'password-error'].forEach(id => {
            document.getElementById(id).textContent = '';
        });
        ['name', 'email', 'password'].forEach(id => {
            document.getElementById(id).removeAttribute('aria-invalid');
        });
    }
}