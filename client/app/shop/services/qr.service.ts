import { Injectable } from '@angular/core';
import jsQR from 'jsqr';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class QrService {

    private stream: MediaStream | null;

    private video: HTMLVideoElement;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private readonly scanObservable = new Subject<string | null>();
    private readonly streamObservable = new ReplaySubject<MediaStream>(1);

    private starting = false;
    private paused = true;

    constructor() {
    }

    public getStream(): Observable<MediaStream> {
        return this.streamObservable;
    }

    public start(): void {

        if (this.stream || this.starting) {
            this.paused = false;
            requestAnimationFrame(this.decode.bind(this));
            return;
        }

        this.starting = true;
        this.paused = false;

        this.video = document.createElement('video');
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}}).then(async (stream: MediaStream) => {
            this.starting = false;
            this.streamObservable.next(stream);
            this.stream = stream;
            this.video.srcObject = stream;
            this.video.setAttribute('playsinline', 'true'); // required to tell iOS safari we don't want fullscreen
            this.video.play();
            requestAnimationFrame(this.decode.bind(this));

        }).catch((err) => {
            this.scanObservable.error(err);
        });

    }

    /**
     * Start to watch QR scanning, but dont start scanning. Call QrService.start() separatedly
     */
    public scan(): Observable<string> {
        return this.scanObservable.pipe(distinctUntilChanged(), filter(v => !!v)) as Observable<string>;
    }

    /**
     * Pause processing, but keep the camera on, so processing can be restarted quickly
     */
    public pause(): void {
        this.paused = true;
    }

    /**
     * Stop without allowing restart. Kill everything, a new service has to be instantiated
     */
    public stop(): void {

        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        this.scanObservable.complete();
    }

    private decode(): void {
        if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {

            this.canvas.height = this.video.videoHeight;
            this.canvas.width = this.video.videoWidth;
            this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

            const imgData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            const code = jsQR(imgData.data, imgData.width, imgData.height);

            if (code && code.data) {
                this.scanObservable.next(code.data);
            } else {
                this.scanObservable.next(null);
            }

            if (!this.paused) {
                requestAnimationFrame(this.decode.bind(this));
            }
        } else {
            if (!this.paused) {
                requestAnimationFrame(this.decode.bind(this));
            }
        }
    }

}
