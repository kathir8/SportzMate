import { Directive, Inject, Input, OnInit, Optional, WritableSignal } from '@angular/core';
import { SignalHost } from 'src/app/core/model/signal.model';
import { SignalService } from 'src/app/core/services/signal.service';

@Directive({
  selector: '[path]'
})
export class SignalPathDirective implements OnInit {

  @Input() path!: string;
  @Input() source!: WritableSignal<any>;

  constructor(
    @Optional() @Inject(SignalHost) private host: SignalHost,
    private signalService: SignalService
  ) { }

  ngOnInit() {
    if (!this.host) return;

    if (!this.source || typeof this.source.update !== 'function') {
      console.error('source must be a WritableSignal', this.source);
      return;
    }

    // Input → Signal
    this.host.signalValueChange.subscribe(value => {
      this.signalService.updateDeepValue(
        this.source,
        this.path,
        value
      );
    });
  }
}
