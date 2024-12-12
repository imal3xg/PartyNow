import { Directive, ElementRef, Input, OnInit } from '@angular/core'; 
 
@Directive({ 
  selector: '[appHighlightCheapParty]' 
}) 
export class HighlightCheapPartyDirective implements OnInit { 
  @Input('appHighlightCheapParty') price: number = 0; 
 
  constructor(private el: ElementRef) {} 
 
  ngOnInit() { 
    if (this.price < 10) { 
      this.el.nativeElement.style.border = '2px solid green';
      this.el.nativeElement.style.boxShadow = '0 0 12px green';
    } 
    if (this.price >= 10 && this.price < 50) { 
      this.el.nativeElement.style.border = '2px solid yellow';
      this.el.nativeElement.style.boxShadow = '0 0 12px yellow';
    } 
    if (this.price >= 50 && this.price < 100) { 
      this.el.nativeElement.style.border = '2px solid orange';
      this.el.nativeElement.style.boxShadow = '0 0 12px orange';
    } 
    if (this.price >= 100) { 
      this.el.nativeElement.style.border = '2px solid red';
      this.el.nativeElement.style.boxShadow = '0 0 12px red';
    } 
  } 
}