export interface IGenericPage<T> {
  items: number;
  pages: number;
  current_page: number;
  next_page: number;
  previous_page: number;
  results: T[];
}