import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitForm } from '../formSubmission';
import type { Vueform } from '@vueform/vueform';
import * as apiModule from '@/api';

// Mock the apiFetch module
vi.mock('@/api', () => ({
  apiFetch: vi.fn(),
}));

describe('formSubmission', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call apiFetch with correct endpoint and method', async () => {
    const mockResponse = new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

    vi.mocked(apiModule.apiFetch).mockResolvedValue(mockResponse);

    const mockForm = {
      requestData: {
        movementsDate: '2025-12-10',
        movements: [],
      },
    } as unknown as Vueform;

    const mockFormData = new FormData();

    await submitForm(mockFormData, mockForm);

    expect(apiModule.apiFetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/forms/movements'),
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.any(String),
      })
    );
  });

  it('should send form data as JSON string', async () => {
    const mockResponse = new Response(JSON.stringify({ success: true }), {
      status: 201,
    });

    vi.mocked(apiModule.apiFetch).mockResolvedValue(mockResponse);

    const formData = {
      movementsDate: '2025-12-10',
      movements: [
        {
          movementType: 'ON_FOOT',
          departureTime: '12:00',
        },
      ],
    };

    const mockForm = {
      requestData: formData,
    } as unknown as Vueform;

    await submitForm(new FormData(), mockForm);

    const callArgs = vi.mocked(apiModule.apiFetch).mock.calls[0];
    expect(callArgs).toBeDefined();
    const body = callArgs![1]?.body as string;
    const parsedBody = JSON.parse(body);

    expect(parsedBody).toEqual(formData);
  });

  it('should return the response from apiFetch', async () => {
    const mockResponse = new Response(JSON.stringify({ success: true }), {
      status: 201,
    });

    vi.mocked(apiModule.apiFetch).mockResolvedValue(mockResponse);

    const mockForm = {
      requestData: { movementsDate: '2025-12-10', movements: [] },
    } as unknown as Vueform;

    const result = await submitForm(new FormData(), mockForm);

    expect(result).toBe(mockResponse);
  });
});
