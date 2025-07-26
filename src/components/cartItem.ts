import { BaseView } from './base/baseView';
import { ICartItem } from '../types';
import { ensureElement } from '../utils/utils';

export class CartItem extends BaseView<ICartItem> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _deleteButton: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		actions?: { onDeleteClick?: (event: MouseEvent) => void }
	) {
		super(container);

		this._index = ensureElement<HTMLElement>(
			'.basket__item-index',
			this.container
		);
		this._title = ensureElement<HTMLElement>('.card__title', this.container);
		this._price = ensureElement<HTMLElement>('.card__price', this.container);
		this._deleteButton = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			this.container
		);

		if (actions?.onDeleteClick) {
			this.addEventListener(this._deleteButton, 'click', actions.onDeleteClick);
		}
	}

	render(data: ICartItem): HTMLElement {
		this.setText(this._title, data.title);
		this.setText(this._price, `${data.price} синапсов`);
		return this.container;
	}

	setIndex(index: number): void {
		this.setText(this._index, index);
	}

	bindEvents(): void {
		//
	}
}
