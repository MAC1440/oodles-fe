export interface Employee {
  name: string;
  role: string;
  location: string;
  createdAt?:any;
  assignedDevice: {
    model: string;
    processor?: string;
    ram?: number;
    screenSize?: number;
    status?: "available" | "in use";
  };
}
