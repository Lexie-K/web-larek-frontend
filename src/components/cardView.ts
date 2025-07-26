import { BaseView } from './base/baseView';
import { ensureElement } from '../utils/utils';
import { IProduct } from '../types';

export abstract class BaseCard<TData extends IProduct> extends BaseView<TData> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;

	protected _categoryColor: Record<string, string> = {
		'софт-скил': 'soft',
		другое: 'other',
		дополнительное: 'additional',
		кнопка: 'button',
		'хард-скил': 'hard',
	};

	constructor(container: HTMLElement) {
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
	}

	protected setCategory(value: string): void {
		this.setText(this._category, value);

		const categoryClassSuffix = this._categoryColor[value] || 'other';

		for (const key in this._categoryColor) {
			if (Object.prototype.hasOwnProperty.call(this._categoryColor, key)) {
				this.toggleClass(
					this._category,
					`card__category_${this._categoryColor[key]}`,
					false
				);
			}
		}

		this.toggleClass(
			this._category,
			`card__category_${categoryClassSuffix}`,
			true
		);
	}

	protected setPrice(price: number | null): void {
		this.setText(
			this._price,
			price !== null ? `${price} синапсов` : 'Бесценно'
		);
	}

	abstract render(data: TData): HTMLElement;
	abstract bindEvents(): void;
}
