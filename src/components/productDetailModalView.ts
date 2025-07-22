import { BaseView } from './base/baseView';
import { IProduct } from '../types';
import { ensureElement } from '../utils/utils';
import { CDN_URL } from '../utils/constants';

export class ProductDetailModal extends BaseView<IProduct> {
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _title: HTMLElement;
	protected _description: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement) {
		super(container);

		this._image = ensureElement<HTMLImageElement>(
			'.card__image',
			this.container
		);
		this._category = ensureElement<HTMLElement>(
			'.card__category',
			this.container
		);
		this._title = ensureElement<HTMLElement>('.card__title', this.container);
		this._description = ensureElement<HTMLElement>(
			'.card__text',
			this.container
		);
		this._price = ensureElement<HTMLElement>('.card__price', this.container);
		this._button = ensureElement<HTMLButtonElement>(
			'.card__button',
			this.container
		);
	}

	public onButtonClick(handler: (action: 'add' | 'remove') => void): void {
		this.addEventListener(this._button, 'click', (event) => {
			const targetButton = event.target as HTMLButtonElement;
			const action = targetButton.dataset.action as 'add' | 'remove';

			if (action === 'add' || action === 'remove') {
				handler(action);
			}
		});
	}

	render(data: IProduct): HTMLElement {
		this._image.src = `${CDN_URL}${data.image}`;
		this._image.alt = data.title;
		this._category.textContent = data.category;
		this._title.textContent = data.title;
		this._description.textContent = data.description;
		this._price.textContent =
			data.price !== null ? `${data.price} синапсов` : 'Бесценно';

		if (this._button) {
			this._button.disabled = data.price === null;

			if (data.price === null) {
				this._button.textContent = 'Нет в наличии';
				this._button.dataset.action = '';
			} else if (data.isAddedToCart) {
				this._button.textContent = 'Удалить из корзины';
				this._button.dataset.action = 'remove';
			} else {
				this._button.textContent = 'В корзину';
				this._button.dataset.action = 'add';
			}
		}

		this._category.classList.remove(
			'card__category_hard',
			'card__category_other',
			'card__category_soft',
			'card__category_additional',
			'card__category_button'
		);
		switch (data.category) {
			case 'софт-скил':
				this._category.classList.add('card__category_soft');
				break;
			case 'другое':
				this._category.classList.add('card__category_other');
				break;
			case 'дополнительное':
				this._category.classList.add('card__category_additional');
				break;
			case 'кнопка':
				this._category.classList.add('card__category_button');
				break;
			case 'хард-скил':
				this._category.classList.add('card__category_hard');
				break;
			default:
				break;
		}

		return this.container;
	}

	bindEvents(): void {
    //
  }
}
