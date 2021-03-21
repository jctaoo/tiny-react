export abstract class ElementNode<NativeElement, Attributes> {
  nativeElement: NativeElement;
  attributes: Attributes;
  children: ElementNode<NativeElement, Attributes>[];

  abstract toFiber(): any // todo

  constructor({
    nativeElement,
    attributes,
    children = [],
  }: {
    nativeElement: NativeElement;
    attributes: Attributes;
    children: ElementNode<NativeElement, Attributes>[];
  }) {
    this.nativeElement = nativeElement;
    this.attributes = attributes;
    this.children = children;
  }
}
