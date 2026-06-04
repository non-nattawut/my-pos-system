import { ApiResponse } from '@/types';

/**
 * Type guard to check if a PromiseSettledResult was successfully fulfilled
 * and contains valid data from our standard API envelope.
 */
export function isFulfilledSuccess<T>(
  result: PromiseSettledResult<ApiResponse<T>>
): result is PromiseFulfilledResult<ApiResponse<T>> {
  return (
    result.status === 'fulfilled' &&
    result.value !== undefined &&
    result.value !== null &&
    'success' in result.value &&
    result.value.success &&
    result.value.data !== undefined
  );
}
