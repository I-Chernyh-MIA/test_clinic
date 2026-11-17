export class FilteredRawSlotsDto {
  readonly doctor_id: number;
  readonly last_name: string;
  readonly first_name: string;
  readonly patronymic: string | null;
  readonly gender: 'male' | 'female';
  readonly price: string;
  readonly specialty_id: number;
  readonly specialty: string;
  readonly slot_id: number;
  readonly slot_date: string;
  readonly start_time: string;
  readonly end_time: string;
  readonly status: 'free' | 'occupied';
  readonly timezone: number;
}