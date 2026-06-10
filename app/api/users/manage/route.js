import { User } from "@/db/models";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

//   UPDATE USER
export async function PATCH(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userid = searchParams.get("id"); //   safe, no URL encoding issues

    const formData = await req.formData();
    const body = Object.fromEntries(formData.entries());

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
      updateData.e_signature = `/uploads/signatures/${filename}`;
    }

    const allowedFields = [
      "firstname",
      "lastname",
      "email",
      "role",
      "department",
      "position",
    ];
    const updateData = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined && body[field] !== "") {
        updateData[field] = body[field];
      }
    }

    if (body.password && body.password.trim() !== "") {
      updateData.password = await bcrypt.hash(body.password, 10);
    }

    console.log("Updating userID:", userid, "with:", updateData);

    const [rowsAffected] = await User.update(updateData, {
      where: { userID: userid }, //   exact match, no encoding issues
    });

    console.log("Rows affected:", rowsAffected);

    if (rowsAffected === 0) {
      return NextResponse.json(
        { error_message: "User not found or nothing changed" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Updated OK" }, { status: 200 });
  } catch (error) {
    console.error("PATCH error:", error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//   PERMANENT DELETE
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userid = searchParams.get("id");

    await User.destroy({
      where: { userID: userid }, //   Permanent delete na, hindi lang status update
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
