import { IProduct, IProductCatalogView } from '../types';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { BaseView } from './base/baseView';
import { CDN_URL } from '../utils/constants';

export class ProductCard extends BaseView<IProduct> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement | null;

	constructor(
		container: HTMLElement,
		actions?: { onClick?: (event: MouseEvent) => void }
	) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', this.container);
		this._image = ensureElement<HTMLImageElement>(
			'.card__image',
			this.container
		);
		this._category = ensureElement<HTMLElement>(
			'.card__category',
			this.container
		);
		this._price = ensureElement<HTMLElement>('.card__price', this.container);
		this._button = this.container.querySelector('.card__button');

		if (actions?.onClick) {
			this.addEventListener(this.container, 'click', actions.onClick);
		}
	}

	render(data: IProduct): HTMLElement {
		this._title.textContent = data.title;
		this._image.src = `${CDN_URL}${data.image}`;
		this._image.alt = data.title;
		this._category.textContent = data.category;

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

		this._price.textContent =
			data.price !== null ? `${data.price} синапсов` : 'Бесценно';

		if (this._button) {
			this._button.disabled = data.price === null;

			if (data.price === null) {
				this._button.textContent = 'Нет в наличии';
			} else if (data.isAddedToCart) {
				this._button.textContent = 'Уже в корзине';
				this._button.disabled = true;
			} else {
				this._button.textContent = 'В корзину';
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
		this._cartCounter.textContent = String(count);
	}

	bindEvents(): void {
		this.addEventListener(this._cartButton, 'click', () => {
			if (this._onCartIconClickHandler) {
				this._onCartIconClickHandler();
			}
		});
	}
}
