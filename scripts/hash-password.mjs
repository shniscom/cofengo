// Kullanim: node scripts/hash-password.mjs "istediginiz-sifre"
// Ciktiyi .env dosyasindaki ADMIN_PASSWORD_HASH degiskenine yapistirin.
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error('Kullanim: node scripts/hash-password.mjs "sifreniz"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log("\nADMIN_PASSWORD_HASH icin asagidaki degeri kopyalayin:\n");
console.log(hash);
console.log("");
