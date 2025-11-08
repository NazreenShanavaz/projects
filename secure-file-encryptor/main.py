import os
from encryption.encrypt import encrypt_file, generate_key
from encryption.decrypt import decrypt_file

def main_menu():
    while True:
        print("\n===== Secure File Encryptor =====")
        print("1. Generate Encryption Key")
        print("2. Encrypt a File")
        print("3. Decrypt a File")
        print("4. Exit")

        choice = input("Choose an option (1-4): ")

        if choice == "1":
            generate_key()

        elif choice == "2":
            path = input("Enter file path to encrypt: ")
            encrypt_file(path)

        elif choice == "3":
            path = input("Enter file path to decrypt: ")
            decrypt_file(path)

        elif choice == "4":
            print("👍 Exiting...")
            break

        else:
            print("❌ Invalid choice, try again.")

if __name__ == "__main__":
    main_menu()
