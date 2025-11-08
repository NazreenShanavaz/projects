from cryptography.fernet import Fernet
from pathlib import Path
import os

# --- Paths (robust even if you run from anywhere) ---
PROJECT_ROOT = Path(__file__).resolve().parents[1]
KEYS_DIR = PROJECT_ROOT / "keys"
LOGS_DIR = PROJECT_ROOT / "logs"
KEY_FILE = KEYS_DIR / "secret.key"

# --- Key helpers ---
def generate_key():
    KEYS_DIR.mkdir(parents=True, exist_ok=True)
    key = Fernet.generate_key()
    KEY_FILE.write_bytes(key)
    print("✅ Secret key generated and saved as secret.key")

def load_key():
    if not KEY_FILE.exists():
        print("ℹ️  No key found, generating a new one...")
        generate_key()
    return KEY_FILE.read_bytes()

# --- Encrypt helper ---
def encrypt_file(input_path: str, out_dir: str | None = None):
    # Paths
    in_path = Path(input_path).expanduser().resolve()
    if not in_path.exists() or not in_path.is_file():
        print("❌ File not found:", in_path)
        return

    key = load_key()
    f = Fernet(key)

    data = in_path.read_bytes()
    encrypted = f.encrypt(data)

    # Decide output path
    if out_dir:
        out_dir = Path(out_dir).expanduser().resolve()
        out_dir.mkdir(parents=True, exist_ok=True)
        out_path = out_dir / (in_path.name + ".enc")
    else:
        out_path = in_path.with_suffix(in_path.suffix + ".enc")

    out_path.write_bytes(encrypted)

    # Basic log (no external lib yet)
    LOGS_DIR.mkdir(parents=True, exist_ok=True)
    with open(LOGS_DIR / "actions.log", "a", encoding="utf-8") as lg:
        lg.write(f"ENCRYPTED | {in_path} -> {out_path}\n")

    print(f"✅ Encrypted: {in_path.name}")
    print(f"📦 Saved as:  {out_path}")

# --- CLI for quick testing ---
if __name__ == "__main__":
    # Simple prompt (so you can just run: python encryption/encrypt.py)
    file_to_encrypt = input("Enter path of the file to encrypt: ").strip().strip('"')
    # Tip: you can press Tab in PowerShell to autocomplete paths
    if file_to_encrypt:
        encrypt_file(file_to_encrypt)
