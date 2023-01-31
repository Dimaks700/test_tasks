# using pydicom, sort the .dcm files into folders according to the values in their 
# dataset, and then create a file mapping the old file paths to the new ones

import pydicom
import os
from shutil import copy2

pwd = os.getcwd()
src = os.path.join(pwd, "src")
file_path_mapping = open("file_path_mapping.txt", "a")

for i, filename in enumerate(os.listdir(src), 1):
    filepath = os.path.join(src, filename)
    dataset = pydicom.dcmread(filepath)
    if "PatientName" in dataset:
        dataset.PatientName = None
    StudyInstanceUID = dataset["StudyInstanceUID"].value
    SeriesInstanceUID = dataset["SeriesInstanceUID"].value
    SOPInstanceUID = dataset["SOPInstanceUID"].value
    if StudyInstanceUID not in os.listdir(pwd):
        os.mkdir(StudyInstanceUID)
    if SeriesInstanceUID not in os.listdir(os.path.join(pwd, StudyInstanceUID)):
        os.mkdir(os.path.join(pwd, StudyInstanceUID, SeriesInstanceUID))
    new_adress = os.path.join(pwd, StudyInstanceUID, SeriesInstanceUID)
    if SOPInstanceUID not in os.listdir(new_adress):
        copy2(filepath, new_adress)
        file_path_mapping.write(
            f"{i}. {filepath} - {os.path.join(new_adress, filename)}\n"
        )

file_path_mapping.close()
