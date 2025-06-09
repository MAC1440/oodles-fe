import { type NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const filePath = path.join(process.cwd(), "devices.json");
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(
    filePath,
    JSON.stringify([
      {
        id: "1",
        model: "MacBook Pro 16 M2",
        screenSize: 16,
        processor: "Apple M2 Pro",
        ram: 32,
        availableLocations: ["Ireland", "EU"],
        status: "available",
        user:{}
      },
      {
        id: "2",
        model: "Dell XPS 13",
        screenSize: 13.3,
        processor: "Intel Core i7 12th Gen",
        ram: 16,
        availableLocations: ["UK", "Ireland"],
        status: "available",
        user:{}
      },
      {
        id: "3",
        model: "Lenovo ThinkPad X1 Carbon",
        screenSize: 14,
        processor: "Intel Core i5 11th Gen",
        ram: 8,
        availableLocations: ["UK"],
        status: "available",
        user:{}
      },
      {
        id: "4",
        model: "HP EliteBook 840 G9",
        screenSize: 14,
        processor: "Intel Core i7 12th Gen",
        ram: 8,
        availableLocations: ["UK", "EU"],
        status: "available",
        user:{}
      },
      {
        id: "5",
        model: "Microsoft Surface Laptop 5",
        screenSize: 13.5,
        processor: "Intel Core i7 12th Gen",
        ram: 8,
        availableLocations: ["UK", "EU"],
        status: "available",
        user:{}
      },
      {
        id: "6",
        model: "Asus ZenBook 14",
        screenSize: 14,
        processor: "AMD Ryzen 7 5800U",
        ram: 4,
        availableLocations: ["UK"],
        status: "available",
        user:{}
      },
      {
        id: "7",
        model: "MacBook Air 15 M2",
        screenSize: 15,
        processor: "Apple M2",
        ram: 16,
        availableLocations: ["Ireland"],
        status: "available",
        user:{}
      },
      {
        id: "8",
        model: "Acer Swift X",
        screenSize: 14,
        processor: "AMD Ryzen 7 5800U",
        ram: 16,
        availableLocations: ["UK", "Ireland", "EU"],
        status: "available",
        user:{}
      },
    ])
  );
}
function readDevices() {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeDevices(devices: any[]) {
  fs.writeFileSync(filePath, JSON.stringify(devices, null, 2));
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const role = searchParams.get("role");
  const location = searchParams.get("location");
  const status = searchParams.get("status"); // "available", "in use", or "all"

  let devices = readDevices();

  if (role) {
    devices = devices.filter((d: any) => d.suitableRoles?.includes(role));
  }

  if (location) {
    devices = devices.filter((d: any) =>
      d.availableLocations.includes(location)
    );
  }

  if (status === "available" || status === "in use") {
    devices = devices.filter((d: any) => d.status === status);
  }

  return NextResponse.json({ devices });
}
export async function POST(request: NextRequest) {
  const body = await request.json();
  const devices = readDevices();

  const newDevice = {
    ...body,
    id: uuidv4(),
    status: "available",
  };

  devices.push(newDevice);
  writeDevices(devices);

  return NextResponse.json({ message: "Device added", device: newDevice });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json(); // { id, status, user? }

  const { id, status, user } = body;
  if (!id || !status) {
    return NextResponse.json(
      { error: "id and status are required" },
      { status: 400 }
    );
  }

  const devices = readDevices();
  const index = devices.findIndex((d: any) => d.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Device not found" }, { status: 404 });
  }

  devices[index].status = status;

  if (status === "in use" && user) {
    devices[index].user = user; // e.g., { name, role, assignedAt }
  } else {
    // delete devices[index].user;
  }

  writeDevices(devices);

  return NextResponse.json({
    message: "Device updated",
    device: devices[index],
  });
}
