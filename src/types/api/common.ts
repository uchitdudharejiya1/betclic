export type ApiPaging = {current: number; total: number};

export type ApiErrors = string[] | Record<string, string>;

export type ApiResponse<T> = {
  get: string;
  parameters: Record<string, string>;
  errors: ApiErrors;
  results: number;
  paging: ApiPaging;
  response: T;
};

export const hasApiErrors = (errors: ApiErrors | undefined): boolean => {
  if (!errors) return false;
  if (Array.isArray(errors)) return errors.length > 0;
  return Object.keys(errors).length > 0;
};
