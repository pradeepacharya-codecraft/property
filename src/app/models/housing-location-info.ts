export interface HousingLocationInfo {
  deleted: any;
  id: number;
  name: string;
  city: string;
  state: string;
  photo: string;
  availableUnits: number;
  wifi: boolean;
  laundry: boolean;
}

export interface HousingLOcationView extends HousingLocationInfo {
  selected: boolean;
}
