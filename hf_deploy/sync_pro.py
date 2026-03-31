from huggingface_hub import HfApi, login
import os
import sys

token = "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"
repo_id = "Maamoun0/filemind-backend"
folder = "c:/Users/Maamoun/Downloads/antygravity/easy tool 1/hf_deploy"

print("Starting Surgical Sync Pro...")
try:
    print("Authenticating...")
    login(token=token, add_to_git_credential=False)
    
    api = HfApi()
    print(f"Successfully authenticated as: {api.whoami()['name']}")
    
    print(f"Targeting Space: {repo_id}")
    print(f"Uploading from: {folder}")
    
    api.upload_folder(
        folder_path=folder,
        repo_id=repo_id,
        repo_type="space",
        commit_message="Final Surgical Sync - Bypass Web Editor Corruption",
        # delete_patterns=["*"] # Not using delete_patterns to be safe for now, just overwrite
    )
    print("--- SUCCESS ---")
    print("Files uploaded successfully. Check Hugging Face for the new build.")
    
except Exception as e:
    print(f"--- FAILED ---")
    print(f"Error details: {e}")
    sys.exit(1)
