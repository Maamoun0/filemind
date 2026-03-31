from huggingface_hub import HfApi
import os

token = "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"
repo_id = "Maamoun0/filemind-backend"
folder = "c:/Users/Maamoun/Downloads/antygravity/easy tool 1/hf_deploy"

print(f"Starting upload of {folder} to {repo_id}...")
api = HfApi(token=token)
try:
    api.upload_folder(
        folder_path=folder,
        repo_id=repo_id,
        repo_type="space",
        commit_message="Autonomous high-fidelity sync to resolve indentation corruption",
        delete_patterns=["*"] # Optional: ensures the remote matches local exactly
    )
    print("Upload complete!")
except Exception as e:
    print(f"Error during upload: {e}")
