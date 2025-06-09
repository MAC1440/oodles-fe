export type DEVICE = {
    availableLocations: string[];
    id: number;
    model: string;
    processor: string;
    ram: number;
    screenSize: number;
    status: "available" | "in use";
  };