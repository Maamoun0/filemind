from huggingface_hub import HfApi, login
import os

token = "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"
repo_id = "Maamoun0/filemind-backend"
folder = "c:/Users/Maamoun/Downloads/antygravity/easy tool 1/hf_deploy"

print("Starting FINAL ENTIRE FOLDER Sync...")
login(token=token, add_to_git_credential=False)
api = HfApi()

try:
    print(f"Uploading entire folder {folder} to {repo_id}...")
    api.upload_folder(
        folder_path=folder,
        repo_id=repo_id,
        repo_type="space",
        commit_message="Final Clean Sync: Overwrite Web-Editor Corruption (Indentation Fixed)",
        # delete_patterns=["*"] # No, let's keep it safe. Just overwrite.
    )
    print("--- SUCCESS: Sync Complete ---")
except Exception as e:
    print(f"--- FAILED: {e} ---")
