from cryptography.fernet import Fernet
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
KEY_FILE = PROJECT_ROOT / "keys" / "secret.key"

def load_key():
    if not KEY_FILE.exists():
        print("❌ No key found! Generate a key first.")
        return None
    return KEY_FILE.read_bytes()

def decrypt_file(path):
    encrypted_path = Path(path)
    if not encrypted_path.exists():
        print("❌ File not found!")
        return

    key = load_key()
    if key is None:
        return 

    f = Fernet(key)
    data = encrypted_path.read_bytes()

    try:
        decrypted = f.decrypt(data)
    except:
        print("❌ Wrong key or corrupted file!")
        return

    # remove .enc
    output_name = encrypted_path.with_suffix('')
    output_name.write_bytes(decrypted)

    print("✅ File decrypted!")
    print("📁 Saved as:", output_name)

# --------- VERY IMPORTANT PART ---------
if __name__ == "__main__":
    file_path = input("Enter encrypted file path: ")
    decrypt_file(file_path)
