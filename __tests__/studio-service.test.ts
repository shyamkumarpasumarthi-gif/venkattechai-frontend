import { StudioService } from '@/lib/api/studio-service';
import { bffClient } from '@/lib/api/bff-client';

type JestMock = jest.MockedFunction<typeof bffClient.post>;

jest.mock('@/lib/api/bff-client', () => ({
  bffClient: {
    post: jest.fn(),
  },
}));

describe('StudioService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls BFF face-swap endpoint and returns response', async () => {
    const payload = {
      sourceImageUrl: 'https://example.com/face.jpg',
      targetVideoUrl: 'https://example.com/video.mp4',
      speed: 'balanced' as const,
      quality: 'high' as const,
    };

    const expected = {
      success: true,
      outputUrl: 'https://example.com/output.mp4',
      jobId: 'job-123',
    };

    (bffClient.post as unknown as jest.Mock).mockResolvedValue({
      data: {
        data: expected,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
      request: {},
    });

    const result = await StudioService.faceSwap(payload);

    expect(bffClient.post).toHaveBeenCalledWith('/bff/studio/face-swap', payload);
    expect(result).toEqual(expected);
  });

  it('rethrows when BFF request fails', async () => {
    const payload = {
      sourceImageUrl: 'https://example.com/face.jpg',
      targetVideoUrl: 'https://example.com/video.mp4',
      speed: 'balanced' as const,
      quality: 'high' as const,
    };

    (bffClient.post as unknown as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(StudioService.faceSwap(payload)).rejects.toThrow('Network error');
  });
});
