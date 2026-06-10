import sequelize from "@/db/connection";
import { User } from "@/db/models";
import { validationRequiredFields } from "@/functions/validations";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { generatUserID } from "@/functions/autogenerate";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

//   CREATE USER
export async function POST(request) {
  try {
    await sequelize.sync();

    const formData = await request.formData();
    const user = Object.fromEntries(formData.entries());

    console.log("USER:", user);

    //   Handle e_signature file upload
    const signatureFile = formData.get("e_signature");
    if (
      signatureFile &&
      signatureFile instanceof File &&
      signatureFile.size > 0
    ) {
      const buffer = Buffer.from(await signatureFile.arrayBuffer());
      const uploadDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "signatures",
      );
      await mkdir(uploadDir, { recursive: true });
      const filename = `${Date.now()}-${signatureFile.name}`;
      await writeFile(path.join(uploadDir, filename), buffer);
      user.e_signature = `/uploads/signatures/${filename}`; // ← path lang ang stored sa DB
    } else {
      delete user.e_signature; // ← alisin kung walang file
    }

    if (!user.password || user.password.trim() === "") {
      user.password = "Default@123";
    }

    const requiredFields = [
      "lastname",
      "firstname",
      "department",
      "position",
      "role",
    ];
    const validation = await validationRequiredFields(requiredFields, [user]);

    if (validation && Object.keys(validation).length > 0) {
      return NextResponse.json({ error_message: validation }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const userID = await generatUserID(user.lastname);

    const created = await User.create({
      ...user,
      userID,
      password: hashedPassword,
      status: "Active",
    });

    return NextResponse.json({ created }, { status: 201 });
  } catch (error) {
    console.error("❌ POST ERROR:", error.message);
    console.error("❌ FULL ERROR:", JSON.stringify(error, null, 2));
    return NextResponse.json({ error_message: error.message }, { status: 500 });
  }
}

//   GET USERS
export async function GET() {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error_message: error.message }, { status: 500 });
  }
}
