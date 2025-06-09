import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";

const filePath = path.join(process.cwd(), "users.json");
const SECRET = process.env.AUTH_SECRET || "super-secret";

function readUsers() {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeUsers(data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// POST /api/users?action=signup OR login
export async function POST(req: NextRequest) {
  const { name, email, password, role } = await req.json();
  const action = req.nextUrl.searchParams.get("action");

  const users = readUsers();
  const user = users.find((u: any) => u.email === email);

  if (action === "signup") {
    if (user) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // NOTE: In production, always hash passwords!
      role: role || "Employee",
    };

    users.push(newUser);
    writeUsers(users);

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, SECRET, { expiresIn: "1h" });

    return NextResponse.json({ token, user: { name, email, role } });
  }

  if (action === "login") {
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "1h" });

    return NextResponse.json({ token, user: { name: user.name, email, role: user.role } });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
