import { SignJWT, jwtVerify } from "jose";
import { timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE_NAME = "cofengo_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 gun

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "SESSION_SECRET tanimli degil ya da cok kisa. .env dosyasina en az 16 karakterlik rastgele bir deger ekleyin."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(username: string): Promise<string> {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string
): Promise<{ username: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.username === "string") {
      return { username: payload.username };
    }
    return null;
  } catch {
    return null;
  }
}

function safeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export function checkCredentials(username: string, password: string): boolean {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    return false;
  }

  const usernameOk = safeStringEqual(username, expectedUsername);
  const passwordOk = safeStringEqual(password, expectedPassword);
  return usernameOk && passwordOk;
}

export const SESSION_MAX_AGE = SESSION_DURATION_SECONDS;
