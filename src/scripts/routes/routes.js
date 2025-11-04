import HomePage from '../pages/home/home-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import FavoritesPage from '../pages/favorites/favorites-page';
import AddStoryPage from '../pages/add-story/add-story-page';
import AboutPage from '../pages/about/about-page';

const routes = {
  '/': new HomePage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/favorites': new FavoritesPage(),
  '/add-story': new AddStoryPage(),
  '/about': new AboutPage(),
};

export default routes;