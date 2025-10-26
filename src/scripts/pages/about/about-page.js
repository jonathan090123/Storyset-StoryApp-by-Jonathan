export default class AboutPage {
  async render() {
    return `
      <section class="about-section">
        <div class="container">
          <div class="about-content">
            <h1>About Storyset</h1>
            <div class="about-description">
              <p>Selamat datang di Storyset - Platform Anda untuk Berbagi Cerita Unik!</p>
              
              <h2>Our Mission</h2>
              <p>Di Storyset, kami percaya setiap orang memiliki cerita unik untuk dibagikan. Platform kami dirancang untuk membantu Anda membagikan pengalaman, kenangan, dan momen berharga kepada dunia dengan cara yang bermakna.</p>
              
              <h2>Feature</h2>
              <ul>
                <li>Berbagi cerita dengan mudah menggunakan teks dan gambar</li>
                <li>Interaksi komunitas yang menarik</li>
                <li>Autentikasi pengguna yang aman</li>
                <li>Tampilan yang ramah perangkat mobile</li>
                <li>Fitur peta lokasi realtime untuk melacak dan berbagi lokasi cerita Anda</li>
              </ul>

              <h2>Bergabung dengan Komunitas Kami</h2>
              <p>Jadilah bagian dari komunitas pencerita kami yang terus berkembang. Bagikan perspektif unik Anda dan terhubung dengan orang lain melalui kekuatan bercerita.</p>
              
              <h2>Contact dev</h2>
              <p>Instagram: <a href="https://www.instagram.com/jonathanalvinz/" target="_blank" rel="noopener">@jonathanalvinz</a></p>
              <p>Email: contact@storyset.com</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Do your job here
  }
}
