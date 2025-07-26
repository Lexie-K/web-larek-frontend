import { BaseView } from './base/baseView';

interface IPageView {
	setLocked(value: boolean): void;
}

export class PageView extends BaseView<void> implements IPageView {
	constructor(container: HTMLElement) {
		super(container); 
	}

	setLocked(value: boolean): void {
		this.toggleClass(this.container, 'page__locked', value);
	}

	render(): HTMLElement {
		return this.container;
	}

	bindEvents(): void {
		//
	}
}
