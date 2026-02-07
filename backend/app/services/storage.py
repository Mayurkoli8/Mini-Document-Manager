import os
import shutil
from uuid import uuid4

UPLOAD_DIR = "app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def get_unique_filename(filename: str):
    name, ext = os.path.splitext(filename)
    counter = 1
    new_filename = filename

    while os.path.exists(os.path.join(UPLOAD_DIR, new_filename)):
        new_filename = f"{name} ({counter}){ext}"
        counter += 1

    return new_filename

def save_file(file):
    unique_filename = get_unique_filename(file.filename)
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return unique_filename, os.path.getsize(file_path)

def calculate_storage_used(documents):
    return sum(d["size"] for d in documents)
