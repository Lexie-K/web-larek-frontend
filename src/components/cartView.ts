import { BaseView } from './base/baseView';
import { ICartItem, ICartView } from '../types';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { CartItem } from './cartItem';

export class CartView extends BaseView<void> implements ICartView {
	protected _list: HTMLElement;
	protected _totalPrice: HTMLElement;
	protected _checkoutButton: HTMLButtonElement;
	protected _onRemoveCartItemClickHandler: (productId: string) => void;
	protected _onCheckoutClickHandler: () => void;
	protected _onCloseClickHandler: () => void;
	protected _cartItemTemplate: HTMLTemplateElement;

	constructor(container: HTMLElement, cartItemTemplate: HTMLTemplateElement) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._totalPrice = ensureElement<HTMLElement>(
			'.basket__price',
			this.container
		);
		this._checkoutButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		this._cartItemTemplate = cartItemTemplate;

		this.bindEvents();
	}

	render(): HTMLElement {
		return this.container;
	}

	updateCart(items: ICartItem[], total: number): void {
		this._list.innerHTML = '';

		if (items.length === 0) {
			this._list.textContent = 'Корзина пуста';
			this._checkoutButton.disabled = true;
		} else {
			items.forEach((item, index) => {
				const itemElement = cloneTemplate<HTMLElement>(this._cartItemTemplate);
				const cartItem = new CartItem(itemElement, {
					onDeleteClick: () => {
						this._onRemoveCartItemClickHandler?.(item.id);
					},
				});
				cartItem.setIndex(index + 1);
				this._list.append(cartItem.render(item));
			});
			this._checkoutButton.disabled = false;
		}

		this._totalPrice.textContent = `${total} синапсов`;
	}

	bindEvents(): void {
		this.addEventListener(this._checkoutButton, 'click', () => {
			this._onCheckoutClickHandler?.();
		});
	}

	onRemoveCartItemClick(handler: (productId: string) => void): void {
		this._onRemoveCartItemClickHandler = handler;
	}

	onCheckoutClick(handler: () => void): void {
		this._onCheckoutClickHandler = handler;
	}

	onClose(handler: () => void): void {
		this._onCloseClickHandler = handler;
	}
}
