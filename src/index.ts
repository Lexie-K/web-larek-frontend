import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { AppPresenter } from './presenters/appPresenter';
import { ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new Api(API_URL);

const productCardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const productPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cartItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successMessageTemplate = ensureElement<HTMLTemplateElement>('#success'); 
const galleryElement = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLElement>('#modal-container');

const app = new AppPresenter(
	api,
	events,
	galleryElement,
	productCardTemplate,
	modalContainer,
	productPreviewTemplate,
	cartTemplate,
	cartItemTemplate,
	orderFormTemplate,
	contactsFormTemplate,
	successMessageTemplate
);

app.init();
