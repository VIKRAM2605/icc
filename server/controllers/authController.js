import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { randomUUID } from "crypto";
import db from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is required in environment variables.");
}

const sanitizeUser = (userRow) => ({
  id: userRow.id,
  name: userRow.name,
  email: userRow.email,
  roleId: userRow.role_id,
  roleName: userRow.role_name,
});

const issueToken = (user) =>
  jwt.sign(
    {
      userId: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      role: user.roleName,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

const getUserByEmail = async (email) => {
  const users = await db`
    SELECT
      users.id,
      users.name,
      users.email,
      users.password_hash,
      users.role_id,
      roles.name AS role_name
    FROM users
    INNER JOIN roles ON roles.id = users.role_id
    WHERE lower(users.email) = ${email}
    LIMIT 1
  `;

  return users[0] || null;
};

export async function login(request, response, next) {
  try {
    const email = String(request.body?.email ?? "").trim().toLowerCase();
    const password = String(request.body?.password ?? "");

    if (!email || !password) {
      response.status(400).json({ message: "Email and password are required." });
      return;
    }

    const userRow = await getUserByEmail(email);
    if (!userRow) {
      response.status(401).json({ message: "Invalid email or password." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, userRow.password_hash);
    if (!isPasswordValid) {
      response.status(401).json({ message: "Invalid email or password." });
      return;
    }

    const user = sanitizeUser(userRow);
    const token = issueToken(user);

    response.status(200).json({
      message: "Login successful.",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function googleLogin(request, response, next) {
  try {
    if (!GOOGLE_CLIENT_ID) {
      response.status(500).json({ message: "Google Sign-In is not configured on server." });
      return;
    }

    const credential = String(request.body?.credential ?? "").trim();

    if (!credential) {
      response.status(400).json({ message: "Google credential is required." });
      return;
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = String(payload?.email ?? "").trim().toLowerCase();
    const emailVerified = Boolean(payload?.email_verified);
    const name = String(payload?.name ?? payload?.given_name ?? "User").trim();

    if (!email || !emailVerified) {
      response.status(401).json({ message: "Unable to verify Google account." });
      return;
    }

    let userRow = await getUserByEmail(email);

    if (!userRow) {
      const passwordHash = await bcrypt.hash(randomUUID(), 10);

      await db`
        INSERT INTO users (name, email, password_hash)
        VALUES (${name || "User"}, ${email}, ${passwordHash})
      `;

      userRow = await getUserByEmail(email);
    }

    if (!userRow) {
      response.status(500).json({ message: "Failed to complete Google sign-in." });
      return;
    }

    const user = sanitizeUser(userRow);
    const token = issueToken(user);

    response.status(200).json({
      message: "Google login successful.",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function me(request, response, next) {
  try {
    const userId = Number(request.user?.id);

    if (!Number.isFinite(userId)) {
      response.status(401).json({ message: "Unauthorized" });
      return;
    }

    const users = await db`
      SELECT
        users.id,
        users.name,
        users.email,
        users.role_id,
        roles.name AS role_name
      FROM users
      INNER JOIN roles ON roles.id = users.role_id
      WHERE users.id = ${userId}
      LIMIT 1
    `;

    const userRow = users[0];
    if (!userRow) {
      response.status(404).json({ message: "User not found." });
      return;
    }

    response.status(200).json({
      message: "User profile fetched successfully.",
      data: {
        user: sanitizeUser(userRow),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(_request, response) {
  response.status(200).json({ message: "Logout successful." });
}
