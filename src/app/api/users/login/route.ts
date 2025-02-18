import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const mockUser = {
    email: "melvinbayogo@gmail.com",
    password: "$2b$10$Ax0FwzqRE4OGpyWsZz02dOoMV54CqBrYTIMuM7ktK1R7nk0i.PIr.", // "password123" hashed
}

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync("password123", salt);

console.log(salt, hash);

const JWT_SECRET = process.env.JWT_SECRET || "vOdw9pCXY8+q3EjP2sJp6YB9U2hJG7T4KcI7xHtrGGM=";

export const POST = async (request: NextRequest) => {
    let message: string;

    try {
        await connectDB();
        const { email, password } = await request.json();

        // check if email exists
        if (email !== mockUser.email) {
            return NextResponse.json({ error: "Invalid Email" }, { status: 401 });
        }

        // validate password
        const isMatch = await bcrypt.compare(password, mockUser.password);

        if (!isMatch) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        // generate JWT token
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

        // return token
        return NextResponse.json({ token }, { status: 200 });
    } catch (error: unknown) {
        message = "Something went wrong";

        if (error instanceof Error) {
            message = `Error: ${error.message}`;
        }

        return NextResponse.json({ message }, { status: 400} );
    }
}