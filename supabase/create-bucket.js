const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "../.env.local");
if (!fs.existsSync(envPath)) {
  console.error("File .env.local tidak ditemukan!");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const parts = line.split("=");
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
    env[key] = value;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("URL atau Service Key tidak ditemukan di .env.local!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log("Mencoba membuat bucket 'car-images'...");
  const { data, error } = await supabase.storage.createBucket("car-images", {
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ["image/*"],
  });

  if (error) {
    if (error.message && error.message.includes("already exists")) {
      console.log("Bucket 'car-images' sudah ada.");
    } else {
      console.error("Gagal membuat bucket:", error.message);
      process.exit(1);
    }
  } else {
    console.log("Bucket 'car-images' berhasil dibuat!");
  }
}

run();
