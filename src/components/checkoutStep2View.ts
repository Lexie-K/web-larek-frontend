import { BaseView } from './base/baseView';
import { ICheckoutStep2View } from '../types';
import { ensureElement } from '../utils/utils';

export class CheckoutStep2View
	extends BaseView<void>
	implements ICheckoutStep2View
{
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;
	protected _submitButton: HTMLButtonElement;
	protected _emailError: HTMLElement;
	protected _phoneError: HTMLElement;

	protected _onEmailInputHandler: (email: string) => void;
	protected _onPhoneInputHandler: (phone: string) => void;
	protected _onSubmitClickHandler: () => void;

	constructor(container: HTMLElement) {
		super(container);

		this._emailInput = ensureElement<HTMLInputElement>(
			'.form__input[name="email"]',
			this.container
		);
		this._phoneInput = ensureElement<HTMLInputElement>(
			'.form__input[name="phone"]',
			this.container
		);
		this._submitButton = ensureElement<HTMLButtonElement>(
			'.button[type="submit"]',
			this.container
		);
		this._emailError = ensureElement<HTMLElement>(
			'.form__errors[name="email"]',
			this.container
		);
		this._phoneError = ensureElement<HTMLElement>(
			'.form__errors[name="phone"]',
			this.container
		);

		this.bindEvents();
	}

	render(): HTMLElement {
		return this.container;
	}

	onEmailInput(handler: (email: string) => void): void {
		this._onEmailInputHandler = handler;
	}

	onPhoneInput(handler: (phone: string) => void): void {
		this._onPhoneInputHandler = handler;
	}

	onSubmitClick(handler: () => void): void {
		this._onSubmitClickHandler = handler;
	}

	showEmailError(message: string): void {
		this._emailError.textContent = message;
		this.toggleClass(this._emailError, 'form__error_active', !!message);
	}

	showPhoneError(message: string): void {
		this._phoneError.textContent = message;
		this.toggleClass(this._phoneError, 'form__error_active', !!message);
	}

	setSubmitButtonEnabled(enabled: boolean): void {
		this._submitButton.disabled = !enabled;
	}

	bindEvents(): void {
		this.addEventListener(this._emailInput, 'input', (e: Event) => {
			const inputElement = e.target as HTMLInputElement;
			this._onEmailInputHandler?.(inputElement.value);
		});

		this.addEventListener(this._phoneInput, 'input', (e: Event) => {
			const inputElement = e.target as HTMLInputElement;
			this._onPhoneInputHandler?.(inputElement.value);
		});

		this.addEventListener(this._submitButton, 'click', (e: Event) => {
			e.preventDefault();
			this._onSubmitClickHandler?.();
		});
	}

	setEmail(email: string): void {
		this._emailInput.value = email;
	}

	setPhone(phone: string): void {
		this._phoneInput.value = phone;
	}
}
