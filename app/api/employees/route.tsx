import { type NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

const employeePath = path.join(process.cwd(), "employees.json");

function readEmployees() {
  if (!fs.existsSync(employeePath)) return [];
  return JSON.parse(fs.readFileSync(employeePath, "utf-8"));
}
function writeEmployees(data: any) {
  fs.writeFileSync(employeePath, JSON.stringify(data, null, 2));
}

export async function POST(request: NextRequest) {
  const { name, role, location, assignedDevice } = await request.json();

  if (!name || !role || !location || !assignedDevice) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const devicePath = path.join(process.cwd(), "devices.json");
  const devices = fs.existsSync(devicePath)
    ? JSON.parse(fs.readFileSync(devicePath, "utf-8"))
    : [];

  const device = devices.find((d: any) => d.id === assignedDevice);

  if (!device) {
    return NextResponse.json(
      { error: "Assigned device not found." },
      { status: 404 }
    );
  }

  if (device.status !== "available") {
    return NextResponse.json(
      { error: "Device is not available for assignment." },
      { status: 400 }
    );
  }

  if (!device.availableLocations.includes(location)) {
    return NextResponse.json(
      { error: "Device is not available in the selected location." },
      { status: 400 }
    );
  }

  // Role-based suitability checks (mirror of frontend logic)
  const isSuitable = (() => {
    switch (role) {
      case "Developer":
        return device.ram >= 16;
      case "Designer":
        return device.screenSize >= 15;
      case "Marketing":
        return device.ram >= 8 && device.screenSize >= 13;
      case "Sales":
        return true;
      default:
        return false;
    }
  })();

  if (!isSuitable) {
    return NextResponse.json(
      { error: "Device does not meet the requirements for the selected role." },
      { status: 400 }
    );
  }

  // Update device
  device.status = "in use";
  device.user = {
    name,
    role,
    assignedAt: new Date().toISOString(),
  };

  // Save updated devices list
  const updatedDevices = devices.map((d: any) =>
    d.id === device.id ? device : d
  );
  fs.writeFileSync(devicePath, JSON.stringify(updatedDevices, null, 2));

  // Save employee
  const newEmployee = {
    id: uuidv4(),
    name,
    role,
    location,
    assignedDevice:device,
  };
  const employees = readEmployees();
  employees.push(newEmployee);
  writeEmployees(employees);

  return NextResponse.json(newEmployee, { status: 201 });
}



export async function GET() {
  const employees = readEmployees();
  return NextResponse.json({ employees });
}
