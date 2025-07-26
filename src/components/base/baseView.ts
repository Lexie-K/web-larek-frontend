import { IBaseView } from '../../types';
import { ensureElement } from '../../utils/utils';

export abstract class BaseView<T = void> implements IBaseView<T> {
	protected container: HTMLElement;

	constructor(containerSelector: string | HTMLElement) {
		this.container = ensureElement<HTMLElement>(containerSelector);
	}

	abstract render(data?: T): HTMLElement;

	show(): void {
		this.container.classList.remove('hidden');
		this.container.style.display = '';
	}

	hide(): void {
		this.container.classList.add('hidden');
		this.container.style.display = 'none';
	}

	abstract bindEvents(): void;

	protected createElement<E extends HTMLElement>(htmlString: string): E {
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = htmlString.trim();
		return tempDiv.firstChild as E;
	}

	protected ensureElement<E extends HTMLElement>(
		selector: string,
		context: HTMLElement = this.container
	): E {
		return ensureElement<E>(selector, context);
	}

	protected addEventListener(
		element: HTMLElement,
		event: string,
		handler: EventListenerOrEventListenerObject
	): void {
		element.addEventListener(event, handler);
	}

	protected toggleClass(
		element: HTMLElement,
		className: string,
		force?: boolean
	): void {
		element.classList.toggle(className, force);
	}

	protected setText(element: HTMLElement, value: string | number | null): void {
		if (element) {
			element.textContent = String(value);
		}
	}

	protected setDisabled(element: HTMLElement, state: boolean): void {
		if (
			element instanceof HTMLButtonElement ||
			element instanceof HTMLInputElement ||
			element instanceof HTMLTextAreaElement
		) {
			element.disabled = state;
		}
	}
}
