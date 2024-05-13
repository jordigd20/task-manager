import { TestBed } from '@angular/core/testing';
import { UploadService } from './upload.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { first } from 'rxjs';
import { environment } from '../../../environments/environment';

const API_URL = environment.API_URL;

describe('UploadService', () => {
  let service: UploadService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: []
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(UploadService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http.post on createImage', async () => {
    const expectedResponse = {
      url: `${API_URL}/image.jpg`,
      publicId: 'abc123',
      message: 'Image uploaded successfully'
    };

    const file = new File([''], 'filename', { type: 'image/png' });

    service
      .createImage(file)
      .pipe(first())
      .subscribe((response) => {
        expect(response).toMatchObject(expectedResponse);
      });

    const req = httpMock.expectOne(`${API_URL}/api/upload`);
    expect(req.request.method).toBe('POST');
    req.flush(expectedResponse);
  });

  it('should call http.put on updateImage', async () => {
    const expectedResponse = {
      url: `${API_URL}/image.jpg`,
      publicId: 'abc123',
      message: 'Image uploaded successfully'
    };

    const file = new File([''], 'filename', { type: 'image/png' });

    service
      .updateImage('abc123', file)
      .pipe(first())
      .subscribe((response) => {
        expect(response).toMatchObject(expectedResponse);
      });

    const req = httpMock.expectOne(`${API_URL}/api/upload/abc123`);
    expect(req.request.method).toBe('PUT');
    req.flush(expectedResponse);
  });

  it('should call http.post on deleteImage', async () => {
    service
      .deleteImage('abc123')
      .pipe(first())
      .subscribe((response) => {
        expect(response).toMatchObject({ message: 'Image deleted successfully' });
      });

    const req = httpMock.expectOne(`${API_URL}/api/upload/abc123`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toMatchObject({ preset: 'task-manager' });
    req.flush({ message: 'Image deleted successfully' });
  });
});
