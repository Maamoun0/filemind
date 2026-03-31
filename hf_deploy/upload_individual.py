from huggingface_hub import HfApi, login
import os

token = "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"
repo_id = "Maamoun0/filemind-backend"
local_folder = "c:/Users/Maamoun/Downloads/antygravity/easy tool 1/hf_deploy"

print("--- Step-by-Step Surgical Upload ---")
login(token=token, add_to_git_credential=False)
api = HfApi()

files_to_upload = [
    "Dockerfile",
    "requirements.txt",
    "app/main.py",
    "app/models/schemas.py",
    "app/routers/tools.py",
    "app/services/database.py",
    "app/services/queue.py",
    "app/config.py"
]

for file in files_to_upload:
    local_path = os.path.join(local_folder, file)
    if os.path.exists(local_path):
        print(f"Uploading: {file}...")
        try:
            api.upload_file(
                path_or_fileobj=local_path,
                path_in_repo=file,
                repo_id=repo_id,
                repo_type="space",
                commit_message=f"Restore: {file} (Surgical Sync)"
            )
            print(f"SUCCESS: {file}")
        except Exception as e:
            print(f"FAILED: {file} - {e}")
    else:
        print(f"SKIP: {file} (not found locally)")

print("\n--- DONE ---")
