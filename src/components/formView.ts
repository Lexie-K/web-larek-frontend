import { BaseView } from './base/baseView';
import { ensureElement } from '../utils/utils';

export type TFormInputValues = Record<string, string>;

export abstract class BaseForm<
	T extends TFormInputValues
> extends BaseView<void> {
	protected _submitButton: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);

		this._submitButton = ensureElement<HTMLButtonElement>(
			'.button[type="submit"]',
			this.container
		);
		this._errors =
			this.container.querySelector('.form__errors') ||
			document.createElement('div');

		this.bindCommonEvents();
	}

	protected bindCommonEvents(): void {
		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.onSubmit();
		});
	}

	abstract onSubmit(): void;

	setSubmitButtonEnabled(enabled: boolean): void {
		this.setDisabled(this._submitButton, !enabled);
	}

	setErrors(message: string): void {
		this.setText(this._errors, message);

		this.toggleClass(this._errors, 'form__error_active', !!message);
	}

	setValues(data: T): void {
		for (const key in data) {
			if (Object.prototype.hasOwnProperty.call(data, key)) {
				const input = this.container.querySelector<
					HTMLInputElement | HTMLTextAreaElement
				>(`[name="${key}"]`);
				if (input) {
					input.value = data[key];
				}
			}
		}
	}

	clearErrors(): void {
		this.setErrors('');
	}

	abstract bindEvents(): void;
}
