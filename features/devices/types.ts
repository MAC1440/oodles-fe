export interface Device {
    availableLocations: string[];
    model: string;
    processor?: string;
    ram?: number;
    screenSize?: number;
    status?: "available" | "in use";
    user: {
      name: string;
      role: string;
      location: string;
    };
  }