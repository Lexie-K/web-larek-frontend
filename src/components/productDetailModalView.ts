import { IProduct } from '../types';
import { ensureElement } from '../utils/utils';
import { CDN_URL } from '../utils/constants';
import { BaseCard } from './cardView';

export class ProductDetailModal extends BaseCard<IProduct> {
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement) {
		super(container);

		this._description = ensureElement<HTMLElement>(
			'.card__text',
			this.container
		);
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

		this.setCategory(data.category);

		this.setText(this._title, data.title);
		this.setText(this._description, data.description);

		this.setPrice(data.price);

		if (this._button) {
			this.setDisabled(this._button, data.price === null);

			if (data.price === null) {
				this.setText(this._button, 'Нет в наличии');
				this._button.dataset.action = '';
			} else if (data.isAddedToCart) {
				this.setText(this._button, 'Удалить из корзины');
				this._button.dataset.action = 'remove';
			} else {
				this.setText(this._button, 'В корзину');
				this._button.dataset.action = 'add';
			}
		}

		return this.container;
	}

	bindEvents(): void {
		//
	}
}
