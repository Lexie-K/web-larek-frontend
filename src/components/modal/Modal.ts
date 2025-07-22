import { IModalData } from '../../types';
import { ensureElement } from '../../utils/utils';
import { BaseView } from '../base/baseView';
import { EventEmitter } from '../base/events';

export class Modal extends BaseView<IModalData> {
	protected readonly _closeButton: HTMLButtonElement;
	protected readonly _content: HTMLElement;

	constructor(container: HTMLElement, protected readonly events: EventEmitter) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			this.container
		);
		this._content = ensureElement<HTMLElement>(
			'.modal__content',
			this.container
		);

		this.setEventListeners();
	}

	protected setEventListeners(): void {
		this._closeButton.addEventListener('click', this.close.bind(this));

		this.container.addEventListener('click', (e: MouseEvent) => {
			if (e.target === this.container) {
				this.close();
			}
		});

		document.addEventListener('keydown', (e: KeyboardEvent) => {
			if (e.key === 'Escape' && this.isOpen()) {
				this.close();
			}
		});
	}

	public open(content: HTMLElement): void {
		this._content.replaceChildren(content);
		this.toggleClass(this.container, 'modal_active', true);
		this.events.emit('modal:open');

		this._closeButton.focus();
	}

	public close(): void {
		this.toggleClass(this.container, 'modal_active', false);
		this._content.replaceChildren();
		this.events.emit('modal:close');
	}

	render(data: IModalData): HTMLElement {
		this.open(data.content);
		return this.container;
	}

	public isOpen(): boolean {
		return this.container.classList.contains('modal_active');
	}

	bindEvents(): void {
		if (this._closeButton) {
			this._closeButton.addEventListener('click', () => this.close());
		}
	}
}
