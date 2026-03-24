import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is required in environment variables.");
}

export function authenticateToken(request, response, next) {
  const authorizationHeader = request.headers.authorization || "";
  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    response.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    request.user = {
      id: decodedToken.userId,
      role: decodedToken.role,
      roleId: decodedToken.roleId,
      email: decodedToken.email,
      name: decodedToken.name,
    };
    next();
  } catch {
    response.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireRole(allowedRoles = []) {
  return (request, response, next) => {
    const currentRole = String(request.user?.role ?? "").toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map((role) => String(role).toLowerCase());

    if (!normalizedAllowedRoles.includes(currentRole)) {
      response.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  };
}
