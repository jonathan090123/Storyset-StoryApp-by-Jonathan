import AddStoryView from './add-story-view';
import AddStoryPresenter from './add-story-presenter';
import {
    isAuthenticated
} from '../../utils/auth-helper';

export default class AddStoryPage {
    constructor() {
        this.view = new AddStoryView();
        this.presenter = new AddStoryPresenter(this.view);
    }

    async render() {
        if (!isAuthenticated()) {
            window.location.hash = '#/login';
            return '<div></div>';
        }
        return this.view.render();
    }

    async afterRender() {
        this.presenter.initializeMap();
        this.presenter.setupPhotoInput();
        this.presenter.setupCameraFeature();

        const form = document.getElementById('add-story-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const description = document.getElementById('description').value;
            this.presenter.handleSubmit(description);
        });
    }
}