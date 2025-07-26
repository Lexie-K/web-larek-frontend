import { IProduct, IProductCatalogView } from '../types';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { BaseView } from './base/baseView';
import { CDN_URL } from '../utils/constants';
import { BaseCard } from './cardView';

export class ProductCard extends BaseCard<IProduct> {
	protected _button: HTMLButtonElement | null;

	constructor(
		container: HTMLElement,
		actions?: { onClick?: (event: MouseEvent) => void }
	) {
		super(container);
		this._button = this.container.querySelector('.card__button');

		if (actions?.onClick) {
			this.addEventListener(this.container, 'click', actions.onClick);
		}
	}

	render(data: IProduct): HTMLElement {
		this.setText(this._title, data.title);

		this._image.src = `${CDN_URL}${data.image}`;
		this._image.alt = data.title;

		this.setCategory(data.category);

		this.setPrice(data.price);

		if (this._button) {
			this.setDisabled(this._button, data.price === null);

			if (data.price === null) {
				this.setText(this._button, 'Нет в наличии');
			} else if (data.isAddedToCart) {
				this.setText(this._button, 'Уже в корзине');
				this.setDisabled(this._button, true);
			} else {
				this.setText(this._button, 'В корзину');
			}
		}

		return this.container;
	}

	bindEvents(): void {
		//
	}
}

export class ProductCatalog
	extends BaseView<void>
	implements IProductCatalogView
{
	protected _catalogContainer: HTMLElement;
	protected _cartButton: HTMLElement;
	protected _cartCounter: HTMLElement;
	protected _productCardTemplate: HTMLTemplateElement;

	protected _onProductCardClickHandler: (productId: string) => void;
	protected _onCartIconClickHandler: () => void;

	constructor(
		container: HTMLElement,
		productCardTemplate: HTMLTemplateElement
	) {
		super(container);

		this._catalogContainer = this.container;

		this._cartButton = ensureElement<HTMLElement>(
			'.header__basket',
			document.body
		);
		this._cartCounter = ensureElement<HTMLElement>(
			'.header__basket-counter',
			this._cartButton
		);

		this._productCardTemplate = productCardTemplate;

		this.bindEvents();
	}

	render(): HTMLElement {
		return this.container;
	}

	updateCatalog(products: IProduct[]): void {
		this._catalogContainer.innerHTML = '';
		products.forEach((product) => {
			const cardElement = cloneTemplate<HTMLElement>(this._productCardTemplate);
			const productCard = new ProductCard(cardElement, {
				onClick: () => {
					if (this._onProductCardClickHandler) {
						this._onProductCardClickHandler(product.id);
					}
				},
			});
			this._catalogContainer.append(productCard.render(product));
		});
	}

	onProductCardClick(handler: (productId: string) => void): void {
		this._onProductCardClickHandler = handler;
	}

	onCartIconClick(handler: () => void): void {
		this._onCartIconClickHandler = handler;
	}

	setCartCounter(count: number): void {
		this.setText(this._cartCounter, String(count));
	}

	bindEvents(): void {
		this.addEventListener(this._cartButton, 'click', () => {
			if (this._onCartIconClickHandler) {
				this._onCartIconClickHandler();
			}
		});
	}
}
